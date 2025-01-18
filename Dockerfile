# Node express app
FROM node:22-alpine

WORKDIR /app

COPY package.json /app

COPY tsconfig.json /app

RUN npm install
