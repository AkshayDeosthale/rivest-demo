FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci

COPY nest-cli.json tsconfig.json tsconfig.base.json tsconfig.build.json ./
COPY libs ./libs
COPY apps/order-service ./apps/order-service

RUN npx prisma generate --schema=libs/prisma/prisma/schema.prisma
RUN npx nest build order-service

FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/libs ./libs

WORKDIR /app
EXPOSE 3002 50052

CMD ["node", "dist/apps/order-service/apps/order-service/src/main.js"]
