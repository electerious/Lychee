#!/bin/bash

# ensure running bash
if ! [ -n "$BASH_VERSION" ];then
    echo "this is not bash, calling self with bash....";
    SCRIPT=$(readlink -f "$0")
    /bin/bash $SCRIPT
    exit;
fi

SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT") 
cd $SCRIPTPATH

# load the variables
source $SCRIPTPATH/docker_settings.sh

if [[ $REGISTRY ]]; then
    CONTAINER_IMAGE="`echo $REGISTRY`/`echo $PROJECT_NAME`"
else
    CONTAINER_IMAGE="`echo $PROJECT_NAME`"
fi


docker kill $PROJECT_NAME
docker rm $PROJECT_NAME

# Create the volumes if they dont exist already.
mkdir -p $VOLUME_DIR/uploads
mkdir -p $VOLUME_DIR/data

docker run -d \
-p 80:80 \
-e MYSQL_HOST="$MYSQL_HOST" \
-e MYSQL_DB_NAME="$MYSQL_DB_NAME" \
-e MYSQL_USER="$MYSQL_USER" \
-e MYSQL_PASSWORD="$MYSQL_PASSWORD" \
-e MYSQL_PORT="$MYSQL_PORT" \
-v $VOLUME_DIR/uploads:/uploads \
-v $VOLUME_DIR/data:/data \
--restart=always \
--name="$PROJECT_NAME" \
$CONTAINER_IMAGE