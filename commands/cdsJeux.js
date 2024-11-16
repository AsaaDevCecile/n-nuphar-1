const games = {
    'rock-paper-scissors': {
        name: 'Pierre-Papier-Ciseaux',
        play: (userChoice) => {
            const choices = ['pierre', 'papier', 'ciseaux'];
            const botChoice = choices[Math.floor(Math.random() * choices.length)];
            // Logique du jeu ici
            return `Vous avez choisi ${userChoice}, j'ai choisi ${botChoice}.`;
        }
    },
    // Ajoutez d'autres jeux ici
};

module.exports = {
    name: 'jeu',
    description: 'Joue à un jeu',
    execute(message, args) {
        if (!args.length) {
            return message.reply('Veuillez spécifier un jeu. Les jeux disponibles sont : ' + Object.keys(games).join(', '));
        }

        const gameName = args[0].toLowerCase();
        const game = games[gameName];

        if (!game) {
            return message.reply('Ce jeu n\'existe pas. Les jeux disponibles sont : ' + Object.keys(games).join(', '));
        }

        // Logique pour démarrer le jeu
        message.reply(`Démarrage du jeu : ${game.name}`);
        // Vous pouvez ajouter ici la logique pour jouer au jeu
    },
};