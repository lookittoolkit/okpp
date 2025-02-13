const TelegramBot = require('node-telegram-bot-api'); // Assurez-vous d'avoir installé cette dépendance
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "7560255282:AAFjnEKUvdc3k65dcfp_ZjHJu1-8vuJ_Nmk"; // Remplace par le token de BotFather
const express = require('express');
const app = express();

if (!TOKEN) {
    throw new Error("Le token du bot Telegram n'est pas défini. Veuillez définir la variable d'environnement TELEGRAM_BOT_TOKEN.");
}
const DELETE_DELAY = 5000; // Délai avant suppression (en millisecondes)
const YOUR_ID = 5186408982; // Votre ID Telegram

// --- Initialisation du bot ---
const bot = new TelegramBot(TOKEN, { polling: true });
// Route pour ping
app.get('/ping', (req, res) => {
    res.send('Bot en ligne');
});

// Démarrer le serveur Express
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
console.log("Bot démarré et en écoute...");

// Fonction pour envoyer les logs à votre ID
function sendLog(message) {
    bot.sendMessage(YOUR_ID, message).catch((err) => console.error(`Erreur envoi log:`, err));
}

// Fonction pour gérer les messages de canal
async function handleChannelPost(msg) {
    console.log('Message reçu:', msg); // Ajout de ce log pour inspecter le contenu de msg

    const chatId = msg.chat.id;
    const messageId = msg.message_id;
    const authorSignature = msg.author_signature || 'inconnu';
    const messageDate = new Date(msg.date * 1000);
    const heure = messageDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const logMessage = `Message reçu dans le canal ${chatId} avec la signature ${authorSignature} à ${heure}.`;
    console.log(logMessage);
    sendLog(logMessage);

    // Vérifier si la signature de l'auteur est différente de 'BENIN BOYS'
    if (authorSignature !== 'BENIN BOYS' && authorSignature !== '🀄️Mr Patos 🥷🏽') {
        const adminLogMessage = `Message ${messageId} avec la signature ${authorSignature} détecté. Suppression programmée dans ${DELETE_DELAY / 1000} secondes.`;
        console.log(adminLogMessage);
        sendLog(adminLogMessage);

        // Planifier la suppression du message après le délai
        setTimeout(() => {
            bot.deleteMessage(chatId, messageId)
                .then(() => {
                    const deleteLogMessage = `Message ${messageId} supprimé à ${heure} ✅.`;
                    console.log(deleteLogMessage);
                    sendLog(deleteLogMessage);
                })
                .catch((err) => {
                    const errorLogMessage = `Erreur suppression message ${messageId}: ${err}`;
                    console.error(errorLogMessage);
                    sendLog(errorLogMessage);
                });
        }, DELETE_DELAY);
    }
}

// --- Recuperation des logs et lanccement
bot.on("channel_post", handleChannelPost);

module.exports = { bot, sendLog, handleChannelPost };