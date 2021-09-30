FROM arm32v7/node:14

# ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

RUN chown -R node:node .

RUN npm install && npm cache clean --force

COPY . .

RUN chown -R node:node .

RUN [ "npm", "run", "build" ]

CMD [ "node", "build/index.js" ]
