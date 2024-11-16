// services/translators/index.js
const { translate } = require('./reverso');

class TranslationService {
    static async translateText(text, fromLang, toLang) {
        try {
            const result = await translate(text, fromLang, toLang);
            return result;
        } catch (error) {
            console.error('Translation error:', error);
            throw new Error('Failed to translate text');
        }
    }

    static getSupportedLanguages() {
        return [
            'fr', 'en', 'es', 'de', 'it', 'pt', 
            'nl', 'pl', 'ru', 'ja', 'zh', 'ar'
        ];
    }
}

module.exports = TranslationService;