FROM php:8.1-fpm

WORKDIR /var/www/server

RUN apt-get update && apt-get install -y \
    libzip-dev \
    curl \
    zip \
    && docker-php-ext-install pdo_mysql

COPY composer.json .

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

RUN composer install

CMD ["php-fpm"]