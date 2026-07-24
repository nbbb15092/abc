# 🚀 Guide de Déploiement - WhatsApp Bot Manager

## Installation Locale

### Prérequis
- Node.js v18+
- npm ou yarn
- Git

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/onesimechristian225-web/Lamelo.git
cd Lamelo

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env

# 4. Démarrer le bot
npm start
```

---

## 🐳 Déploiement Docker

### Avec Docker Compose (Recommandé)

```bash
# Construire et démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f whatsapp-bot

# Arrêter
docker-compose down
```

### Avec Docker seul

```bash
# Construire l'image
docker build -t whatsapp-bot-lamelo .

# Exécuter le conteneur
docker run -d \
  -p 3000:3000 \
  -v bot_auth:/app/auth_store \
  -v bot_logs:/app/logs \
  --name whatsapp-bot \
  whatsapp-bot-lamelo

# Voir les logs
docker logs -f whatsapp-bot
```

---

## 🌐 Déploiement en Production (VPS)

### SSH et Clone

```bash
# Connectez-vous à votre serveur
ssh user@your-server.com

# Clonez le repo
git clone https://github.com/onesimechristian225-web/Lamelo.git
cd Lamelo

# Installez les dépendances
npm install --production

# Créez les dossiers nécessaires
mkdir -p logs auth_store
```

### Avec PM2

```bash
# Installez PM2 globalement
npm install -g pm2

# Démarrez le bot
pm2 start ecosystem.config.js

# Sauvegardez la configuration
pm2 save

# Activez le démarrage automatique
pm2 startup
pm2 save

# Voir les processus
pm2 list

# Voir les logs
pm2 logs whatsapp-bot-lamelo
```

### Configuration Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Commandes de Maintenance

```bash
# Redémarrer le bot
pm2 restart whatsapp-bot-lamelo

# Arrêter le bot
pm2 stop whatsapp-bot-lamelo

# Supprimer le processus
pm2 delete whatsapp-bot-lamelo

# Monitoring en temps réel
pm2 monit

# Afficher les logs
pm2 logs whatsapp-bot-lamelo

# Logs des 100 dernières lignes
pm2 logs whatsapp-bot-lamelo --lines 100
```

---

## 📊 Monitoring

### Vérifier le statut
```bash
curl http://localhost:3000/api/status
```

### Vérifier la connexion WhatsApp
L'interface web est disponible à `http://your-ip:3000`

---

## 🆘 Troubleshooting

### Le bot ne démarre pas
```bash
# Vérifiez les logs
pm2 logs whatsapp-bot-lamelo

# Vérifiez que le port 3000 est libre
lsof -i :3000

# Tuez le processus si nécessaire
kill -9 <PID>
```

### Erreur de port occupé
```bash
# Trouvez le processus
sudo lsof -i :3000

# Tuez-le
sudo kill -9 <PID>
```

### Session WhatsApp perdue
```bash
# Supprimez la session
rm -rf auth_store/

# Redémarrez le bot
pm2 restart whatsapp-bot-lamelo

# Scannez le QR code à nouveau
```

---

## 🔐 Sécurité

1. **Changez le port par défaut** (si nécessaire)
2. **Utilisez un firewall** pour restreindre l'accès
3. **Activez SSL/TLS** avec Let's Encrypt
4. **Gardez Node.js à jour**
5. **Mettez à jour les dépendances régulièrement**

---

## 📝 Variables d'Environnement

Créez un fichier `.env` à la racine du projet :

```env
NODE_ENV=production
PORT=3000
# Ajoutez d'autres variables selon vos besoins
```

---

## 🎉 Déploiement réussi!

Votre bot WhatsApp est maintenant en ligne et prêt à recevoir des messages!