FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Commande pour lancer Vite en mode développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]