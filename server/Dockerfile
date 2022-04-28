FROM node:16-alpine

RUN npm install -g pnpm@next-7

WORKDIR /app
COPY package.json pnpm-lock.yaml .
RUN pnpm install

COPY . .

ENV PORT=5000
CMD [ "pnpm","start" ]