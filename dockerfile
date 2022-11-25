FROM node:16
WORKDIR . .
COPY package*.json ./

RUN npm i
COPY . .

Expose 5000

CMD ["npm", "start"]

LABEL org.opencontainers.image.source="https://github.com/piyushgIITian/SocialMediaAPIs"