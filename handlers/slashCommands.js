// slashCommands.js
const { REST, Routes } = require('discord.js');
const logError = require('./utils/errorLogger');

const commands = [
    {
        name: 'play',
        description: 'Joue une chanson',
        options: [
            {
                name: 'query',
                type: 3,
                description: 'La chanson à jouer',
                required: true,
            },
        ],
    },
    {
        name: 'stop',
        description: 'Arrête la musique',
    },
];

async function registerSlashCommands(clientId, guildId, token) {
    const rest = new REST({ version: '9' }).setToken(token);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
        logError('SLASH_COMMAND_REGISTRATION', error.stack || error);
    }
}

module.exports = { registerSlashCommands };