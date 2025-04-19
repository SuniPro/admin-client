# First Stage: Build
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY .env.production .env
COPY . .


RUN npm run build

# Second Stage: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/log/nginx

EXPOSE 5010

CMD ["nginx", "-g", "daemon off;"]
