FROM node:14-alpine

WORKDIR /home/node/app
ADD . .
RUN apk add --no-cache ansible docker
RUN npm install --no-optional
EXPOSE 3000
ENTRYPOINT ["npm", "start"]

# This container runs Docker commands
VOLUME /var/run/docker.sock
