#!/bin/sh

echo "⏳ Waiting for database..."

# wait for postgres
until nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "✅ Database is up!"

echo "📦 Running migrations..."
npx knex migrate:latest --env $NODE_ENV --knexfile database/knexfile.js

if [ "$NODE_ENV" = "staging" ]; then
  echo "🌱 Running seeds (staging only)..."
  npx knex seed:run --env staging --knexfile database/knexfile.js
fi

echo "🚀 Starting server..."
npm start