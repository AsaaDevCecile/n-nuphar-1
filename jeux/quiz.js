// commands/games/quiz.js
module.exports = {
    name: 'quiz',
    description: 'Jouer au quiz',
    async execute(interaction) {
        const questions = [
            {
                question: "Quelle est la capitale de la France ?",
                answers: ["Paris"],
                points: 10

                question: "Quel est le plus grand océan du monde ?", 
                answer: "Pacifique",

                question: "Combien de côtés a un hexagone ?", 
                answer: "6", }
        ]
            // Ajoutez plus de questions
        

        // Logique du quiz
    }
};