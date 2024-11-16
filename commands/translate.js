// commands/translate.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const TranslationService = require('../services/translators');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Traduit un texte')
        .addStringOption(option => 
            option.setName('text')
                .setDescription('Le texte à traduire')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('to')
                .setDescription('Langue cible')
                .setRequired(true)
                .addChoices(
                    { name: 'Français', value: 'fr' },
                    { name: 'Anglais', value: 'en' },
                    { name: 'Espagnol', value: 'es' },
                    { name: 'Allemand', value: 'de' },
                    { name: 'Italien', value: 'it' }
                ))
        .addStringOption(option =>
            option.setName('from')
                .setDescription('Langue source')
                .setRequired(false)
                .addChoices(
                    { name: 'Français', value: 'fr' },
                    { name: 'Anglais', value: 'en' },
                    { name: 'Espagnol', value: 'es' },
                    { name: 'Allemand', value: 'de' },
                    { name: 'Italien', value: 'it' }
                )),
    async execute(interaction) {
        const text = interaction.options.getString('text');
        const toLang = interaction.options.getString('to');
        const fromLang = interaction.options.getString('from') || 'auto';

        await interaction.deferReply();

        try {
            const translation = await TranslationService.translateText(text, fromLang, toLang);
            await interaction.editReply(`Traduction: ${translation}`);
        } catch (error) {
            await interaction.editReply('Désolé, une erreur est survenue lors de la traduction.');
        }
    }
};