FROM node:20-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY package*.json .npmrc ./
RUN npm ci

COPY nest-cli.json tsconfig.json tsconfig.base.json tsconfig.build.json ./
COPY libs ./libs
COPY apps/gateway ./apps/gateway

RUN npx prisma generate --schema=libs/prisma/prisma/schema.prisma
RUN npx nest build gateway

FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/libs ./libs
COPY --from=builder /app/apps/gateway/views ./apps/gateway/views

WORKDIR /app
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy --schema=libs/prisma/prisma/schema.prisma && node dist/apps/gateway/apps/gateway/src/main.js"]
