module.exports = {
    name: 'prefix',
    aliases: [],
    description: `[ADMIN ONLY]Change the bot's prefix used on your server. 10 characters max, no spaces.`,
    args: false, //change to true if command requires arguments
    usage: '<new prefix>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        if (message.member.permissions.has('ADMINISTRATOR')) {
            if (args[1]) return message.channel.send('The new prefix cannot include spaces.');
            else if (args[0].length > 10) return message.channel.send('The new prefix cannot be longer than 10 characters');
            else {
                pool.getConnection(function (err, connection) {
                    if (err) throw err;
                    else {
                        connection.query(`UPDATE guilds SET gPrefix = '${args[0]}' WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                            if (error) {
                                message.channel.send('There was an error updating your prefix.\nContact one of the devs on our server if this problem persists.');
                                connection.release();
                                throw error;
                            }
                            else {
                                connection.release();
                                return message.channel.send(`Your server's prefix has been updated to ${args[0]}`);
                            }
                        });
                    }
                });
            }
        } else return message.channel.send(`Only administrators may perform this command.`);
    },
};