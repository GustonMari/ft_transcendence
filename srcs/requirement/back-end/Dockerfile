FROM debian:buster

RUN apt-get -y update \
    && apt-get -y install \
    nodejs \
    yarn \
    npm

RUN npm install -g @nestjs/cli
