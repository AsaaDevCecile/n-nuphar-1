// services/translationChannels.js
const db = require('./database');
const statistics = require('./statistics');

class TranslationChannelsService {
    async registerChannel(channelId, guildId, languageCode) {
        await db.registerChannel(channelId, guildId, languageCode);
    }

    async unregisterChannel(channelId) {
        await db.unregisterChannel(channelId);
    }

    async getChannelLanguage(channelId) {
        return await db.getChannelLanguage(channelId);
    }

    async handleMessage(message) {
        // ... reste du code ...
        
        // Ajouter les statistiques
        await statistics.logTranslation(
            message,
            translatedContent,
            sourceLanguage,
            targetLang
        );
    }
}