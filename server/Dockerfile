FROM node:16-alpine

WORKDIR /app
COPY package.json .
RUN npm install --production

COPY . .

ENV PORT=5000
CMD [ "npm","start" ]