# Frontend
# We assume that music is pre-built.
FROM node:16-alpine AS frontend-build

# RUN apk add --no-cache brotli

WORKDIR /app

COPY package*.json .
RUN npm clean-install

COPY public public
COPY *.json .
COPY *.js .
COPY .eslintrc .
COPY src src

RUN npm run build

# TODO: Merge this dockerfile with the other nginx Dockerfile.
# Disable this when using apache
RUN for file in dist/*; do \
        gzip "$file" --best; \
        touch "$file"; \
    done
RUN for file in dist/**/*; do \
        gzip "$file" --best; \
        touch "$file"; \
    done

# Finale
# FROM httpd:alpine
# FROM nginx:stable-alpine
FROM fholzer/nginx-brotli:latest

COPY docker/nginx-gz/nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html
# COPY --from=frontend-build /app/dist /usr/local/apache2/htdocs/

RUN ln -s /usr/share/nginx/html/ /usr/share/nginx/html/sangbok
RUN ln -s /usr/share/nginx/html/ /usr/share/nginx/html/sangbok2