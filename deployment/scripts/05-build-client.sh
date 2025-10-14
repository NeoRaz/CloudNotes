#!/bin/bash
set -e

ENVIRONMENT=${1:-local}
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
CLIENT_DIR="$PROJECT_ROOT/client"
ENV_FILE="$PROJECT_ROOT/deployment/envs/${ENVIRONMENT}.env"

echo "🚀 Starting second step of CloudNotes deployment ($ENVIRONMENT)..."

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file not found: $ENV_FILE"
  exit 1
fi

# Load environment variables
set -a
source "$ENV_FILE"
set +a

if [ "$ENVIRONMENT" == "local" ]; then
  echo "🐳 Setting Docker to Minikube daemon..."
  eval $(minikube docker-env)
fi

echo "📦 Building client Docker image..."
docker build \
  -t cloudnotes-client:latest \
  --build-arg REACT_APP_ENV="$REACT_APP_NODE_ENV" \
  --build-arg REACT_APP_API_BASE_URL="$REACT_APP_API_BASE_URL" \
  --build-arg REACT_APP_CLIENT_ID="$REACT_APP_CLIENT_ID" \
  --build-arg REACT_APP_CLIENT_SECRET="$REACT_APP_CLIENT_SECRET" \
  --build-arg REACT_APP_SECRET_KEY="$REACT_APP_SECRET_KEY" \
  "$CLIENT_DIR"

# 🐳 Handle environment-based publishing
if [ "$ENVIRONMENT" == "prod" ]; then
  echo "🔐 Creating or updating Docker registry secret in Kubernetes..."
  kubectl -n "$NAMESPACE" delete secret regcred --ignore-not-found
  kubectl -n "$NAMESPACE" create secret docker-registry regcred \
    --docker-username="$DOCKER_USERNAME" \
    --docker-password="$DOCKER_PASSWORD" \
    --docker-email="$DOCKER_EMAIL"

  echo "📤 Tagging and pushing client image to Docker Hub..."
  docker tag cloudnotes-client:latest "$DOCKER_USERNAME/cloudnotes-client:latest"
  docker push "$DOCKER_USERNAME/cloudnotes-client:latest"
fi

echo "✅ Client image built successfully."
