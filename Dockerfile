# First Stage: Build
FROM node:22 AS build

WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY .env.production .env
COPY . .


RUN pnpm build

# Second Stage: Serve with Nginx
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /app/dist .

COPY nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/log/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
