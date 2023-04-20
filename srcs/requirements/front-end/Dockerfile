FROM node:18 As development

WORKDIR /usr/front-end

RUN apt-get update -y
RUN npm install -g npm@latest

FROM node:18 As production

WORKDIR /usr/front-end

COPY . .

RUN apt-get update -y
RUN npm install -g npm@latest

RUN yarn install
RUN yarn global add serve
RUN yarn build

