module.exports = {
    handleFun(message) {
        if (message.content === '!ping') {
            message.channel.send('Pong!');
        }
        
        if (message.content.startsWith('!guess')) {
            const guess = parseInt(message.content.split(' ')[1]);
            const numberToGuess = Math.floor(Math.random() * 100) + 1;
            if (guess === numberToGuess) {
                message.channel.send('Félicitations ! Tu as deviné le bon nombre.');
            } else if (guess < numberToGuess) {
                message.channel.send('C’est plus haut !');
            } else {
                message.channel.send('C’est plus bas !');
            }
        }
    }
};