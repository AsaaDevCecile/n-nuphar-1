// commands/divide.js
module.exports = {
    name: 'divide',
    description: 'Divise deux nombres',
    execute(message, args) {
        try {
            const num1 = parseFloat(args[0]);
            const num2 = parseFloat(args[1]);

            if (isNaN(num1) || isNaN(num2)) {
                throw new Error('Les arguments doivent être des nombres');
            }

            if (num2 === 0) {
                throw new Error('Division par zéro !');
            }

            const result = num1 / num2;
            return message.reply(`Le résultat est : ${result}`);
        } catch (error) {
            return message.reply(`Une erreur s'est produite : ${error.message}`);
        }
    },
};