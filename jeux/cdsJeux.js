// jeux/cdsJeux.js
const bingoGame = require('./bingo');
const chifumiGame = require('./chifumi');
const colormindGame = require('./colormind');
const guessNumberGame = require('./devineLeNombre');
const gamesHandler = require('./games');
const hangmanGame = require('./hangman');
const minesweeperGame = require('./minesweeper');
const ticTacToeGame = require('./ticTacToe');

module.exports = {
    name: 'jeu',
    description: 'Joue à un jeu',
    execute(message, args) {
        if (!args.length) {
            const gamesList = [
                ":game_die: `!jeu roll` : Lance un dé à 6 faces.",
                ":question: `!jeu quiz` : Réponds à une question de quiz.",
                "`!jeu number` : Devine un nombre.",
                "`!jeu morpion` : Joue au Morpion (Tic Tac Toe).",
                "`!jeu chifumi [choix]` : Joue à Chifumi (Pierre, Papier, Ciseaux).",
                "`!jeu bingo` : Démarre un jeu de Bingo.",
                "`!jeu pendu` : Démarre un jeu de Pendu.",
                "`!jeu demineur` : Démarre un jeu de Démineur.",
                "`!jeu colormind` : Joue à Colormind."
            ];
            return message.reply("**:video_game: Jeux disponibles :**\n" + gamesList.join("\n"));
        }

        const gameCommand = args.shift().toLowerCase();

        switch (gameCommand) {
            case 'roll':
                gamesHandler.rollDice(message);
                break;
            case 'quiz':
                gamesHandler.startQuiz(message);
                break;
            case 'number':
                guessNumberGame.startGuessNumberGame(message);
                break;
            case 'morpion':
                ticTacToeGame.startTicTacToeGame(message);
                break;
            case 'chifumi':
                chifumiGame.startChifumiGame(message, args);
                break;
            case 'bingo':
                bingoGame.startBingo(message);
                break;
            case 'pendu':
                hangmanGame.startHangmanGame(message);
                break;
            case 'demineur':
                minesweeperGame.startMinesweeperGame(message);
                break;
            case 'colormind':
                colormindGame.startColormindGame(message);
                break;
            default:
                message.reply('Ce jeu n\'existe pas. Utilisez `!jeu` sans arguments pour voir la liste des jeux disponibles.');
        }
    }
};
