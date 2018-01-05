# Set mongo base image
FROM mongo:latest

# File author / maintainer
LABEL "maintainer"="Stone Chen"
LABEL "email"="dev@singularjs.com"

# Mount the MongoDB data directory 
VOLUME ["/data/db"]
WORKDIR /data/db

# Expose port #27017 from the container to the host
EXPOSE 27017

# Set /usr/bin/mongod as the dockerized entry-point application
ENTRYPOINT ["/usr/bin/mongod", "--bind_ip_all", "--smallfiles"]
