echo "OPENAI_API_KEY is set to: $OPENAI_API_KEY"

cd /app/ViteFE && pnpm run preview &
cd /app/weaviate-api && pnpm run start:prod &

wait