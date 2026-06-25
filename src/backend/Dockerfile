FROM node:20-alpine

WORKDIR /app

RUN apk update && apk upgrade --no-cache && apk add --no-cache curl

RUN npm install -g npm@latest

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 4000

CMD ["npm", "start"]