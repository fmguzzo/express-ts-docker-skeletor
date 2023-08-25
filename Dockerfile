FROM node:18.17.1

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

#COPY . .
# COPY package*.json ./
#RUN npm install --only=production
# RUN npm install

# COPY . .
# RUN npm run build

USER node

#Production
# CMD ["npm", "start"]

#Development
CMD ["npm", "run", "dev"]

EXPOSE 3535
