// musique/cdsMusic.js
const musicHandler = require('./musicHandler');

module.exports = {
    play: {
        name: 'play',
        description: 'Joue une chanson',
        options: [
            {
                name: 'query',
                type: 3,
                description: 'Le titre ou l\'URL de la chanson',
                required: true
            }
        ],
        execute: async (interaction) => {
            const query = interaction.options.getString('query');
            await musicHandler.playMusic(interaction, query);
        }
    },
    stop: {
        name: 'stop',
        description: 'Arrête la musique et vide la file d\'attente',
        execute: async (interaction) => {
            await musicHandler.stopMusic(interaction);
        }
    },
    pause: {
        name: 'pause',
        description: 'Met la musique en pause',
        execute: async (interaction) => {
            await musicHandler.pauseMusic(interaction);
        }
    },
    resume: {
        name: 'resume',
        description: 'Reprend la lecture de la musique',
        execute: async (interaction) => {
            await musicHandler.resumeMusic(interaction);
        }
    },
    skip: {
        name: 'skip',
        description: 'Passe à la musique suivante',
        execute: async (interaction) => {
            await musicHandler.skipMusic(interaction);
        }
    },
    queue: {
        name: 'queue',
        description: 'Affiche la file d\'attente actuelle',
        execute: async (interaction) => {
            await musicHandler.showQueue(interaction);
        }
    },
    clear: {
        name: 'clear',
        description: 'Vide la file d\'attente (sauf la chanson en cours)',
        execute: async (interaction) => {
            await musicHandler.clearQueue(interaction);
        }
    }
};