# Runwail Deployment Guide for WhatsApp Bot Manager

## 🚀 Quick Deploy to Runwail

### Step 1: Create Runwail Account
Visit [runwail.com](https://runwail.com) and sign up

### Step 2: Connect GitHub Repository
1. Go to Dashboard
2. Click "New Project"
3. Select "GitHub"
4. Connect your `onesimechristian225-web/Lamelo` repository

### Step 3: Configure Deployment

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Environment Variables:**
```
NODE_ENV=production
PORT=3000
```

### Step 4: Configure Persistent Storage

1. Go to Project Settings → Storage
2. Add persistent volumes:
   - Mount: `/app/auth_store` → `/data/auth_store`
   - Mount: `/app/logs` → `/data/logs`

### Step 5: Deploy

Click **"Deploy"** and wait for completion

---

## 📝 File Structure for Runwail

Make sure these files exist in your repo:

```
Lamelo/
├── package.json          ✅
├── start.js             ✅
├── ecosystem.config.js  ✅
├── Dockerfile           ✅
├── docker-compose.yml   ✅
├── public/
│   └── index.html       ✅
└── auth_store/          (created on first run)
```

---

## 🔗 Access Your Bot

After deployment, Runwail will provide a URL like:
```
https://whatsapp-bot-lamelo.runwail.app
```

**Open it in your browser and:**
1. Click **"Démarrer"** (Start)
2. Scan the QR code with your WhatsApp phone
3. Start receiving messages!

---

## 📊 Monitoring on Runwail

- **Logs**: Dashboard → Logs tab
- **Metrics**: Dashboard → Metrics (CPU, Memory, etc.)
- **Restart**: Dashboard → Actions → Restart

---

## 🔧 Troubleshooting

### Port Already in Use
Runwail auto-assigns ports, check logs for actual port

### Session Lost
1. Go to Storage
2. Delete `/data/auth_store`
3. Redeploy and scan QR code again

### Out of Memory
Increase container memory in Runwail settings

---

## Alternative: Manual Docker Deployment

If you prefer manual setup:

```bash
# Build Docker image
docker build -t whatsapp-bot-lamelo .

# Push to Docker Hub
docker tag whatsapp-bot-lamelo username/whatsapp-bot-lamelo
docker push username/whatsapp-bot-lamelo

# Deploy to Runwail with Docker image
```

---

**Your bot is now production-ready on Runwail!** 🎉
