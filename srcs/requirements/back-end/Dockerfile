FROM node:18 As development

WORKDIR /usr/back-end

COPY ./bin/entrypoint.sh /usr/bin/entrypoint.sh

RUN apt-get update -y
RUN apt-get install -y postgresql-client vim

RUN npm install -g npm@latest
RUN npm install -g @nestjs/cli

ENTRYPOINT [ "/bin/bash", "/usr/bin/entrypoint.sh" ]



FROM node:18 As production

WORKDIR /usr/back-end

ARG DATABASE_URL

COPY . .

RUN apt-get update -y
RUN apt-get install -y postgresql-client vim

RUN rm -f ./package.json
RUN ln -s ./app/package.json ./package.json

RUN npm install -g npm@latest
RUN npm install -g @nestjs/cli
RUN npm install

ENTRYPOINT [ "/bin/bash", "./bin/entrypoint.sh" ]
