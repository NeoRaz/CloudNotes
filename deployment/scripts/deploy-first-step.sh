#!/bin/bash
set -e

ENVIRONMENT=${1:-local}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🚀 Starting first step of CloudNotes deployment ($ENVIRONMENT)..."

# The first two scripts are not necessary if you have already set up Minikube.
# Becareful with the first script as it will delete your existing Minikube cluster.

$SCRIPT_DIR/00-reset.sh
$SCRIPT_DIR/01-setup-minikube.sh

$SCRIPT_DIR/02-build-server.sh "$ENVIRONMENT"
$SCRIPT_DIR/03-app-key-generation.sh "$ENVIRONMENT"


echo "🎉 First step completed successfully!"
