# Frontend
FROM node:16-alpine AS frontend-build

WORKDIR /app

COPY package*.json .
RUN npm clean-install

COPY public public
COPY *.json .
COPY *.js .
COPY .eslintrc .
COPY src src

RUN npm run build

# Finale
FROM sebp/lighttpd:latest
COPY --from=frontend-build /app/dist /var/www/localhost/htdocs