#!/bin/bash
set -e

echo "🧹 Clearing Laravel caches..."
php artisan optimize:clear || true

echo "🚀 Starting PHP-FPM..."
exec "$@"
