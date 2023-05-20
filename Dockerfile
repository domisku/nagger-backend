FROM node:lts-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=prod && npm install typescript

COPY . .

RUN npx prisma generate

RUN npx tsc

EXPOSE 8080

CMD ["npm", "start:prod"]