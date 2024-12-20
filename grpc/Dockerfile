FROM node:18-bookworm-slim

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 50051

CMD ["pnpm", "grpcstart"]
