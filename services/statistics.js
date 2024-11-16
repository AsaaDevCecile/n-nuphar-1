// services/statistics.js
const db = require('./database');

class StatisticsService {
    async logTranslation(message, translatedContent, sourceLang, targetLang) {
        return await db.logTranslation(
            message.guild.id,
            message.channel.id,
            message.channel.id,
            sourceLang,
            targetLang,
            message.content.length
        );
    }

    async getStats(guildId, period = '24h') {
        const stats = await db.getTranslationStats(guildId, period);
        return this.formatStats(stats);
    }

    formatStats(stats) {
        let totalTranslations = 0;
        let totalChars = 0;
        const languagePairs = {};

        stats.forEach(stat => {
            totalTranslations += stat.translation_count;
            totalChars += stat.total_chars;
            
            const pairKey = `${stat.source_lang}->${stat.target_lang}`;
            languagePairs[pairKey] = {
                count: stat.translation_count,
                chars: stat.total_chars,
                avgChars: Math.round(stat.avg_chars)
            };
        });

        return {
            summary: {
                totalTranslations,
                totalChars,
                avgCharsPerTranslation: Math.round(totalChars / totalTranslations)
            },
            languagePairs
        };
    }
}

module.exports = new StatisticsService();