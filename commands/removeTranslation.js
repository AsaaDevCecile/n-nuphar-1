// commands/removeTranslation.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const TranslationChannelsService = require('../services/translationChannels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove-translation')
        .setDescription('Retire un salon du système de traduction automatique')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Le salon à retirer')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        if (!TranslationChannelsService.isTranslationChannel(channel.id)) {
            return interaction.reply({
                content: 'Ce salon n\'est pas configuré pour la traduction automatique.',
                ephemeral: true
            });
        }

        TranslationChannelsService.unregisterChannel(channel.id);

        await interaction.reply({
            content: `Le salon ${channel} a été retiré du système de traduction automatique.`,
            ephemeral: true
        });
    }
};