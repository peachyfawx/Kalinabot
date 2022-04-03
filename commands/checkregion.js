module.exports = {
    name: 'checkregion',
    aliases: ['cr', 'checkreg', 'regioncheck', 'region'],
    description: 'Find out what region this server is set as',
    args: false, //change to true if command requires arguments
    usage: '<no arguments taken>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            else {
                connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                    if (error) {
                        connection.release();
                        throw error;
                    }
                    else {
                        connection.release();
                        return message.channel.send(`This server is set as "${results[0].region}"`);
                    }
                });
            }
        });
    },
};