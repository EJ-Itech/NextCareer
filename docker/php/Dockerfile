# ----------------------------
# Base PHP image (stable Debian)
# ----------------------------
FROM php:8.2-fpm-bookworm

# ----------------------------
# Install system dependencies and PHP extensions
# ----------------------------
RUN set -eux; \
    for i in 1 2 3; do apt-get update && break || sleep 5; done && \
    apt-get install -y --no-install-recommends \
        git \
        curl \
        libpq-dev \
        postgresql-client \
        zip \
        unzip \
        libzip-dev \
        libonig-dev \
        libxml2-dev \
        iproute2 \
        procps \
        sudo \
        supervisor && \
    docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath xml zip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# ----------------------------
# Install Composer
# ----------------------------
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# ----------------------------
# Set working directory
# ----------------------------
WORKDIR /var/www

# ----------------------------
# Copy backend files
# ----------------------------
COPY composer.json composer.lock ./
COPY app ./app
COPY routes ./routes
COPY config ./config
COPY database ./database
COPY bootstrap ./bootstrap
COPY resources/views ./resources/views
COPY artisan ./

# ----------------------------
# Install PHP dependencies
# ----------------------------
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# ----------------------------
# Supervisor config
# ----------------------------
COPY docker/supervisor/reverb.conf /etc/supervisor/conf.d/reverb.conf

# ----------------------------
# Set permissions
# ----------------------------
RUN mkdir -p /var/www/storage /var/www/bootstrap/cache && \
    chown -R www-data:www-data /var/www && \
    chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# ----------------------------
# Copy entrypoint script
# ----------------------------
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ----------------------------
# Expose PHP-FPM port
# ----------------------------
EXPOSE 9000

# ----------------------------
# Start container
# ----------------------------
# ENTRYPOINT ["docker-entrypoint.sh"]
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
