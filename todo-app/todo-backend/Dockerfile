FROM node:20
  
WORKDIR /usr/src/app


COPY --chown=node:node ./todo-backend .
RUN npm ci 

USER node
CMD npm start