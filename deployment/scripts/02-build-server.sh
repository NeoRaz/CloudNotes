#!/bin/bash
set -e

ENVIRONMENT=${1:-local}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SERVER_DIR="$PROJECT_ROOT/server"
ENV_FILE="$PROJECT_ROOT/deployment/envs/${ENVIRONMENT}.env"

FIRST_STEP_OVERLAY_PATH="$PROJECT_ROOT/k8s/overlays/${ENVIRONMENT}/first-step"
SECOND_STEP_OVERLAY_PATH="$PROJECT_ROOT/k8s/overlays/${ENVIRONMENT}/second-step"

echo "🚀 Starting CloudNotes deployment ($ENVIRONMENT)..."

SED_INPLACE="sed -i"
if [[ "$(uname)" == "Darwin" ]]; then
  SED_INPLACE="sed -i ''"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file not found: $ENV_FILE"
  exit 1
fi

# Load environment variables
set -a
source "$ENV_FILE"
set +a

# Ensure namespace exists
echo "📁 Ensuring namespace '$NAMESPACE' exists..."
kubectl get namespace "$NAMESPACE" >/dev/null 2>&1 || kubectl create namespace "$NAMESPACE"

# Recreate environment secret
echo "🔐 Creating environment secret..."
kubectl -n "$NAMESPACE" delete secret cloudnotes-env --ignore-not-found
kubectl -n "$NAMESPACE" create secret generic cloudnotes-env \
  --from-literal=APP_NAME="CloudNotesServer" \
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
  --from-literal=MAIL_FROM_NAME="$MAIL_FROM_NAME"


if [ "$ENVIRONMENT" == "local" ]; then
  echo "🐳 Setting Docker to Minikube daemon..."
  eval $(minikube docker-env)

  # Generate a unique image tag
  IMAGE_TAG="local-$(date +%s)"
  echo "🏷️ Using image tag: $IMAGE_TAG"

  echo "🛠️ Building local Docker image: cloudnotes-server:$IMAGE_TAG"
  docker build -t cloudnotes-server:$IMAGE_TAG "$SERVER_DIR"

  echo "🧩 Patching Kustomize overlay (first-step) with new server image..."
  (cd "$FIRST_STEP_OVERLAY_PATH" && kustomize edit set image cloudnotes-server=cloudnotes-server:$IMAGE_TAG)
  
  echo "🧩 Patching Kustomize overlay (second-step) with new server image..."
  (cd "$SECOND_STEP_OVERLAY_PATH" && kustomize edit set image cloudnotes-server=cloudnotes-server:$IMAGE_TAG)

else
  echo "☁️ Building and pushing Docker Hub image for production..."

  # Generate a unique image tag
  IMAGE_TAG=$(git rev-parse --short HEAD 2>/dev/null)
  if [ -z "$IMAGE_TAG" ]; then
    echo "❌ Could not get git hash. Make sure this is a git repository."
    exit 1
  fi
  echo "🏷️ Using image tag: $IMAGE_TAG"

  # Build image on the host daemon
  echo "🛠️ Building server Docker image: cloudnotes-server:$IMAGE_TAG"
  docker build -t cloudnotes-server:$IMAGE_TAG "$SERVER_DIR"

  # Ensure Docker credentials exist
  if [ -z "$DOCKER_USERNAME" ] || [ -z "$DOCKER_PASSWORD" ] || [ -z "$DOCKER_EMAIL" ]; then
    echo "❌ Missing Docker credentials in environment."
    exit 1
  fi

  echo "🔑 Creating Docker registry secret..."
  kubectl -n "$NAMESPACE" delete secret regcred --ignore-not-found
  kubectl -n "$NAMESPACE" create secret docker-registry regcred \
    --docker-username="$DOCKER_USERNAME" \
    --docker-password="$DOCKER_PASSWORD" \
    --docker-email="$DOCKER_EMAIL"

  echo "📤 Tagging and pushing server image to Docker Hub..."
  docker tag cloudnotes-server:$IMAGE_TAG "$DOCKER_USERNAME/cloudnotes-server:$IMAGE_TAG"
  docker tag cloudnotes-server:$IMAGE_TAG "$DOCKER_USERNAME/cloudnotes-server:latest"
  docker push "$DOCKER_USERNAME/cloudnotes-server:$IMAGE_TAG"
  docker push "$DOCKER_USERNAME/cloudnotes-server:latest"

  echo "🧩 Patching Kustomize overlay (first-step) with new server image..."
  (cd "$FIRST_STEP_OVERLAY_PATH" && \
    kustomize edit set image cloudnotes-server="$DOCKER_USERNAME/cloudnotes-server:$IMAGE_TAG")

  echo "🧩 Patching Kustomize overlay (second-step) with new server image..."
  (cd "$SECOND_STEP_OVERLAY_PATH" && \
    kustomize edit set image cloudnotes-server="$DOCKER_USERNAME/cloudnotes-server:$IMAGE_TAG")
fi

echo "📦 Applying Kustomize overlay for $ENVIRONMENT..."
kubectl apply -k "$FIRST_STEP_OVERLAY_PATH"

echo "⏳ Waiting for dependencies to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n "$NAMESPACE" --timeout=300s || exit 1
kubectl wait --for=condition=ready pod -l app=redis -n "$NAMESPACE" --timeout=300s || exit 1

echo "✅ Deployment complete for $ENVIRONMENT."