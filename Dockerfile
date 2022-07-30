FROM node:latest

RUN mkdir -p /home/node/app/node_modules

WORKDIR /home/node/app

COPY package*.json ./

ENV PORT=$PORT \
    DATABASE_URL=postgres://clqxmydxxkqtqu:bfcaee9afbace27c68c6ffeb9a45dd969dfdf8830f02031b63afbba1ee54fd17@ec2-34-231-63-30.compute-1.amazonaws.com:5432/dds0qcmg3qdo00

RUN npm install

COPY . .

CMD ["node", "server.js"]