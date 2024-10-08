FROM node:20-bookworm-slim AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install --force
#RUN npm audit fix --force

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM node:20-bookworm-slim
WORKDIR /usr/src/app

COPY --from=build /usr/src/app/build ./

COPY package.json package-lock.json ./
ENV NODE_ENV=production

RUN npm i --force
# level
#RUN npm audit fix --force
USER 1337:1337
ENTRYPOINT [ "node", "/usr/src/app/index.js" ]
