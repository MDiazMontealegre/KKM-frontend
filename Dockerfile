FROM node:22
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .
RUN npm run build
RUN npm install -g serve 
EXPOSE 80
CMD [ "serve", "-s", "dist", "80"]