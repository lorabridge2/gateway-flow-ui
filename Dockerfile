FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --force
RUN npm audit fix --force

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM node:20-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./

COPY package.json package-lock.json ./
RUN npm install --force
RUN npm audit fix --force
USER 1337:1337
ENV NODE_ENV=production
ENTRYPOINT [ "node", "/usr/src/app/index.js" ]
