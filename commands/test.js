module.exports = {
    name: 'test',
    description: 'testing stuff, for the devs',
    args: false,
    usage: `you should know this`,
    execute(message, args, pool, bot, prefix) {
        if (message.author.id === '98201428434104320' || message.author.id === '109627921051725824') {
            pool.query(`SELECT * FROM guilds WHERE guildID = '${message.guild.id}'`, function (error, results, fields) {
                if (error) throw error;
                return message.channel.send(`Results test: ${results[0].guildID}\nFields test: ${fields[0].guildID}`);
            });
        } else return;
    },
};