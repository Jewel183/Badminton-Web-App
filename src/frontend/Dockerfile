FROM node:20-alpine AS build-stage

WORKDIR /app

RUN apk update && apk upgrade --no-cache
RUN npm install -g npm@latest

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

# --- STAGE NGINX ---
FROM nginx:alpine

RUN apk update && apk upgrade --no-cache

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]