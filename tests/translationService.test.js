// tests/translationService.test.js
const reverso = require('../services/translators/reverso');

// Fonction pour exécuter tous les tests
async function runTests() {
    console.log('=== Démarrage des tests de traduction ===\n');

    console.log('Test 1: Traduction simple');
    await translateText();
    console.log('------------------------\n');

    console.log('Test 2: Traduction multiple');
    await translateMultiple();
    console.log('------------------------\n');

    console.log('Test 3: Détection de langue');
    await detectLanguage();
    console.log('------------------------\n');
}

// Traduction simple
async function translateText() {
    try {
        const result = await reverso.translate('Bonjour le monde', 'fr', 'en');
        console.log('✓ Résultat:', result.translatedText);
    } catch (error) {
        console.error('✗ Translation failed:', error.message);
    }
}

// Traduction par lots
async function translateMultiple() {
    const texts = ['Bonjour', 'Au revoir', 'Merci'];
    try {
        const results = await reverso.translateBatch(texts, 'fr', 'en');
        results.forEach(result => {
            if (result.error) {
                console.error(`✗ Error translating "${result.text}": ${result.error}`);
            } else {
                console.log(`✓ Translated: ${result.translatedText}`);
            }
        });
    } catch (error) {
        console.error('✗ Batch translation failed:', error.message);
    }
}

// Détection de langue
async function detectLanguage() {
    try {
        const language = await reverso.detectLanguage('Hello world');
        console.log('✓ Detected language:', language);
    } catch (error) {
        console.error('✗ Language detection failed:', error.message);
    }
}

// Exécuter les tests
runTests().catch(console.error);