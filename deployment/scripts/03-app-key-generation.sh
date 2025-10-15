#!/bin/bash
set -e

ENVIRONMENT=${1:-local}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ENV_FILE="$PROJECT_ROOT/deployment/envs/${ENVIRONMENT}.env"

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

# 1️⃣ Wait for server deployment
echo "⏳ Waiting for server deployment to be available..."
kubectl wait --for=condition=available deployment/server -n "$NAMESPACE" --timeout=300s

# 2️⃣ Get server pod name
echo "⏳ Waiting for server pod to be created..."
until SERVER_POD=$(kubectl get pods -n "$NAMESPACE" -l app=server -o jsonpath='{.items[0].metadata.name}') && [ -n "$SERVER_POD" ]; do
  sleep 5
done
echo "✅ Found server pod: $SERVER_POD"

# 3️⃣ Generate APP_KEY if PLACE_HOLDER
if [ "$APP_KEY" = "PLACE_HOLDER" ]; then
  # Use kubectl exec on the running pod to generate the key
  APP_KEY=$(kubectl exec -n "$NAMESPACE" "$SERVER_POD" -- sh -c "php /var/www/html/artisan key:generate --show")
  sed -i '' "s|APP_KEY=.*|APP_KEY=$APP_KEY|" "$ENV_FILE"
  echo "✅ Generated APP_KEY: $APP_KEY"
else
  echo "✅ APP_KEY already set."
fi

# 4️⃣ Update cloudnotes-env secret
# This step is critical to ensure the server pod has the correct (and potentially new) APP_KEY
echo "🔐 Updating cloudnotes-env secret..."
kubectl -n "$NAMESPACE" delete secret cloudnotes-env --ignore-not-found
kubectl -n "$NAMESPACE" create secret generic cloudnotes-env \
  --from-literal=APP_NAME="CloudNotesServer" \
  --from-literal=APP_KEY="$APP_KEY" \
  --from-literal=APP_ENV="$APP_ENV" \
  --from-literal=APP_DEBUG="$APP_DEBUG" \
  --from-literal=APP_URL="$APP_URL" \
  --from-literal=APP_TIMEZONE="$APP_TIMEZONE" \
  --from-literal=APP_LOCALE="$APP_LOCALE" \
  --from-literal=APP_FALLBACK_LOCALE="$APP_FALLBACK_LOCALE" \
  --from-literal=APP_FAKER_LOCALE="$APP_FAKER_LOCALE" \
  \
  --from-literal=DB_CONNECTION="$DB_CONNECTION" \
  --from-literal=DB_HOST="$DB_HOST" \
  --from-literal=DB_PORT="$DB_PORT" \
  --from-literal=DB_DATABASE="$DB_DATABASE" \
  --from-literal=DB_USERNAME="$DB_USERNAME" \
  --from-literal=DB_PASSWORD="$DB_PASSWORD" \
  \
  --from-literal=REDIS_CLIENT="$REDIS_CLIENT" \
  --from-literal=REDIS_HOST="$REDIS_HOST" \
  --from-literal=REDIS_PORT="$REDIS_PORT" \
  --from-literal=REDIS_PASSWORD="$REDIS_PASSWORD" \
  \
  --from-literal=QUEUE_CONNECTION="$QUEUE_CONNECTION" \
  --from-literal=CACHE_STORE="$CACHE_STORE" \
  --from-literal=CACHE_PREFIX="$CACHE_PREFIX" \
  --from-literal=SESSION_DRIVER="$SESSION_DRIVER" \
  --from-literal=SESSION_LIFETIME="$SESSION_LIFETIME" \
  --from-literal=SESSION_ENCRYPT="$SESSION_ENCRYPT" \
  --from-literal=SESSION_PATH="$SESSION_PATH" \
  --from-literal=SESSION_DOMAIN="$SESSION_DOMAIN" \
  \
  --from-literal=MAIL_MAILER="$MAIL_MAILER" \
  --from-literal=MAIL_HOST="$MAIL_HOST" \
  --from-literal=MAIL_PORT="$MAIL_PORT" \
  --from-literal=MAIL_USERNAME="$MAIL_USERNAME" \
  --from-literal=MAIL_PASSWORD="$MAIL_PASSWORD" \
  --from-literal=MAIL_ENCRYPTION="$MAIL_ENCRYPTION" \
  --from-literal=MAIL_FROM_ADDRESS="$MAIL_FROM_ADDRESS" \
  --from-literal=MAIL_FROM_NAME="$MAIL_FROM_NAME" \

# 5️⃣ Restart server pods (to pick up the new secret)
echo "🔄 Restarting server deployment to apply new environment variables..."
kubectl rollout restart deployment/server -n "$NAMESPACE"
# Wait for the restart to complete and a new pod to be ready
kubectl wait --for=condition=available deployment/server -n "$NAMESPACE" --timeout=180s

echo "✅ ENV file updated with Laravel APP_KEY."