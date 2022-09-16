#!/bin/bash
set -e

TAG=$(git log -1 --pretty=%h)
LATEST="latest"
ORG="$1"
IMAGE_PREFIX="$2"
REACT_APP_SERVER_URL="$3"

echo "Building $ORG/$IMAGE_PREFIX image..."
export IMAGE_NAME="$ORG/$IMAGE_PREFIX:$TAG"
export LATEST_IMAGE_NAME="$ORG/$IMAGE_PREFIX:$LATEST"

docker build --build-arg REACT_APP_SERVER_URL=${REACT_APP_SERVER_URL} -t="${IMAGE_NAME}" .
docker tag ${IMAGE_NAME} ${LATEST_IMAGE_NAME}
docker push ${IMAGE_NAME}
docker push ${LATEST_IMAGE_NAME}
docker rmi ${IMAGE_NAME}
docker rmi ${LATEST_IMAGE_NAME}

# Example:
# ./build-docker.sh "egortsaryk9" "mentor-poker-web-client" "https://poker.server.yahortsaryk.tech"