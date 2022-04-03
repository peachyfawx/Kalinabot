module.exports = {
    name: 'reminder',
    description: 'Enable or disable reminders in a specific channel',
    args: true,
    usage: `<on> or <off>`,
    execute(message, args, pool, bot, prefix) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            else {
                //turning reminders on
                if (args[0].toLowerCase() === 'on') {
                    //look up the guild turning reminders on
                    connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                        if (error) {
                            connection.release();
                            throw error;
                        }
                        //check if they already have reminders turned on
                        if (results[0].reminder === message.channel.id) {
                            connection.release();
                            return message.channel.send(`${message.channel.name} is already set to receive non-battery reminders.`);
                        }
                        else {
                            //if not, turn them on
                            connection.query(`UPDATE guilds SET reminder = '${message.channel.id}' WHERE guild = '${message.guild.id}'`, function (error) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                            //tell em it worked
                            connection.release();
                            bot.channels.cache.get('706234956778831872').send(`${message.guild.name} has enabled non-battery reminders in "${message.channel.name}".`);
                            return message.channel.send(`I have set ${message.channel.name} as the channel to receive non-battery reminders in.`);
                        }
                    });
                }
                //turning reminders off
                else if (args[0].toLowerCase() === 'off') {
                    //look the guild up
                    connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                        if (error) {
                            connection.release();
                            throw error;
                        }
                        //check if reminders are already off
                        if (results[0].reminder === 'OFF') {
                            connection.release();
                            return message.channel.send(`${message.channel.name} is not currently set to receive non-battery reminders.`);
                        }
                        else {
                            //if not, turn em off
                            connection.query(`UPDATE guilds SET reminder = 'OFF' WHERE guild = '${message.guild.id}'`, function (error) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                            //let em know it worked
                            connection.release();
                            bot.channels.cache.get('706234956778831872').send(`${message.guild.name} has disabled non-battery reminders in "${message.channel.name}".`);
                            return message.channel.send(`I have disabled non-battery reminders in ${message.channel.name}`);
                        }
                    });
                }
                //they didn't specify on or off
                else {
                    connection.release();
                    return message.channel.send(`Please indicate if you want non-battery reminders turned 'off' or 'on'`);
                }
            }
        });

    },
};