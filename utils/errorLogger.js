// utils/errorLogger.js
const fs = require('fs');
const path = require('path');

function logError(error) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}[${type}]: ${message}\n`;
    const logPath = path.join(__dirname, '..', 'error.log');
    
    fs.appendFile(logPath, logMessage, (err) => {
        if (err) console.error("Erreur lors de l'écriture dans le fichier de log:", err);
    });
    
}

module.exports = logError;