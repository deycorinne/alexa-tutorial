#!/usr/bin/env bash

# Unofficial bash strict mode: http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail
IFS=$'\n\t'

: "${AWS_PROFILE:?Required parameter: AWS_PROFILE}"

GIT_ROOT=$(git rev-parse --show-toplevel)

if [[ "$(docker images -q alexa-tutorial-builder 2> /dev/null)" == "" ]]; then
  "$GIT_ROOT"/scripts/builder/build-builder.sh
fi

docker run --rm -t \
-e AWS_SDK_LOAD_CONFIG=1 \
-e AWS_PROFILE="$AWS_PROFILE" \
-v "$HOME"/.aws:/root/.aws \
-v "$GIT_ROOT":/app \
--env-file .env \
alexa-tutorial-builder "$@"
