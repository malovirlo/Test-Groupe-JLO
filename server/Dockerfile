FROM php:8.1.18-fpm

RUN docker-php-ext-install pdo_mysql

RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    && docker-php-ext-install zip

COPY . /var/www/server

COPY --from=composer /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/server

RUN composer install

RUN chmod -R 777 /var/www/server

RUN php artisan key:generate

CMD ["php-fpm"]