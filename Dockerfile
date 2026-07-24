FROM node:18-alpine

WORKDIR /app

# Installer PM2 globalement
RUN npm install -g pm2

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --production

# Copier le code de l'application
COPY . .

# Créer les répertoires de logs
RUN mkdir -p logs auth_store

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Lancer l'application avec PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]