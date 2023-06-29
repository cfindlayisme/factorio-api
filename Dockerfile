FROM node:18.16.1-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
CMD [ "node", "index.js" ]