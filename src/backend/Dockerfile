FROM node:24.18.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

FROM alpine:3.24

WORKDIR /app

RUN apk update && apk upgrade --no-cache && apk add --no-cache curl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server.js ./

COPY --from=builder /app/config ./config
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/routes ./routes

EXPOSE 4000

CMD ["node", "server.js"]

