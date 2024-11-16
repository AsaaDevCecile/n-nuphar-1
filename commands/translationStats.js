// commands/translationStats.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const StatisticsService = require('../services/statistics');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translation-stats')
        .setDescription('Affiche les statistiques de traduction')
        .addStringOption(option =>
            option.setName('period')
                .setDescription('Période pour les statistiques')
                .setRequired(false)
                .addChoices(
                    { name: 'Dernières 24h', value: '24h' },
                    { name: '7 derniers jours', value: '7d' },
                    { name: '30 derniers jours', value: '30d' },
                    { name: 'Tout', value: 'all' }
                )),

    async execute(interaction) {
        await interaction.deferReply();

        const period = interaction.options.getString('period') || '24h';
        const stats = await StatisticsService.getStats(interaction.guild.id, period);

        const embed = new EmbedBuilder()
            .setTitle('📊 Statistiques de Traduction')
            .setColor('#0099ff')
            .addFields(
                { 
                    name: 'Total des traductions', 
                    value: `${stats.summary.totalTranslations}`, 
                    inline: true 
                },
                { 
                    name: 'Caractères traduits', 
                    value: `${stats.summary.totalChars}`, 
                    inline: true 
                },
                { 
                    name: 'Moyenne par message', 
                    value: `${stats.summary.avgCharsPerTranslation}`, 
                    inline: true 
                }
            );

        // Ajouter les stats par paire de langues
        Object.entries(stats.languagePairs).forEach(([pair, data]) => {
            embed.addFields({
                name: `${pair}`,
                value: `Messages: ${data.count}\nCaractères: ${data.chars}\nMoyenne: ${data.avgChars}`,
                inline: true
            });
        });

        await interaction.editReply({ embeds: [embed] });
    }
};