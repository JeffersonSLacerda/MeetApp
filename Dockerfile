FROM node:alpine

# set working directory
RUN mkdir -p /home/node/node_modules && chown -R node:node /home/node/
WORKDIR /home/node/src

# add package.json to container
COPY package.json yanr.* ./

# install all dependencies
RUN yarn

# add code to container
COPY --chown=node:node . .

# expose default app port
EXPOSE 3333

#runnig app
CMD [ "yarn", "start" ]
