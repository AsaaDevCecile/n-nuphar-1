module.exports = {
    handleInfo(message) {
        if (message.content === '!userinfo') {
            message.channel.send(`Ton nom d'utilisateur : ${message.author.username}\nTon ID : ${message.author.id}`);
        }
    }