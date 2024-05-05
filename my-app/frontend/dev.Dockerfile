FROM node:20

WORKDIR /usr/src/app

COPY ./frontend .

RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]