#!/bin/bash
set -e

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" > /dev/null 2>&1; do
  sleep 2
done
echo "PostgreSQL is ready!"

# Storage link
if [ ! -L public/storage ]; then
    php artisan storage:link
fi

# Clear caches
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Run migrations
php artisan migrate --force || echo "Migrations skipped"

# Export env safely
set -a
source .env
set +a

# Start supervisord **as PID 1**
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/reverb.conf -n
