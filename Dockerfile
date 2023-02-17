FROM node:18.14.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000
CMD [ "node", "index.js" ]