# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mamaurai <mamaurai@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/01/02 10:42:00 by mamaurai          #+#    #+#              #
#    Updated: 2023/05/07 14:52:02 by mamaurai         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Only two modes are availables: development and production 
MODE = development

ifeq ($(MODE), development)
	DOCKER_COMPOSE_FILE = ./srcs/.dev/docker-compose-dev.yml
else
	DOCKER_COMPOSE_FILE = srcs/docker-compose.yml
endif

DOCKER_ENV_FILE = ./srcs/.dev/.env
DOCKER_COMPOSE = docker compose
BASH = /bin/bash
CLEAR_FILE = ./srcs/.dev/docker-cleaner.sh
DOCKER_EXEC = docker exec -it
FRONT_NAME = front
BACK_NAME = api
SCRIPT_TO_RUN = /bin/bash
PRISMA_STUDIO_CMD = npx prisma studio --schema='app/prisma/schema.prisma'
MIGRATE_CMD = npx prisma migrate dev --schema='./app/prisma/schema.prisma'

ifeq ($(MODE),$(filter $(MODE),development production ))
all:	up
else
all:
		@echo "Invalid mode, please use 'make MODE=development' or 'make MODE=prod' to run the project."
endif

ifeq ($(MODE),$(filter $(MODE),development production ))
re:		restart

up:		up-back

up-back:
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} up --build -d

up-front:
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} up --build
		
stop:	
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} stop

clean:
		@make stop
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} down

restart:
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} stop || true
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} up --build -d

status:
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} ps
endif

ifeq ($(MODE),$(filter $(MODE),development))

in-front:
		@${DOCKER_EXEC} ${FRONT_NAME} ${SCRIPT_TO_RUN}

in-back:
		@${DOCKER_EXEC} ${BACK_NAME} ${SCRIPT_TO_RUN}

dclean:
		@make stop 2>/dev/null
		@${BASH} ${CLEAR_FILE} || true

drestart:
		@${BASH} ${CLEAR_FILE} || true
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} up --build -d
		
api-logs:
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} logs --tail=300 ${BACK_NAME}

front-logs:
		@${DOCKER_COMPOSE} --env-file ${DOCKER_ENV_FILE} -f ${DOCKER_COMPOSE_FILE} logs --tail=100 ${FRONT_NAME}

studio:
		@${DOCKER_EXEC} -d ${BACK_NAME} ${PRISMA_STUDIO_CMD}

migrate:
		@${DOCKER_EXEC} -d ${BACK_NAME} ${MIGRATE_CMD}

remove-modules:
		@rm -rf srcs/requirements/back-end/node_modules srcs/requirements/back-end/dist &> /dev/null || true
		@rm -rf srcs/requirements/front-end/node_modules srcs/requirements/front-end/dist &> /dev/null
	
super-clean:
		make stop 2>/dev/null
		# make dclean 2>/dev/null
		rm -rf srcs/requirements/back-end/node_modules
		rm -rf srcs/requirements/front-end/node_modules
		rm -rf srcs/requirements/back-end/app/prisma/migrations
		make drestart
	
endif

.PHONY: all re up up-back stop clean dclean restart drestart status logs

