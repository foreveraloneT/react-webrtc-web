FROM node:8

# Create app directory
RUN mkdir -p /usr/src/app/public/
COPY ./public/ /usr/src/app/public/

# install express server
COPY package.json /usr/src/app/
WORKDIR /usr/src/app
RUN npm install express
RUN npm install connect-history-api-fallback

COPY server.js /usr/src/app/
EXPOSE 8080
CMD [ "npm", "run", "server" ]
