FROM node:20.13-alpine

WORKDIR /app-front

COPY package*.json ./

RUN npm install

COPY . .

COPY ./dist ./dist

CMD ["npm", "run", "build"]
