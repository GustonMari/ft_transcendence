DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_FILE = srcs/docker-compose.yml
BASH = /bin/bash
CLEAR_FILE = ./srcs/.dev/clear_all.sh
VOLUME_PATH = /home/mamaurai/data

all:	up
re:		restart

up:		up-back

up-front:	create_volume
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} up --build

up-back: 	create_volume
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} up --build -d

stop:	
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} stop

clean:		destroy_volume
		@make stop
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} down

dclean: 	destroy_volume
		@make stop
		@${BASH} ${CLEAR_FILE} || true

restart: 	destroy_volume create_volume
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} stop || true
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} up --build -d

drestart: 	destroy_volume create_volume
		@${BASH} ${CLEAR_FILE} || true
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} up --build -d

status:
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} ps
		
logs:
		@${DOCKER_COMPOSE} -f ${DOCKER_COMPOSE_FILE} logs --tail=100

.PHONY: all re up up-back stop clean dclean restart drestart create_volume destroy_volume status logs