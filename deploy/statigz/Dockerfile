##
## Frontend build
##
# We assume that music is pre-built.
FROM node:16-slim AS frontend-build

WORKDIR /app

COPY package*.json .
RUN npm clean-install

COPY public public
COPY *.json .
COPY *.js .
COPY .eslintrc .
COPY src src

RUN npm run build

RUN apt-get update && apt-get install brotli

RUN for file in dist/**/*; do \
        brotli "$file" --best --rm; \
    done
RUN for file in dist/*; do \
        brotli "$file" --best --rm; \
    done

##
## Backend build
##
FROM golang:1.16-alpine AS backend-build

WORKDIR /build

# Prefetch packages, for caching.
COPY deploy/statigz/ .
COPY --from=frontend-build /app/dist dist
RUN go mod download && go mod tidy
RUN go build -o ./server ./main.go

##
## Finale
##
FROM alpine:latest
EXPOSE 80
WORKDIR /app
COPY --from=backend-build /build/server /app/server
ENTRYPOINT /app/server