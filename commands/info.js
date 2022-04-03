const Discord = require('discord.js');
const fs = require("fs");
const sStats = require('../searchStats.json');
const tStats = require('../timers.json');
module.exports = {
    name: 'info',
    aliases: [],
    description: 'Some statistics about the bot',
    args: false, //change to true if command requires arguments
    usage: '<no arugments taken>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            else {
                connection.query(`SELECT * FROM searchstats`, function (error, results1, fields) {
                    if (error) {
                        connection.release();
                        throw error;
                    }
                    else {
                        connection.query(`SELECT * FROM timerstats`, function (error2, results2, fields2) {
                            if (error2) {
                                connection.release();
                                throw error2;
                            }
                            else {
                                //var dTop = sStats[0];
                                var dTop = results1[0];
                                var tTop = results2[0];

                                for (var x = 1; x < results1.length; x++) { if (results1[x].count > dTop.count) dTop = results1[x]; }
                                for (var y = 1; y < results2.length; y++) { if (results2[y].count > tTop.count) tTop = results2[y]; }

                                let totalMembers = 0;
                                bot.guilds.cache.forEach(guild => { totalMembers += guild.memberCount; });

                                let infoEmbed = new Discord.MessageEmbed()
                                    .setThumbnail(bot.user.avatarURL)
                                    .setFooter(`Developed by Fawx and ServerWizard`)
                                    .setTitle(`Kalina's Statistics: `)
                                    .addField('Total Guilds: ', bot.guilds.cache.size)
                                    .addField('Total Channels: ', bot.channels.cache.size)
                                    .addField('Total Users: ', totalMembers)
                                    .addField('Most searched doll: ', `${dTop.doll} - ${dTop.count}`)
                                    .addField('Most searched doll timer:', `${tTop.timer} - ${tTop.count}`)
                                    .addField('Joined at:', message.guild.joinedAt);
                                
                                connection.release();
                                return message.channel.send(infoEmbed);
                            }
                        });
                    }
                });
            }
        });
    },
};