FROM node:18 As development

WORKDIR /usr/front-end

RUN apt-get update -y
RUN npm install -g npm@latest

FROM node:18 As production

WORKDIR /usr/front-end

COPY . .

RUN apt-get update -y
RUN npm install -g npm@latest
RUN npm install -g react-app-rewired

RUN rm -f ./package.json 
RUN ln -s ./app/package.json ./package.json

RUN npm install

