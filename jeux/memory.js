// commands/games/memory.js
module.exports = {
    name: 'memory',
    description: 'Jeu de mémoire',
    async execute(interaction) {
        const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍑', '🍐', '🍒'];
        let board = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

        // Logique du memory
    }
};