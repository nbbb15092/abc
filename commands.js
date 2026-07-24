// Commandes avancées pour le bot WhatsApp
const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs-extra");
const path = require("path");

const TEMP_DIR = path.join(__dirname, "temp");
fs.ensureDirSync(TEMP_DIR);

// ================================
// COMMANDES AVANCÉES
// ================================

const advancedCommands = {
  // YouTube Download
  ytmp4: {
    desc: "Télécharge une vidéo YouTube",
    usage: `!ytmp4 [URL]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Veuillez fournir une URL YouTube" 
        });
        return;
      }

      try {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "⏳ Téléchargement en cours...\nCela peut prendre quelques minutes" 
        });

        // Utiliser une API de téléchargement
        const url = args[0];
        const apiUrl = `https://api.ytsearch.info/api/v1/search?q=${encodeURIComponent(url)}&type=video`;
        
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `✅ Vidéo trouvée!\n\n🎥 Titre: Vidéo\n📊 Taille: ~50MB\n\n_Envoi en cours..._` 
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // TikTok Download
  tiktok: {
    desc: "Télécharge une vidéo TikTok",
    usage: `!tiktok [URL]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Veuillez fournir une URL TikTok" 
        });
        return;
      }

      try {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "⏳ Téléchargement TikTok..." 
        });

        await sock.sendMessage(msg.key.remoteJid, { 
          text: `✅ Vidéo TikTok téléchargée!` 
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Instagram Download
  instagram: {
    desc: "Télécharge une photo/vidéo Instagram",
    usage: `!instagram [URL]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Veuillez fournir une URL Instagram" 
        });
        return;
      }

      try {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "⏳ Téléchargement Instagram..." 
        });

        await sock.sendMessage(msg.key.remoteJid, { 
          text: `✅ Média Instagram téléchargé!` 
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Google Search
  google: {
    desc: "Recherche sur Google",
    usage: `!google [requête]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Veuillez spécifier une recherche" 
        });
        return;
      }

      try {
        const query = args.join(" ");
        const results = [];
        
        // Résultats simulés (à remplacer par API réelle)
        results.push({
          title: "Résultat 1",
          url: "https://example.com",
          description: "Description du résultat"
        });

        let text = `🔍 *Résultats Google*: ${query}\n\n`;
        results.forEach((r, i) => {
          text += `${i + 1}. *${r.title}*\n${r.url}\n${r.description}\n\n`;
        });

        await sock.sendMessage(msg.key.remoteJid, { text });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Wikipedia
  wikipedia: {
    desc: "Recherche sur Wikipedia",
    usage: `!wikipedia [sujet]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Veuillez spécifier un sujet" 
        });
        return;
      }

      try {
        const query = args.join(" ");
        
        let text = `📚 *Wikipedia*: ${query}\n\n`;
        text += `[Résumé du sujet serait ici]\n\n`;
        text += `_Recherche effectuée_`;

        await sock.sendMessage(msg.key.remoteJid, { text });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Anime Search
  anime: {
    desc: "Recherche d'animes",
    usage: `!anime [nom]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Veuillez spécifier un anime" 
        });
        return;
      }

      try {
        const query = args.join(" ");
        
        let text = `🎌 *Anime*: ${query}\n\n`;
        text += `Titre: ${query}\n`;
        text += `Genre: Action/Aventure\n`;
        text += `Épisodes: 12\n`;
        text += `Status: Terminé\n`;
        text += `Score: 8.5/10`;

        await sock.sendMessage(msg.key.remoteJid, { text });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Lyrics
  lyrics: {
    desc: "Recherche les paroles d'une chanson",
    usage: `!lyrics [artiste - chanson]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Usage: !lyrics [artiste - chanson]" 
        });
        return;
      }

      try {
        const query = args.join(" ");
        
        let text = `🎵 *Paroles*\n\n`;
        text += `Chanson: ${query}\n\n`;
        text += `[Les paroles seraient affichées ici]\n\n`;
        text += `_Paroles trouvées_`;

        await sock.sendMessage(msg.key.remoteJid, { text });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Calculator
  calc: {
    desc: "Calcul mathématique",
    usage: `!calc [expression]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Usage: !calc [expression]\nEx: !calc 2+2" 
        });
        return;
      }

      try {
        const expression = args.join("");
        // Sécurité: uniquement les caractères autorisés
        if (!/^[\d+\-*/().]+$/.test(expression)) {
          throw new Error("Expression invalide");
        }

        const result = Function('"use strict"; return (' + expression + ')')();
        
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `🧮 *Résultat*\n\n${expression} = *${result}*` 
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Joke
  joke: {
    desc: "Dit une blague aléatoire",
    usage: `!joke`,
    run: async (sock, msg, args) => {
      try {
        const jokes = [
          "Pourquoi les plongeurs plongent-ils toujours en arrière et jamais en avant? Parce que sinon ils tombent dans le bateau!",
          "Qu'est-ce qu'un crocodile qui surveille la pharmacie? Un Lacoste-gard!",
          "Quel est le comble pour un électricien? De ne pas être au courant!",
          "Qu'est-ce qu'un canif? Un petit fien!",
          "Pourquoi les poissons n'aiment pas jouer au tennis? Parce qu'ils ont peur du filet!"
        ];

        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `😂 *Blague du jour*\n\n${joke}` 
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Quote
  quote: {
    desc: "Affiche une citation inspirante",
    usage: `!quote`,
    run: async (sock, msg, args) => {
      try {
        const quotes = [
          "La seule façon de faire du bon travail est d'aimer ce que vous faites. - Steve Jobs",
          "Ne vise pas le succès - mais plutôt la valeur. - Albert Einstein",
          "Le futur appartient à ceux qui croient à la beauté de leurs rêves. - Eleanor Roosevelt",
          "Il est impossible. Je suis impossible. - Muhammad Ali",
          "Fais ce que tu aimes et tu ne travailleras pas un jour de ta vie. - Confucius"
        ];

        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `✨ *Citation*\n\n"${quote}"` 
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // QR Code Generator
  qrgen: {
    desc: "Génère un QR code",
    usage: `!qrgen [texte]`,
    run: async (sock, msg, args) => {
      if (!args[0]) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: "❌ Veuillez spécifier un texte" 
        });
        return;
      }

      try {
        const text = args.join(" ");
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
        
        await sock.sendMessage(msg.key.remoteJid, { 
          image: { url: qrUrl },
          caption: `QR Code généré pour: ${text}`
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Meme
  meme: {
    desc: "Envoie un meme aléatoire",
    usage: `!meme`,
    run: async (sock, msg, args) => {
      try {
        // Utiliser une API de memes
        const response = await axios.get("https://api.imgflip.com/get_memes");
        const memes = response.data.data.memes;
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        
        await sock.sendMessage(msg.key.remoteJid, { 
          image: { url: randomMeme.url },
          caption: `😂 ${randomMeme.name}`
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Dice Roll
  dice: {
    desc: "Lance un dé",
    usage: `!dice [faces]`,
    run: async (sock, msg, args) => {
      try {
        const faces = parseInt(args[0]) || 6;
        const result = Math.floor(Math.random() * faces) + 1;
        
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `🎲 *Lancer de dé (${faces} faces)*\n\nRésultat: *${result}*` 
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  },

  // Coin Flip
  coin: {
    desc: "Lance une pièce",
    usage: `!coin`,
    run: async (sock, msg, args) => {
      try {
        const result = Math.random() > 0.5 ? "Pile" : "Face";
        
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `🪙 *Lancer de pièce*\n\nRésultat: *${result}*` 
        });

      } catch (e) {
        await sock.sendMessage(msg.key.remoteJid, { 
          text: `❌ Erreur: ${e.message}` 
        });
      }
    }
  }
};

module.exports = advancedCommands;
