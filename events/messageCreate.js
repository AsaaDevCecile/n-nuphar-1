// events/messageCreate.js
// events/messageCreate.js
const logError = require('../utils/errorLogger');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        if (!message.content.startsWith('!') || message.author.bot) return;

        const args = message.content.slice(1).split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (!client.commands.has(commandName)) return;

        const command = client.commands.get(commandName);

        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            logError('COMMAND_EXECUTION', `Error in command ${commandName}: ${error.stack || error}`);
            message.reply('Une erreur s\'est produite lors de l\'exécution de la commande.');
        }
    },
};

// events/messageCreate.js
const TranslationChannelsService = require('../services/translationChannels');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const translatedMessages = await TranslationChannelsService.handleMessage(message);
        
        if (!translatedMessages || translatedMessages.length === 0) return;

        for (const translation of translatedMessages) {
            const targetChannel = client.channels.cache.get(translation.channelId);
            if (!targetChannel) continue;

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({
                    name: message.author.tag,
                    iconURL: message.author.displayAvatarURL()
                })
                .setDescription(translation.content)
                .setFooter({
                    text: `Traduit depuis #${message.channel.name}`
                })
                .setTimestamp();

            await targetChannel.send({ embeds: [embed] });
        }
    }
};