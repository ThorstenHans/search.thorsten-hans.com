FROM ubuntu:latest
LABEL maintainer="Thorsten Hans<thorsten.hans@gmail.com>"
LABEL repository="https://github.com/ThorstenHans/search.thorsten-hans.com"

# install tools (curl, git)
RUN apt-get update && apt-get -y install curl

# install Node.JS (currently 12)
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -y nodejs

WORKDIR /app

ENV THNS__AZ_SEARCH_INDEX_NAME=blogposts
# sensitive environment variables should be passed as -e argument when building the image
# ENV THNS__AZ_SEARCH_ADMIN_KEY=
# ENV THNS__AZ_SEARCH_SERVICE_NAME=

# copy package.json and install deps
COPY package*.json ./
RUN npm install

# copy entire project to image
COPY . .

# start the script during container invocation
ENTRYPOINT [ "node", "./index.js" ]
CMD ["build"]
