# Set node base image
FROM node:8.9.0

# File author / maintainer
LABEL "maintainer"="Stone Chen"
LABEL "email"="dev@singularjs.com"

# Set NPM registry
RUN npm config set registry https://registry.npm.taobao.org

# Install nodemon
RUN npm install -g nodemon
RUN npm install touch
RUN npm install sharp

# Internal port
EXPOSE 3000

# Run app using node/nodemon
WORKDIR /usr/app
CMD ["nodemon", "root.js"]
