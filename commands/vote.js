// commands/vote.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Crée un sondage')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('La question du sondage')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Options séparées par des virgules (max 10)')
                .setRequired(false)),

    async execute(interaction) {
        const question = interaction.options.getString('question');
        const optionsString = interaction.options.getString('options');

        let options = [];
        if (optionsString) {
            options = optionsString.split(',').map(opt => opt.trim());
            if (options.length > 10) {
                return interaction.reply({ 
                    content: 'Le maximum est de 10 options !', 
                    ephemeral: true 
                });
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('📊 Sondage')
            .setDescription(question)
            .setTimestamp()
            .setFooter({ 
                text: `Créé par ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL() 
            });

        const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

        if (options.length > 0) {
            const optionsText = options.map((opt, i) => 
                `${reactions[i]} ${opt}`
            ).join('\n');
            embed.addFields({ name: 'Options', value: optionsText });
        }

        const message = await interaction.reply({ 
            embeds: [embed], 
            fetchReply: true 
        });

        if (options.length > 0) {
            for (let i = 0; i < options.length; i++) {
                await message.react(reactions[i]);
            }
        } else {
            await message.react('👍');
            await message.react('👎');
            await message.react('🤷');
        }
    }
};