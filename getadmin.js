const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const token = '8191989885:AAFVd6-QQdGKdDYTggm-lzGJon4padAymf8'; // Remplace par ton vrai token
const bot = new TelegramBot(token, { polling: true });

const channelId = '@filmserielandvf10'; // Remplace par ton canal
const filePath = 'adminlist.txt';

async function getAdmins() {
    try {
        // Vérifier si le fichier existe déjà
        if (fs.existsSync(filePath)) {
            console.log('Le fichier adminlist.txt existe déjà. Aucun enregistrement nécessaire.');
            return;
        }

        const admins = await bot.getChatAdministrators(channelId);
        let adminList = 'Liste des administrateurs :\n';

        admins.forEach(admin => {
            const user = admin.user;
            const adminInfo = `${user.first_name || ''} ${user.last_name || ''} (${user.id})\n`;
            adminList += adminInfo;
        });

        // Écrire dans le fichier
        fs.writeFileSync(filePath, adminList);
        console.log('Liste des admins enregistrée dans adminlist.txt');

    } catch (error) {
        console.error('Erreur lors de la récupération des admins:', error);
    }
}

// Exécuter la récupération des admins
getAdmins();
