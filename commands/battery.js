module.exports = {
    name: 'battery',
    aliases: ['bat', 'b', 'batteries'],
    description: 'Enable or disable battery reminders in the channel this command is executed in. Only one channel can receive battery reminders.',
    args: true,
    usage: '<on> or <off>',
    execute(message, args, pool, bot, prefix) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            else {
                //turn on battery reminders
                if (args[0].toLowerCase() === 'on') {
                    //look up the guild in the database
                    connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                        if (error) {
                            connection.release();
                            throw error;
                        }
                        //if the guild is already receiving battery reminders in this channel
                        else if (results[0].battery === message.channel.id) {
                            connection.release();
                            return message.channel.send(`${message.channel.name} is already set to receive battery reminders.`);
                        }
                        else {
                            //update the database
                            connection.query(`UPDATE guilds SET battery = '${message.channel.id}' WHERE guild = '${message.guild.id}'`, function (error) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                            connection.release();
                            bot.channels.cache.get('706234956778831872').send(`${message.guild.name} has enabled battery reminders in "${message.channel.name}".`);
                            return message.channel.send(`${message.channel.name} will now receive battery reminders.`);
                        }
                    });
                }
                //turn off battery reminders
                else if (args[0].toLowerCase() === 'off') {
                    //look up the guild in the database
                    connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                        if (error) {
                            connection.release();
                            throw error;
                        }
                        //if the guild already disabled battery reminders
                        if (results[0].battery === 'OFF') {
                            connection.release();
                            return message.channel.send(`${message.channel.name} is not currently set to receive battery reminders.`);
                        }
                        else {
                            //turn off the reminders
                            connection.query(`UPDATE guilds SET battery = 'OFF' WHERE guild = '${message.guild.id}'`, function (error) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                            connection.release();
                            bot.channels.cache.get('706234956778831872').send(`${message.guild.name} has disabled reminders in "${message.channel.name}".`);
                            return message.channel.send(`I have disabled battery reminders in ${message.channel.name}`);
                        }
                    });
                } //incorrect argument was given (something that wasn't on or off)
                else {
                    connection.release();
                    return message.channel.send(`Please indicate if you want battery reminders turned 'off' or 'on'`);
                }
            }
        });

    },
};