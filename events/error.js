// events/error.js
const logError = require('../utils/errorLogger');

module.exports = {
    name: 'error',
    execute(error, client) {
        console.error('Une erreur est survenue:', error);
        logError('DISCORD_ERROR', error.stack || error);
    }
};