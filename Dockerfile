# First Stage: Build
FROM node:20 AS build

WORKDIR /app

# Optional dependencies 문제 회피용 설정 추가
RUN npm config set optional true

COPY package*.json ./

# npm install 대신 ci, 단 실패 방지용 --legacy-peer-deps 옵션도 가능
RUN npm install --legacy-peer-deps

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
