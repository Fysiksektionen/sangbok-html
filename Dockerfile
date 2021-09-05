# Frontend
FROM node:16-alpine AS frontend-build

WORKDIR /app

COPY package*.json .
RUN npm clean-install

COPY public public
COPY *.json .
COPY .eslintrc .
COPY src src

RUN npm run build


# Backend
FROM golang:1.16-alpine as backend-build

WORKDIR /app/backend
COPY backend /app/backend
RUN go build -o sangbok-backend


# Finale
FROM alpine:latest

EXPOSE 80
ENV PORT 80
ENV GIN_MODE release

WORKDIR /app/backend

COPY src/assets/lyrics.json /app/lyrics.json
COPY --from=frontend-build /app/dist /app/dist
COPY --from=backend-build /app/backend/sangbok-backend /app/backend/sangbok-backend

CMD ["/app/backend/sangbok-backend"]