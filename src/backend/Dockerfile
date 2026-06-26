FROM node:24.18.0-alpine

WORKDIR /app

RUN apk update && apk upgrade --no-cache && apk add --no-cache curl

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 4000

CMD ["npm", "start"]