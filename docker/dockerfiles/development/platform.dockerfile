# Set nginx base image
FROM nginx:latest

# File author / maintainer
LABEL "maintainer"="Stone Chen"
LABEL "email"="dev@singularjs.com"

# Copy custom configuration file from the current directory
#COPY ./docker/config/development/platform.conf /etc/nginx/nginx.conf
