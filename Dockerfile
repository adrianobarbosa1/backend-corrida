FROM node:12

USER root

WORKDIR /usr/src/node-app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

CMD [ "node", 'src', 'server.ts' ]
