// musique/musicHandler.js
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');
const YouTube = require('youtube-sr').default;

class MusicHandler {
    constructor() {
        this.queues = new Map();
        this.connections = new Map();
        this.players = new Map();
    }

    // ... (gardez les méthodes playMusic, playNextSong et stopMusic existantes) ...

    async pauseMusic(interaction) {
        const guildId = interaction.guildId;
        const player = this.players.get(guildId);

        if (!player) {
            return interaction.reply("Il n'y a pas de musique en cours de lecture !");
        }

        player.pause();
        await interaction.reply("⏸️ Musique mise en pause.");
    }

    async resumeMusic(interaction) {
        const guildId = interaction.guildId;
        const player = this.players.get(guildId);

        if (!player) {
            return interaction.reply("Il n'y a pas de musique en pause !");
        }

        player.unpause();
        await interaction.reply("▶️ Reprise de la lecture.");
    }

    async skipMusic(interaction) {
        const guildId = interaction.guildId;
        const player = this.players.get(guildId);
        const queue = this.queues.get(guildId);

        if (!player) {
            return interaction.reply("Il n'y a pas de musique à passer !");
        }

        if (!queue || queue.length <= 1) {
            return interaction.reply("Il n'y a pas de musique suivante dans la file d'attente !");
        }

        player.stop(); // Cela déclenchera l'événement Idle qui passera à la chanson suivante
        await interaction.reply("⏭️ Passage à la musique suivante.");
    }

    async showQueue(interaction) {
        const guildId = interaction.guildId;
        const queue = this.queues.get(guildId);

        if (!queue || queue.length === 0) {
            return interaction.reply("La file d'attente est vide !");
        }

        const queueList = queue.map((song, index) => 
            `${index + 1}. ${song.title}`
        ).join('\n');

        await interaction.reply(`📜 **File d'attente actuelle:**\n${queueList}`);
    }

    async clearQueue(interaction) {
        const guildId = interaction.guildId;
        const queue = this.queues.get(guildId);

        if (!queue) {
            return interaction.reply("Il n'y a pas de file d'attente à vider !");
        }

        // Garde la chanson en cours et supprime le reste
        const currentSong = queue[0];
        this.queues.set(guildId, [currentSong]);

        await interaction.reply("🗑️ File d'attente vidée (sauf la chanson en cours).");
    }
}

module.exports = new MusicHandler();// musique/musicHandler.js
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const play = require('play-dl');
const YouTube = require('youtube-sr').default;

class MusicHandler {
    constructor() {
        this.queues = new Map();
        this.connections = new Map();
        this.players = new Map();
    }

    async playMusic(interaction, query) {
        try {
            const voiceChannel = interaction.member.voice.channel;
            if (!voiceChannel) {
                return interaction.reply("Tu dois être dans un canal vocal pour jouer de la musique !");
            }

            // Recherche de la vidéo
            const results = await YouTube.search(query, {
                limit: 1,
                type: 'video'
            });

            if (!results.length) {
                return interaction.reply("Aucune musique trouvée pour cette recherche.");
            }

            const video = results[0];
            const guildId = interaction.guildId;

            // Initialiser la file d'attente si elle n'existe pas
            if (!this.queues.has(guildId)) {
                this.queues.set(guildId, []);
            }

            // Ajouter à la file d'attente
            this.queues.get(guildId).push({
                url: video.url,
                title: video.title
            });

            await interaction.reply(`🎶 Ajouté à la file d'attente : ${video.title}`);

            // Si aucune connexion n'existe, créer une nouvelle
            if (!this.connections.has(guildId)) {
                const connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: guildId,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });

                const player = createAudioPlayer();
                connection.subscribe(player);

                this.connections.set(guildId, connection);
                this.players.set(guildId, player);

                player.on(AudioPlayerStatus.Idle, () => {
                    const queue = this.queues.get(guildId);
                    queue.shift();
                    if (queue.length > 0) {
                        this.playNextSong(guildId);
                    } else {
                        connection.destroy();
                        this.connections.delete(guildId);
                        this.players.delete(guildId);
                        this.queues.delete(guildId);
                        interaction.channel.send("La file d'attente est vide. Déconnexion...");
                    }
                });

                await this.playNextSong(guildId);
            }
        } catch (error) {
            console.error('Erreur dans playMusic:', error);
            interaction.reply("Une erreur est survenue lors de la lecture de la musique.");
        }
    }

    async playNextSong(guildId) {
        try {
            const queue = this.queues.get(guildId);
            if (!queue || queue.length === 0) return;

            const song = queue[0];
            const stream = await play.stream(song.url);
            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            const player = this.players.get(guildId);
            player.play(resource);
        } catch (error) {
            console.error('Erreur dans playNextSong:', error);
        }
    }

    async stopMusic(interaction) {
        const guildId = interaction.guildId;
        const connection = this.connections.get(guildId);

        if (!connection) {
            return interaction.reply("Je ne suis pas dans un canal vocal !");
        }

        this.queues.delete(guildId);
        connection.destroy();
        this.connections.delete(guildId);
        this.players.delete(guildId);

        await interaction.reply("Musique arrêtée et file d'attente vidée.");
    }
}

module.exports = new MusicHandler();