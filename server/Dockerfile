FROM node:lts-alpine

WORKDIR /app

COPY ./package.json .
RUN npm cache clean --force
RUN npm install
COPY . .

EXPOSE 3001

# CMD npm start
CMD [ "node", "src/index.js" ]