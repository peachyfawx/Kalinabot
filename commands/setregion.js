module.exports = {
    name: 'setregion',
    aliases: ['setr', 'setreg', 'sregion'],
    description: '[ADMIN ONLY]Change the region used by your server to get accurate reminder timers. We currently support EN and JP timers.',
    args: true, //change to true if command requires arguments
    usage: '<EN> or <JP>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        if (message.member.permissions.has('ADMINISTRATOR')) {
            if (args[1]) return message.channel.send(`Region cannot contain spaces. Use command ${prefix}listregions to see a complete list of supported regions.`);
            else {
                pool.getConnection(function (err, connection) {
                    if (err) throw err;
                    else {
                        connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                            if (error) {
                                connection.release();
                                throw error;
                            }
                            else if (args[0].toLowerCase() === 'en') {
                                if (results[0].region === 'EN') {
                                    connection.release();
                                    return message.channel.send(`This server is already set to the EN region.`);
                                }
                                else {
                                    connection.query(`UPDATE guilds SET region = 'EN' WHERE guild = '${message.guild.id}'`, function (error1, results1, fields1) {
                                        if (error1) {
                                            connection.release();
                                            throw error1;
                                        }
                                        else {
                                            connection.release();
                                            return message.channel.send(`Your server was successfully updated to the EN region.`);
                                        }
                                    });
                                }
                            }
                            else if (args[0].toLowerCase() === 'jp') {
                                if (results[0].region === 'JP') {
                                    connection.release();
                                    return message.channel.send(`This server is already set to the JP region.`);
                                }
                                else {
                                    connection.query(`UPDATE guilds SET region = 'JP' WHERE guild = '${message.guild.id}'`, function (error2, results2, fields2) {
                                        if (error2) {
                                            connection.release();
                                            throw error2;
                                        }
                                        else {
                                            connection.release();
                                            return message.channel.send(`Your server was successfully updated to the JP region.`);
                                        }
                                    });
                                }
                            }
                            else {
                                connection.release();
                                return message.channel.send(`Unrecognized region. Reference ${prefix}listregions for a complete list of supported regions.`);
                            }
                        });
                    }
                });
            }
        } else return message.channel.send(`Only administrators can execute this command.`);
    },
};