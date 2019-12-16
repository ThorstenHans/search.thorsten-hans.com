FROM ubuntu:19.10
LABEL maintainer="Thorsten Hans<thorsten.hans@gmail.com>"
LABEL repository="https://github.com/ThorstenHans/search.thorsten-hans.com"

# install tools (curl, git)
RUN apt-get update && apt-get -y install git curl

# install Node.JS (currently 12)
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - && apt-get install -y nodejs

WORKDIR /app

# clone entire blog to the image
ARG BLOG_REPO_URL=https://github.com/ThorstenHans/thorsten-hans.com.git
ARG BLOG_CLONE_TARGET=blog
RUN git clone $BLOG_REPO_URL $BLOG_CLONE_TARGET

# specify fallback (insensitve) environment variables
ENV THNS__POSTS_FOLDER_NAME=blog/_posts
ENV THNS__BLOG_URL=https://thorsten-hans.com
ENV THNS__AZ_SEARCH_INDEX_NAME=blogposts

# sensitive environment variables should be passed as -e argument when building the image
# ENV THNS__AZ_SEARCH_ADMIN_KEY=
# ENV THNS__AZ_SEARCH_SERVICE_NAME=

# copy package.json and install deps
COPY package.json package-lock.json ./
RUN npm install --no-progress

# copy entire project to image
COPY . .

# start the script during container invocation
ENTRYPOINT [ "node", "./index.js" ]
CMD ["feed"]