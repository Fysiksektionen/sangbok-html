## No precompression.

##
##  Build frontend
##
FROM node:20-alpine AS frontend-build

RUN apk add --no-cache git

WORKDIR /app

# Install packages
COPY package*.json .
RUN npm clean-install

# We assume that music is pre-built, and that the proper files are stored in /public
# Go to the music folder and run ./convert.sh --compress if this is not the case.

# Copy files for build
COPY public public
COPY *.json .
COPY *.js .
COPY .eslintrc .
COPY src src
COPY .git .git

# Build app
RUN npx vue-cli-service build --modern

##
## Server
##
FROM fholzer/nginx-brotli:latest

# Transfer the built app to the nginx container, as well as add nginx config.
COPY docker/nginx/nginx.gz.conf /etc/nginx/nginx.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# Create symlinks to allow requests to /sangbok and /sangbok2
RUN ln -s /usr/share/nginx/html/ /usr/share/nginx/html/sangbok
RUN ln -s /usr/share/nginx/html/ /usr/share/nginx/html/sangbok2