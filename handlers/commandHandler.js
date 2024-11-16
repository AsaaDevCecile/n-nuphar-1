// handlers/commandHandler.js
const fs = require('fs');
const path = require('path');

class CommandHandler {
    constructor(client) {
        this.client = client;
        this.commands = new Map();
        this.categories = ['music', 'games', 'moderation', 'fun', 'info'];
    }

    loadCommands() {
        // Charger les commandes principales
        const commandsPath = path.join(__dirname, '..', 'commands');
        this.loadCommandsFromDirectory(commandsPath);

        // Charger les commandes de musique
        const musicPath = path.join(__dirname, '..', 'musique');
        this.loadMusicCommands(musicPath);

        // Charger les commandes de jeux
        const gamesPath = path.join(__dirname, '..', 'games');
        this.loadGameCommands(gamesPath);

        // Charger les commandes de modération
        const moderationPath = path.join(__dirname, '..', 'moderation');
        this.loadModerationCommands(moderationPath);

        // Charger les commandes diverses
        const diversPath = path.join(__dirname, '..', 'divers');
        this.loadDiversCommands(diversPath);

        console.log(`[CommandHandler] ${this.commands.size} commandes chargées`);
    }

    loadCommandsFromDirectory(directoryPath) {
        if (!fs.existsSync(directoryPath)) return;

        const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.js'));
        for (const file of files) {
            const filePath = path.join(directoryPath, file);
            const command = require(filePath);
            if (command.name) {
                this.commands.set(command.name, command);
            }
        }
    }

    loadMusicCommands(musicPath) {
        if (!fs.existsSync(musicPath)) return;

        const musicCommands = require(path.join(musicPath, 'cdsMusic.js'));
        const commands = {
            play: {
                name: 'play',
                description: 'Jouer de la musique',
                execute: musicCommands.play
            },
            stop: {
                name: 'stop',
                description: 'Arrêter la musique',
                execute: musicCommands.stop
            },
            queue: {
                name: 'queue',
                description: 'Voir la file d\'attente',
                execute: musicCommands.queue
            },
            skip: {
                name: 'skip',
                description: 'Passer à la chanson suivante',
                execute: musicCommands.skip
            },
            pause: {
                name: 'pause',
                description: 'Mettre en pause la musique',
                execute: musicCommands.pause
            },
            resume: {
                name: 'resume',
                description: 'Reprendre la musique',
                execute: musicCommands.resume
            }
        };

        for (const [name, command] of Object.entries(commands)) {
            this.commands.set(name, command);
        }
    }

    loadGameCommands(gamesPath) {
        if (!fs.existsSync(gamesPath)) return;

        const gameFiles = fs.readdirSync(gamesPath).filter(file => file.endsWith('.js'));
        const gameCommands = {};

        for (const file of gameFiles) {
            const game = require(path.join(gamesPath, file));
            if (game.name) {
                gameCommands[game.name] = game;
            }
        }

        // Charger les jeux depuis cdsJeux.js
        const cdsJeux = require(path.join(gamesPath, 'cdsJeux.js'));
        if (typeof cdsJeux === 'object') {
            Object.assign(gameCommands, cdsJeux);
        }

        for (const [name, command] of Object.entries(gameCommands)) {
            this.commands.set(name, command);
        }
    }

    loadModerationCommands(moderationPath) {
        if (!fs.existsSync(moderationPath)) return;

        const moderationFiles = fs.readdirSync(moderationPath).filter(file => file.endsWith('.js'));
        for (const file of moderationFiles) {
            const command = require(path.join(moderationPath, file));
            if (command.name) {
                this.commands.set(command.name, command);
            }
        }
    }

    loadDiversCommands(diversPath) {
        if (!fs.existsSync(diversPath)) return;

        const diversFiles = fs.readdirSync(diversPath).filter(file => file.endsWith('.js'));
        for (const file of diversFiles) {
            const commands = require(path.join(diversPath, file));
            if (typeof commands === 'object') {
                for (const [name, command] of Object.entries(commands)) {
                    this.commands.set(name, command);
                }
            }
        }
    }

    getCommand(name) {
        return this.commands.get(name);
    }

    getAllCommands() {
        return Array.from(this.commands.values());
    }

    getCommandsByCategory(category) {
        return Array.from(this.commands.values()).filter(cmd => cmd.category === category);
    }
}

// Ajouter dans la méthode loadCommands()

loadTranslationCommands() 
{
    const translationCommands = {
        translate: require('../commands/translate'),
        vote: require('../commands/vote')
    };

    for (const [name, command] of Object.entries(translationCommands)) {
        this.commands.set(name, command);
    }
}

module.exports = CommandHandler;