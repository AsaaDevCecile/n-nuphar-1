// commands/setupTranslation.js
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const TranslationChannelsService = require('../services/translationChannels');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-translation')
        .setDescription('Configure un salon de traduction automatique')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Le salon à configurer')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('language')
                .setDescription('La langue du salon')
                .setRequired(true)
                .addChoices(
                    { name: 'Français', value: 'fr' },
                    { name: 'English', value: 'en' },
                    { name: 'Español', value: 'es' },
                    { name: 'Deutsch', value: 'de' },
                    { name: 'Italiano', value: 'it' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const language = interaction.options.getString('language');

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({
                content: 'Le salon doit être un salon textuel !',
                ephemeral: true
            });
        }

        TranslationChannelsService.registerChannel(channel.id, language);

        await interaction.reply({
            content: `Le salon ${channel} a été configuré pour la traduction automatique en ${language}.`,
            ephemeral: true
        });
    }
};