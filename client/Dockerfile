FROM node:latest AS builder

WORKDIR /var/www/client

COPY package*.json .

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:latest

COPY --from=builder /var/www/client /var/www/client

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]