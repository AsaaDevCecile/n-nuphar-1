// errorHandler.js
const logError = require('./utils/errorLogger');

function setupErrorHandlers(client) {
    client.on('error', error => {
        console.error('Une erreur globale est survenue:', error);
        logError('DISCORD_ERROR', error.stack || error);
    });

    process.on('unhandledRejection', error => {
        console.error('Promesse non gérée:', error);
        logError('UNHANDLED_REJECTION', error.stack || error);
    });

    process.on('uncaughtException', error => {
        console.error('Exception non attrapée:', error);
        logError('UNCAUGHT_EXCEPTION', error.stack || error);
        process.exit(1);
    });
}

module.exports = { setupErrorHandlers };