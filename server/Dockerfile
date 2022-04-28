FROM node:14-alpine

WORKDIR /app
COPY package.json .
RUN npm install --production

COPY . .

ENV PORT=5000
CMD [ "npm","start" ]