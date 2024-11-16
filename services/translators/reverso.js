// services/translators/reverso.js
const axios = require('axios');

class ReversoTranslator {
    constructor() {
        this.baseUrl = 'https://api.reverso.net/translate/v1/translation';
        this.supportedLanguages = {
            'fr': 'French',
            'en': 'English',
            'es': 'Spanish',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'nl': 'Dutch',
            'pl': 'Polish',
            'ru': 'Russian',
            'ar': 'Arabic',
            'ja': 'Japanese',
            'zh': 'Chinese',
            'ko': 'Korean',
            'tr': 'Turkish'
        };
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'application/json'
            },
            timeout: 10000 // 10 secondes timeout
        });
    }

    async translate(text, sourceLang, targetLang) {
        // Validation des entrées
        if (!text || text.trim().length === 0) {
            throw new Error('Text cannot be empty');
        }

        if (!this.isLanguageSupported(sourceLang)) {
            throw new Error(`Source language '${sourceLang}' is not supported`);
        }

        if (!this.isLanguageSupported(targetLang)) {
            throw new Error(`Target language '${targetLang}' is not supported`);
        }

        try {
            const response = await this.axiosInstance.post(this.baseUrl, {
                input: text,
                from: sourceLang,
                to: targetLang,
                format: 'text',
                options: {
                    sentenceSplitter: true,
                    origin: 'translation.web',
                    contextResults: false,
                    languageDetection: sourceLang === 'auto'
                }
            });

            if (!response.data || !response.data.translation || !response.data.translation.length) {
                throw new Error('Invalid response from Reverso API');
            }

            return {
                translatedText: response.data.translation[0],
                detectedLanguage: response.data.detectedLanguage,
                confidence: response.data.confidence,
                originalText: text,
                sourceLang: sourceLang,
                targetLang: targetLang
            };
        } catch (error) {
            if (error.response) {
                // Erreur avec réponse du serveur
                const status = error.response.status;
                switch (status) {
                    case 429:
                        throw new Error('Too many requests. Please try again later.');
                    case 413:
                        throw new Error('Text is too long.');
                    case 400:
                        throw new Error('Invalid request parameters.');
                    case 401:
                        throw new Error('Unauthorized. Authentication required.');
                    case 503:
                        throw new Error('Service temporarily unavailable.');
                    default:
                        throw new Error(`Translation service error: ${status}`);
                }
            } else if (error.request) {
                // Pas de réponse reçue
                throw new Error('No response from translation service.');
            } else {
                // Autre erreur
                throw new Error(`Translation error: ${error.message}`);
            }
        }
    }

    isLanguageSupported(lang) {
        return lang === 'auto' || this.supportedLanguages.hasOwnProperty(lang);
    }

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    async detectLanguage(text) {
        try {
            const result = await this.translate(text, 'auto', 'en');
            return result.detectedLanguage;
        } catch (error) {
            throw new Error(`Language detection failed: ${error.message}`);
        }
    }

    async translateBatch(texts, sourceLang, targetLang, batchSize = 5) {
        if (!Array.isArray(texts)) {
            throw new Error('Texts must be an array');
        }

        const results = [];
        const batches = [];

        // Diviser les textes en lots
        for (let i = 0; i < texts.length; i += batchSize) {
            batches.push(texts.slice(i, i + batchSize));
        }

        // Traduire chaque lot
        for (const batch of batches) {
            const batchPromises = batch.map(text => 
                this.translate(text, sourceLang, targetLang)
                    .catch(error => ({ error: error.message, text }))
            );

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
        }

        return results;
    }

    // Méthode utilitaire pour nettoyer le texte avant traduction
    sanitizeText(text) {
        return text
            .trim()
            .replace(/\s+/g, ' ')
            .slice(0, 5000); // Limite de caractères
    }
}

// Export une instance unique
module.exports = new ReversoTranslator();