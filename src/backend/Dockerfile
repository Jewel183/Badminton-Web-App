FROM node:24.18.0-alpine3.24 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

FROM alpine:3.24

WORKDIR /app

RUN apk update && apk upgrade --no-cache \
    && apk add --no-cache libstdc++ libgcc curl tini \
    && addgroup -S nodejs && adduser -S nodeuser -G nodejs

COPY --from=builder /usr/local/bin/node /usr/local/bin/node
COPY --from=builder --chown=nodeuser:nodejs /app /app

RUN mkdir -p /app/uploads && chown -R nodeuser:nodejs /app/uploads

EXPOSE 4000
USER nodeuser
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "server.js"]

