// Devine le nombre
module.exports = {
    startGuessNumberGame(message) {
        const maxNumber = 200; // Augmente le maximum ici
        const numberToGuess = Math.floor(Math.random() * maxNumber) + 1;
        let attempts = 15; // Augmente le nombre de tentatives ici

        message.channel.send(`J'ai choisi un nombre entre 1 et ${maxNumber}. Devinez-le!`);

        const filter = response => !isNaN(response.content) && response.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, time: 60000 });

        collector.on('collect', msg => {
            const guess = parseInt(msg.content);
            attempts--;

            if (guess === numberToGuess) {
                msg.channel.send(`Bravo, tu as trouvé le nombre en ${15 - attempts} tentatives!`);
                collector.stop();
            } else if (guess < numberToGuess) {
                msg.channel.send("Trop petit !");
            } else {
                msg.channel.send("Trop grand !");
            }

            if (attempts === 0) {
                msg.channel.send(`Temps écoulé, personne n'a trouvé le nombre. C'était ${numberToGuess}.`);
                collector.stop();
            }
        });

        collector.on('end', () => {
            if (attempts > 0) {
                message.channel.send("Le jeu de devine le nombre est terminé.");
            }
        });
    }
};