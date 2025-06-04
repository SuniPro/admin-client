# First Stage: Build
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./

# Optional deps 설치 + rollup native 바이너리 직접 설치
RUN npm ci --include=optional \
  && npm install --save-dev @rollup/rollup-linux-x64-gnu

COPY .env.production .env
COPY . .

# Vite 빌드
RUN npm run build

# Second Stage: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/log/nginx

EXPOSE 5010

CMD ["nginx", "-g", "daemon off;"]
