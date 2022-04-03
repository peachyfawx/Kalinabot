module.exports = {
    name: 'announcements',
    aliases: ['announce', 'a'],
    description: '[ADMIN ONLY]Enables or disables announcements from us in the channel this command is executed. Only one channel can receive announcements.',
    args: true, //change to true if command requires arguments
    usage: '<on> or <off>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        if (message.member.permissions.has('ADMINISTRATOR')) {
            pool.getConnection(function (err, connection) {
                if (err) throw err;
                else {
                    if (args[0].toLowerCase() === 'off') {
                        connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                            if (error) {
                                connection.release();
                                throw error;
                            }
                            else if (results[0].announcement === 'OFF') {
                                connection.release();
                                return message.channel.send(`${message.channel.name} already has announcements turned off.`);
                            }
                            else {
                                connection.query(`UPDATE guilds SET announcement = 'OFF' WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                                    if (error) {
                                        connection.release();
                                        throw error;
                                    }
                                });
                                connection.release();
                                bot.channels.cache.get('706234956778831872').send(`${message.guild.name} has disabled announcements in "${message.channel.name}".`);
                                return message.channel.send(`I have disabled our announcements in "${message.channel.name}"`);
                            }
                        });
                    }
                    //enable announcements
                    else if (args[0].toLowerCase() === 'on') {
                        //look up the guild in the database
                        connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                            if (error) {
                                connection.release();
                                throw error;
                            }
                            //check if announcements are already enabled on this channel
                            else if (results[0].announcement === message.channel.id) {
                                connection.release();
                                return message.channel.send('This channel is already set to receive our announcements');
                            }
                            //enable announcements / change announcement channel
                            else {
                                connection.query(`UPDATE guilds SET announcement = '${message.channel.id}' WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                                    if (error) {
                                        connection.release();
                                        throw error;
                                    }
                                });
                                connection.release();
                                bot.channels.cache.get('706234956778831872').send(`${message.guild.name} has enabled announcements in "${message.channel.name}".`);
                                return message.channel.send(`I have enabled our announcements in "${message.channel.name}"`);
                            }
                        });
                    } else {
                        connection.release();
                        return message.channel.send('Indicate whether you want announcements "on" or "off". Use the help command if needed.');
                    }
                }
            });
            //if member is not admin
        } else return message.channel.send('You need administrator privileges to execute this command.');
    },
};