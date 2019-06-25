FROM node:8.3.0-alpine

RUN mkdir -p /usr/src/app && \
    adduser -S robot && \
    chown -R robot /usr/src/app
WORKDIR /usr/src/app
USER robot

COPY package.json package-lock.json /usr/src/app/
RUN npm install --production

COPY index.js /usr/src/app/
COPY app.yml dialogue.yml /usr/src/app/
COPY webhooks /usr/src/app/webhooks/

RUN npm start
EXPOSE 3000