FROM node:23

ENV CI=true

RUN npm install -g pnpm

WORKDIR /app
COPY . .

WORKDIR /app/ViteFE
RUN pnpm install
RUN pnpm run build

WORKDIR /app/weaviate-api
RUN pnpm install

EXPOSE 4173 3000

WORKDIR /app
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

CMD ["sh", "entrypoint.sh"]
