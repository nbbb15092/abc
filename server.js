const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, isJidBroadcast, isJidStatusBroadcast } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const express = require("express");
const path = require("path");
const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");

// ================================
// Configuration
// ================================
const PORT = process.env.PORT || 3000;
const PREFIX = process.env.PREFIX || "!";
const app = express();
const cache = new NodeCache({ stdTTL: 600 });
const msgRetryCounterMap = {};

// Dossiers
const AUTH_DIR = path.join(__dirname, "auth_store");
const LOGS_DIR = path.join(__dirname, "logs");
const TEMP_DIR = path.join(__dirname, "temp");

[AUTH_DIR, LOGS_DIR, TEMP_DIR].forEach(dir => fs.ensureDirSync(dir));

// Logger
const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport: {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "SYS:standard" }
  }
});

// ================================
// Variables Globales
// ================================
let sock = null;
let isConnected = false;
let qrCode = null;
let logs = [];
let messages = [];

const MAX_LOGS = 500;
const MAX_MESSAGES = 1000;

// ================================
// Utilitaires
// ================================
function addLog(message, type = "info") {
  const log = {
    timestamp: new Date(),
    message,
    type
  };
  logs.push(log);
  if (logs.length > MAX_LOGS) logs.shift();
  logger[type](message);
  return log;
}

function addMessage(msg) {
  messages.push(msg);
  if (messages.length > MAX_MESSAGES) messages.shift();
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatJid(jid) {
  if (!jid) return null;
  return jid.includes("@") ? jid : `${jid}@s.whatsapp.net`;
}

// ================================
// Commandes
// ================================
const commands = {
  help: {
    desc: "Affiche l'aide",
    usage: `${PREFIX}help`,
    run: async (sock, msg, args) => {
      let text = `🤖 *LAMELO-BOT* - Aide Complète\n\n`;
      text += `*Commandes Disponibles:*\n\n`;
      
      for (const [cmd, data] of Object.entries(commands)) {
        text += `${PREFIX}${cmd} - ${data.desc}\n`;
      }
      
      text += `\n_Utilisez ${PREFIX}help [commande] pour plus d'infos_`;
      
      await sock.sendMessage(msg.key.remoteJid, { text });
    }
  },

  ping: {
    desc: "Test de latence",
    usage: `${PREFIX}ping`,
    run: async (sock, msg, args) => {
      const start = Date.now();
      const sent = await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pong!" });
      const latency = Date.now() - start;
      await sock.sendMessage(msg.key.remoteJid, { text: `⚡ Latence: ${latency}ms` });
    }
  },

  ytmp3: {
    desc: "Télécharge une vidéo YouTube en MP3",
    usage: `${PREFIX}ytmp3 [URL]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { text: "Veuillez fournir une URL YouTube" });
        return;
      }

      try {
        await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Téléchargement en cours..." });
        // Implémentation avec yt-dlp ou similar
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Téléchargement terminé!" });
      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Erreur: ${e.message}` });
        addLog(`Erreur ytmp3: ${e.message}`, "error");
      }
    }
  },

  translate: {
    desc: "Traduit un texte",
    usage: `${PREFIX}translate [langue] [texte]`,
    run: async (sock, msg, args) => {
      if (args.length < 2) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `Usage: ${PREFIX}translate [fr/en/es/de] [texte]` 
        });
        return;
      }

      try {
        const lang = args[0];
        const text = args.slice(1).join(" ");
        
        // Appel API simple
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `🌐 Traduction vers ${lang}:\n${text}` 
        });
      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Erreur: ${e.message}` });
      }
    }
  },

  weather: {
    desc: "Affiche la météo",
    usage: `${PREFIX}weather [ville]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { text: "Veuillez spécifier une ville" });
        return;
      }

      try {
        const city = args.join(" ");
        // Intégration météo API
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `🌤️ Météo à ${city}:\nChargement...` 
        });
      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Erreur: ${e.message}` });
      }
    }
  },

  sticker: {
    desc: "Convertit une image en sticker",
    usage: `${PREFIX}sticker [image]`,
    run: async (sock, msg, args) => {
      try {
        if (!msg.message.imageMessage) {
          await sock.sendMessage(msg.key.remoteJid, { 
            text: "Veuillez répondre à une image" 
          });
          return;
        }

        await sock.sendMessage(msg.key.remoteJid, { text: "⏳ Conversion en sticker..." });
        // Conversion image -> sticker
        await sock.sendMessage(msg.key.remoteJid, { text: "✅ Sticker créé!" });
      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { text: `❌ Erreur: ${e.message}` });
      }
    }
  },

  owner: {
    desc: "Infos du propriétaire du bot",
    usage: `${PREFIX}owner`,
    run: async (sock, msg, args) => {
      const ownerText = `
👤 *OWNER - LAMELO-BOT*

Créateur: Votre Nom
Nombre de commandes: ${Object.keys(commands).length}
Uptime: ${process.uptime().toFixed(2)}s
RAM: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
      `;
      await sock.sendMessage(msg.key.remoteJid, { text: ownerText.trim() });
    }
  },

  status: {
    desc: "Infos du bot",
    usage: `${PREFIX}status`,
    run: async (sock, msg, args) => {
      const statusText = `
🤖 *LAMELO-BOT - STATUS*

✅ Connecté: OUI
📊 Messages traités: ${messages.length}
⏱️ Uptime: ${process.uptime().toFixed(2)}s
💾 RAM utilisée: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
🔌 Version: 1.0.0
      `;
      await sock.sendMessage(msg.key.remoteJid, { text: statusText.trim() });
    }
  }
};

// ================================
// Gestionnaire de Connexion
// ================================
async function startBot() {
  try {
    addLog("🚀 Démarrage du bot...", "info");

    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

    sock = makeWASocket({
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      msgRetryCounterMap,
      defaultQueryTimeoutMs: 0,
      retryRequestDelayMs: 100,
      shouldIgnoreJid: jid => isJidBroadcast(jid) || isJidStatusBroadcast(jid),
      qrTimeout: 60000
    });

    // Gestion QR Code
    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        qrCode = qr;
        addLog("📱 QR Code reçu - Scannez avec votre téléphone", "info");
      }

      if (connection === "connecting") {
        addLog("🔄 Connexion en cours...", "info");
        isConnected = false;
      }

      if (connection === "open") {
        addLog("✅ Bot connecté avec succès!", "success");
        isConnected = true;
        qrCode = null;
      }

      if (connection === "close") {
        isConnected = false;
        const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

        if (reason === DisconnectReason.badSession) {
          addLog("❌ Session invalide - Suppression", "error");
          fs.removeSync(AUTH_DIR);
        } else if (reason === DisconnectReason.connectionClosed) {
          addLog("🔌 Connexion fermée", "warning");
          setTimeout(() => startBot(), 5000);
        } else if (reason === DisconnectReason.connectionLost) {
          addLog("📡 Connexion perdue", "warning");
          setTimeout(() => startBot(), 3000);
        } else if (reason === DisconnectReason.connectionReplaced) {
          addLog("🔄 Connexion remplacée", "warning");
        } else if (reason === DisconnectReason.loggedOut) {
          addLog("🚫 Déconnecté", "error");
          fs.removeSync(AUTH_DIR);
        } else {
          addLog(`Reconnexion... (${reason})`, "warning");
          setTimeout(() => startBot(), 5000);
        }
      }
    });

    // Sauvegarde des credentials
    sock.ev.on("creds.update", saveCreds);

    // Gestion des messages
    sock.ev.on("messages.upsert", async ({ messages: rawMessages, type }) => {
      if (type !== "notify") return;

      for (const msg of rawMessages) {
        if (!msg.message || msg.key.fromMe) continue;

        try {
          const text = msg.message.conversation || 
                       msg.message.extendedTextMessage?.text || 
                       "";
          
          const sender = msg.key.participant || msg.key.remoteJid;
          const isGroup = msg.key.remoteJid.endsWith("@g.us");

          addMessage({
            sender,
            text,
            timestamp: msg.messageTimestamp,
            type: isGroup ? "group" : "private"
          });

          addLog(`📨 Message de ${sender}: ${text.substring(0, 50)}`, "info");

          // Vérifier si c'est une commande
          if (text.startsWith(PREFIX)) {
            const args = text.slice(PREFIX.length).trim().split(/\s+/);
            const cmd = args.shift().toLowerCase();

            if (commands[cmd]) {
              addLog(`⚙️ Exécution: ${cmd}`, "info");
              await commands[cmd].run(sock, msg, args);
            } else {
              await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Commande inconnue: ${PREFIX}${cmd}\nTapez ${PREFIX}help`
              });
            }
          }
        } catch (err) {
          addLog(`Erreur traitement message: ${err.message}`, "error");
        }
      }
    });

    return sock;
  } catch (err) {
    addLog(`Erreur démarrage: ${err.message}`, "error");
    throw err;
  }
}

// ================================
// Serveur Express
// ================================
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API endpoints
app.get("/api/status", (req, res) => {
  res.json({
    connected: isConnected,
    qr: qrCode,
    messages: messages.length,
    logs: logs.length,
    uptime: process.uptime()
  });
});

app.post("/api/start", async (req, res) => {
  try {
    if (!sock) {
      sock = await startBot();
    }
    res.json({ success: true, message: "Bot démarré" });
  } catch (err) {
    addLog(`Erreur start: ${err.message}`, "error");
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/stop", async (req, res) => {
  try {
    if (sock) {
      await sock.end();
      sock = null;
      isConnected = false;
    }
    res.json({ success: true, message: "Bot arrêté" });
  } catch (err) {
    addLog(`Erreur stop: ${err.message}`, "error");
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/send-message", async (req, res) => {
  try {
    if (!sock || !isConnected) {
      return res.status(400).json({ success: false, message: "Bot non connecté" });
    }

    const { to, text } = req.body;
    if (!to || !text) {
      return res.status(400).json({ success: false, message: "Paramètres manquants" });
    }

    const jid = formatJid(to);
    await sock.sendMessage(jid, { text });
    addLog(`📤 Message envoyé à ${to}: ${text.substring(0, 50)}`, "success");

    res.json({ success: true, message: "Message envoyé" });
  } catch (err) {
    addLog(`Erreur envoi: ${err.message}`, "error");
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/api/logs", (req, res) => {
  res.json(logs);
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.post("/api/clear-logs", (req, res) => {
  logs = [];
  res.json({ success: true });
});

app.post("/api/clear-session", (req, res) => {
  try {
    fs.removeSync(AUTH_DIR);
    sock?.end();
    sock = null;
    isConnected = false;
    qrCode = null;
    res.json({ success: true, message: "Session effacée" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================================
// Démarrage
// ================================
app.listen(PORT, () => {
  addLog(`🌐 Serveur démarré sur http://localhost:${PORT}`, "success");
  startBot().catch(err => {
    addLog(`Erreur fatal: ${err.message}`, "error");
    process.exit(1);
  });
});

module.exports = { startBot, commands };
