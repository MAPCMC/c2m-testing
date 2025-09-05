#!/bin/sh
set -e

# Function to wait for PostgreSQL to be ready
wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    until pg_isready -h "$DB_HOST" -p "${DB_PORT:-5432}" -U "$DB_USERNAME" -d "$DB_NAME"; do
        echo "PostgreSQL is unavailable - sleeping"
        sleep 2
    done
    echo "PostgreSQL is up - executing command"
}

# Only run migrations if we're starting the main application
if [ "$1" = "node" ] && [ "$2" = "server.js" ]; then
    # Wait for PostgreSQL to be ready
    wait_for_postgres
    
    # Run database migrations
    echo "Running database migrations..."
    pnpm run db:migrate
    
    # Start the application
    echo "Starting application..."
fi

exec "$@"
