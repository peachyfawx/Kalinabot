const Discord = require('discord.js');
const fs = require("fs");
const dollList = require('../tdoll.json');
const sStats = require('../searchStats.json');
module.exports = {
    name: 't-doll',
    aliases: ['tdoll', 'doll', 'd'],
    description: 'Search for a T-Doll by name, ID or build time.',
    args: true, //change to true if command requires arguments
    usage: '<name> or <ID> or <build timer>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        pool.getConnection(function (err, connecton) {
            if (err) throw err;
            else {
                let found = false;
                let nameAuth = message.author.tag.replace(/['`"]+/g, '');
                connecton.query(`SELECT * FROM experience WHERE user = '${message.author.id}'`, function (error, results, fields) {
                    if (error) {
                        connecton.release();
                        throw error;
                    }
                    else {
                        if (results.length === 0) {
                            connecton.query(`INSERT INTO experience (user, exp, username) VALUES ('${message.author.id}', '1', '${nameAuth}')`, function (error, results, fields) {
                                if (error) {
                                    connecton.release();
                                    throw error;
                                }
                            });
                        }
                        else {
                            connecton.query(`UPDATE experience SET exp = '${results[0].exp + 1}' WHERE user = '${message.author.id}'`, (error) => {
                                if (error) {
                                    connecton.release();
                                    throw error;
                                }
                            });
                        }
                    }
                });
                for (i = 0; i < dollList.length; i++) {
                    dollList[i].NAME.forEach(name => { if (name.toUpperCase() === args.join(" ").toUpperCase()) found = true; });
                    if ((dollList[i].ID == args[0] && !args[1]) || found) {
                        connecton.query(`SELECT * FROM searchstats WHERE doll = '${dollList[i].NAME[0]}'`, function (error, results, fields) {
                            if (error) {
                                connecton.release();
                                throw error;
                            }
                            else {
                                if (results.length === 0) {
                                    connecton.query(`INSERT INTO searchstats (doll, count) VALUES ('${dollList[i].NAME[0]}', '1')`, (error) => {
                                        if (error) {
                                            connecton.release();
                                            throw error;
                                        }
                                    });
                                    console.log(`${dollList[i].NAME[0]} was added to the search statistic database.`);
                                }
                                else {
                                    connecton.query(`UPDATE searchstats SET count = '${results[0].count + 1}' WHERE doll = '${dollList[i].NAME[0]}'`, (error) => {
                                        if (error) {
                                            connecton.release();
                                            throw error;
                                        }
                                    });
                                }
                            }
                        });
                        let colorVar = "ffffff";
                        let starVar = ":star::star:";

                        if (dollList[i].RARITY === 3) {
                            colorVar = "6bdfce";
                            starVar = ":star::star::star:";
                        }
                        else if (dollList[i].RARITY === 4) {
                            colorVar = "d6e35a";
                            starVar = ":star::star::star::star:";
                        }
                        else if (dollList[i].RARITY === 5) {
                            colorVar = "ffb600";
                            starVar = ":star::star::star::star::star:";
                        }
                        else if (dollList[i].RARITY === 6) {
                            colorVar = "C040B0";
                            starVar = ":star::star::star::star::star::star:";
                        }

                        let embed = new Discord.MessageEmbed()
                            .setColor(colorVar)
                            .addField("Gun Name:", dollList[i].NAME[0], true)
                            .addField("T-Doll ID:", dollList[i].ID, true)
                            .addField("Rarity:", starVar, true)
                            .addField("Type:", dollList[i].TYPE, true)
                            .addField("Production Time:", dollList[i].BUILDTIME, true)
                            .addField("Tile Buffs:", dollList[i].TILE)
                            .addField("Skill (Level 1):", dollList[i].SKILL)
                            .addField("Skill Description:", dollList[i].DESC)
                            .addField("Skill Cooldown:", dollList[i].COOLDOWN)
                            .setImage(dollList[i].IMAGE);

                        connecton.release();
                        return message.channel.send(embed);
                    }
                }
                if (!found) {
                    connecton.release();
                    return message.channel.send("Not found, check for spelling and accidental extra spaces. Make sure you use the full doll name.");
                }
            }
        });
    },
};