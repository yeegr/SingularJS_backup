#!/bin/bash

# set environmental variables
source ./docker/env/${NODE_ENV}/init.env

# get base docker images
docker pull mongo
docker pull node:8.9.0

# build mongodb docker image from dockerfile
docker build - < ./docker/dockerfiles/${NODE_ENV}/mongo.dockerfile -t ${APP_TITLE}/mongo

# run mongodb image
docker run -d --expose 27017 --name ${APP_TITLE}-db -v /data/${DB_PATH}:/data/${DB_NAME} ${APP_TITLE}/mongo

# wait
sleep 5s

# add mongodb user for database
docker exec -it ${APP_TITLE}-db mongo ${DB_NAME} --eval 'db.createUser({user: "'${USER_NAME}'", pwd: "'${USER_PASSWORD}'", roles: [{role: "readWrite", db: "'${DB_NAME}'"}]})'

# remove running docker process
docker rm -f ${APP_TITLE}-db
