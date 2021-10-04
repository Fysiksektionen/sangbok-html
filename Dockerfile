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

# TODO: Use brotli with nginx-brunzip instead.
RUN for file in dist/**/*; do \
        gzip "$file" --best; \
        touch "$file"; \
    done

# Finale
# FROM nginx:stable-alpine
FROM fholzer/nginx-brotli:latest

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html
RUN ln -s /usr/share/nginx/html/ /usr/share/nginx/html/sangbok
RUN ln -s /usr/share/nginx/html/ /usr/share/nginx/html/sangbok2