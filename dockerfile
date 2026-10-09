FROM node:22-alpine

WORKDIR /app

COPY ./backend ./

RUN npm install

CMD ["node","server.js"]