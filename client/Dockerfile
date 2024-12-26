# Dockerfile - React Build
FROM node:14 AS build
WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia el código fuente y genera la build
COPY . .
RUN npm run build
