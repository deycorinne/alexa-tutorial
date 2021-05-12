#!/bin/bash

# Unofficial bash strict mode: http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

GIT_ROOT=$(git rev-parse --show-toplevel)

pushd "$GIT_ROOT" > /dev/null
export DOCKER_BUILDKIT=1
docker build -t alexa-tutorial-builder .
