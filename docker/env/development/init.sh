#!/bin/bash

source ./docker/env/development/init.env

export NODE_ENV=$NODE_ENV
export APP_TITLE=$APP_TITLE
export PORT=$PORT
export DB_PATH=$DB_PATH
export DB_NAME=$DB_NAME
export USER_NAME=$USER_NAME
export USER_PASSWORD=$USER_PASSWORD
