# Set node base image
FROM node:6.9.2

# File author / maintainer
LABEL "maintainer"="Stone Chen"
LABEL "email"="dev@singularjs.com"

# Install nodemon
RUN npm install -g nodemon

# COPY ./api/dev/root.js /usr/app/root.js
# COPY ./docker/config/api.package.json /usr/app/package.json
# COPY ./assets/Alipay/rsa_private_key.pem /usr/app/alipay_private_key.pem
# COPY ./assets/Alipay/sha1_public_key.pem /usr/app/alipay_public_key.pem

# RUN npm config set registry https://registry.npm.taobao.org
# RUN npm install

# Internal port
EXPOSE 3000

# Run app using node/nodemon
WORKDIR /usr/app
CMD ["nodemon", "--debug=5858", "root.js"]
