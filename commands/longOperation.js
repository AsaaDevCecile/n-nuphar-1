// commands/longOperation.js
function operationAvecTimeout(operation, timeout) {
    return Promise.race([
        operation,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout')), timeout))
    ]);
}

module.exports = {
    name: 'longoperation',
    description: 'Exécute une opération longue avec un timeout',
    async execute(message, args) {
        try {
            await operationAvecTimeout(
                new Promise(resolve => setTimeout(resolve, 5000)), // Simule une opération longue
                3000 // Timeout de 3 secondes
            );
            await message.reply('Opération terminée avec succès !');
        } catch (error) {
            if (error.message === 'Operation timeout') {
                await message.reply('L\'opération a pris trop de temps et a été annulée.');
            } else {
                await message.reply(`Une erreur s'est produite : ${error.message}`);
            }
        }
    },
};
