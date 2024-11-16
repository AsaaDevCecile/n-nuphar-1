// commands/exampleCommand.js
const logError = require('../utils/errorLogger');

module.exports = {
    name: 'example',
    description: 'An example command',
    execute(message, args) {
        try {
            // Command logic here
            message.reply('Example command executed successfully!');
        } catch (error) {
            console.error('Error in example command:', error);
            logError('COMMAND_ERROR', `Error in example command: ${error.stack || error}`);
            message.reply('An error occurred while executing the command.');
        }
    },
};

// Exemple d'utilisation
const reverso = require('./services/translators/reverso');

// Traduction simple
async function translateText() {
    try {
        const result = await reverso.translate('Bonjour le monde', 'fr', 'en');
        console.log(result.translatedText);
    } catch (error) {
        console.error('Translation failed:', error.message);
    }
}

// Traduction par lots
async function translateMultiple() {
    const texts = ['Bonjour', 'Au revoir', 'Merci'];
    try {
        const results = await reverso.translateBatch(texts, 'fr', 'en');
        results.forEach(result => {
            if (result.error) {
                console.error(`Error translating "${result.text}": ${result.error}`);
            } else {
                console.log(`Translated: ${result.translatedText}`);
            }
        });
    } catch (error) {
        console.error('Batch translation failed:', error.message);
    }
}

// Détection de langue
async function detectLanguage() {
    try {
        const language = await reverso.detectLanguage('Hello world');
        console.log('Detected language:', language);
    } catch (error) {
        console.error('Language detection failed:', error.message);
    }
}