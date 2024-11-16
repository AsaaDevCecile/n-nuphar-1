// index.js
const CommandHandler = require('./handlers/commandHandler');

// Dans votre setup du client
const commandHandler = new CommandHandler(client);
commandHandler.loadCommands();

// Gérer les interactions/commandes
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = commandHandler.getCommand(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ 
            content: 'Une erreur est survenue lors de l\'exécution de la commande!', 
            ephemeral: true 
        });
    }
});