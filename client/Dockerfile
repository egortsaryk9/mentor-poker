FROM node:14.15.0 as build

RUN mkdir -p /var/app
WORKDIR /var/app

COPY package*.json ./

RUN npm ci
COPY . .

ARG REACT_APP_SERVER_URL
RUN REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL npm run build



FROM nginx:alpine as main

WORKDIR /app

COPY --from=build /var/app ./

RUN ls
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080