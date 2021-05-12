FROM node:14

WORKDIR /app

COPY . .

SHELL ["/bin/bash", "-eo", "pipefail", "-c"]

RUN apt-get update && \
    apt-get install -y \
    zip \
    less \
    && \
    rm -rf /var/lib/apt/lists/* && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && aws --version && \
    npm ci

ENTRYPOINT [ "/bin/bash" ]
