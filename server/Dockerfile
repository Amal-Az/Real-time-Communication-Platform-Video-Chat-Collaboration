FROM node:20-alpine

WORKDIR /usr/src/app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm install

# Copie du reste du code
COPY . .

# On expose le port défini dans ton docker-compose
EXPOSE 5000

CMD ["npm", "start"]