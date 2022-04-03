const Discord = require('discord.js');
const fs = require("fs");
const dollList = require('../tdoll.json');
const tStats = require('../timers.json');
module.exports = {
    name: 'timer',
    aliases: ['time', 't'],
    description: 'Look up a construction timer to see what dolls you might get from it. Use XX:XX or X:XX format',
    args: true, //change to true if command requires arguments
    usage: '<build timer, XX:XX or X:XX format>',
    execute(message, args, pool, bot, prefix) {
        pool.getConnection(function (err, connection) {
            if (err) throw err;
            else {
                //command code goes here
                var nameA = new Array();
                var IDA = new Array();
                var rartiyA = new Array();
                var typeA = new Array();
                var buildtimeA = new Array();
                var imageA = new Array();
                let nameAuth = message.author.tag.replace(/['`"]+/g, '');
                connection.query(`SELECT * FROM experience WHERE user = '${message.author.id}'`, function (error, results, fields) {
                    if (error) {
                        connection.release();
                        throw error;
                    }
                    else {
                        if (results.length === 0) {
                            connection.query(`INSERT INTO experience (user, exp, username) VALUES ('${message.author.id}', '1', '${nameAuth}')`, function (error, results, fields) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                        }
                        else {
                            connection.query(`UPDATE experience SET exp = '${results[0].exp + 1}' WHERE user = '${message.author.id}'`, function (error, results, fields) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                        }
                    }
                });

                for (i = 0; i < dollList.length; i++) {
                    let shorthand = dollList[i].BUILDTIME.slice(1);         //trims off the initial 0; 01:10 -> 1:10
                    let cSplit1 = dollList[i].BUILDTIME.replace(':', '');   //trims : from a XX:XX search; XX:XX -> XXXX
                    let cSplit2 = shorthand.replace(':', '');               //trims : from a X:XX search; X:XX -> XXX
                    if (dollList[i].BUILDTIME === args[0] || shorthand === args[0] || cSplit1 === args[0] || cSplit2 === args[0]) {
                        nameA.push(dollList[i].NAME[0]);
                        IDA.push(dollList[i].ID);
                        rartiyA.push(dollList[i].RARITY);
                        typeA.push(dollList[i].TYPE);
                        buildtimeA.push(dollList[i].BUILDTIME);
                        imageA.push(dollList[i].IMAGE);
                    }
                }

                if (nameA[0]) {
                    connection.query(`SELECT * FROM timerstats WHERE timer = '${buildtimeA[0]}'`, function (error, results, fields) {
                        if (error) {
                            connection.release();
                            throw error;
                        }
                        else {
                            if (results.length === 0) {
                                connection.query(`INSERT INTO timerstats (timer, count) VALUES ('${buildtimeA[0]}', '1')`, function (error, results, fields) {
                                    if (error) {
                                        connection.release();
                                        throw error;
                                    }
                                });
                                console.log(`the timer ${buildtimeA[0]} was added to the statistics database.`);
                            }
                            else if (results.length != 0) {
                                connection.query(`UPDATE timerstats SET count = '${results[0].count + 1}' WHERE timer = '${buildtimeA[0]}'`, function (error, results, fields) {
                                    if (error) {
                                        connection.release();
                                        throw error;
                                    }
                                });
                            }
                        }
                    });
                }

                if (!nameA[0]) return message.channel.send('Not found, make sure the time is entered as either `X:XX or XXX`');
                if (!nameA[1]) message.channel.send(`This is the doll that has a construction time of ${buildtimeA[0].slice(1)}:`);
                else message.channel.send(`These are the dolls that share a construction time of ${buildtimeA[0].slice(1)}:`);
                for (var x = 0; x < nameA.length; x++) {
                    let colorVar = "ffffff";
                    let starVar = ":star::star:";

                    if (rartiyA[x] === 3) {
                        colorVar = "6bdfce";
                        starVar = ":star::star::star:";
                    }
                    else if (rartiyA[x] === 4) {
                        colorVar = "d6e35a";
                        starVar = ":star::star::star::star:";
                    }
                    else if (rartiyA[x] === 5) {
                        colorVar = "ffb600";
                        starVar = ":star::star::star::star::star:";
                    }
                    let embed = new Discord.MessageEmbed()
                        .setColor(colorVar)
                        .addField("Gun Name:", nameA[x], true)
                        .addField("T-Doll ID:", IDA[x], true)
                        .addField("Rarity:", starVar, true)
                        .addField("Type:", typeA[x], true)
                        .setThumbnail(imageA[x]);

                    connection.release();
                    return message.channel.send(embed);
                }
            }
        });
    },
};