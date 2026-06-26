FROM node:24.18.0-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

FROM alpine:3.24

WORKDIR /app

RUN apk update && apk upgrade --no-cache && apk add --no-cache nodejs curl

COPY --from=builder /app /app

EXPOSE 4000

CMD ["node", "server.js"]

