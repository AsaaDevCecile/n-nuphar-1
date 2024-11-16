// config/config.js
require('dotenv').config();

module.exports = {
    token: process.env.BOT_TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    moderationRoles: ['Modérateur', 'Admin'],
    prefix: '!',
    dbUri: process.env.MONGODB_URI
};