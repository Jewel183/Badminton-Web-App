FROM node:24.18.0-alpine3.23 AS build-stage

WORKDIR /app

RUN apk update && apk upgrade --no-cache

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# --- STAGE NGINX ---
FROM nginx:1.31.2-alpine3.23

RUN apk update && apk upgrade --no-cache

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]