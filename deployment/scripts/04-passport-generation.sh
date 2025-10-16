#!/bin/bash
set -e

ENVIRONMENT=${1:-local}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/deployment/envs/${ENVIRONMENT}.env"

SED_INPLACE="sed -i"
if [[ "$(uname)" == "Darwin" ]]; then
  SED_INPLACE="sed -i ''"
fi


if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file not found: $ENV_FILE"
  exit 1
fi

# Load env vars
set -a
source "$ENV_FILE"
set +a

# Ensure namespace is set
if [ -z "$NAMESPACE" ]; then
  echo "❌ NAMESPACE is not defined in env file."
  exit 1
fi

# Re-fetch the new SERVER_POD name after the restart
until SERVER_POD=$(kubectl get pods -n "$NAMESPACE" -l app=server -o jsonpath='{.items[0].metadata.name}') && [ -n "$SERVER_POD" ]; do
  sleep 5
done

# Generate Laravel Passport Client Credentials (also as one-off)
if [ "$REACT_APP_CLIENT_ID" = "PLACE_HOLDER" ] || [ "$REACT_APP_CLIENT_SECRET" = "PLACE_HOLDER" ]; then
    echo "🏗️ Generating Laravel Passport Client Credentials..."

    echo "🔑 Ensuring Passport encryption keys are generated..."
    kubectl exec -n "$NAMESPACE" "$SERVER_POD" -- sh -c '
      cd /var/www/html &&
      chown -R www-data:www-data storage &&
      su -s /bin/sh www-data -c "php artisan config:clear && php artisan passport:keys --force" &&
      chown www-data:www-data storage/oauth-*.key &&
      chmod 600 storage/oauth-private.key &&
      chmod 644 storage/oauth-public.key'
      
    PASSPORT_OUTPUT=$(kubectl exec -n "$NAMESPACE" "$SERVER_POD" -- sh -c "php /var/www/html/artisan passport:client --password --name='Default Password Client'")

    # The client ID is the number on the first line; the secret is on the second-to-last line.
    CLIENT_ID=$(echo "$PASSPORT_OUTPUT" | grep -E 'Client ID' | awk '{print $NF}')
    CLIENT_SECRET=$(echo "$PASSPORT_OUTPUT" | grep -E 'Client secret' | awk '{print $NF}')

    if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
        echo "❌ Failed to generate Passport credentials."
        echo "Passport Output: $PASSPORT_OUTPUT"
        exit 1
    fi

    # Update the environment file on the host machine
    $SED_INPLACE "s|REACT_APP_CLIENT_ID=.*|REACT_APP_CLIENT_ID=$CLIENT_ID|" "$ENV_FILE"
    $SED_INPLACE "s|REACT_APP_CLIENT_SECRET=.*|REACT_APP_CLIENT_SECRET=$CLIENT_SECRET|" "$ENV_FILE"

    echo "🔐 Generated CLIENT_ID: $CLIENT_ID"
    echo "🔐 Generated CLIENT_SECRET: $CLIENT_SECRET"
else
    echo "✅ REACT_APP_CLIENT_ID and REACT_APP_CLIENT_SECRET already set."
fi

echo "✅ ENV file updated with  Passport credentials."