# Frontend
# We assume that music is pre-built.
FROM node:16-alpine AS frontend-build

WORKDIR /app

COPY package*.json .
RUN npm clean-install

COPY public public
COPY *.json .
COPY *.js .
COPY .eslintrc .
COPY src src

RUN npx vue-cli-service build --modern

# Precompress assets
RUN apk add --no-cache brotli
RUN for file in dist/**/*; do \
        brotli "$file" --best --keep; \
        gzip "$file" --best; \
        touch "$file"; \
    done
RUN for file in dist/*; do \
        brotli "$file" --best --keep; \
        gzip "$file" --best; \
        touch "$file"; \
    done


# Finale
FROM fholzer/nginx-brotli:latest

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html

RUN ln -s /usr/share/nginx/html/ /usr/share/nginx/html/sangbok
RUN ln -s /usr/share/nginx/html/ /usr/share/nginx/html/sangbok2