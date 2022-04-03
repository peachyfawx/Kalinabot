const Discord = require('discord.js');
const fs = require("fs");
const stats = require("../dollStats.json");
module.exports = {
    name: 'stats',
    aliases: ['stat', 's'],
    description: 'Look up the stats of a T-Doll',
    args: true, //change to true if command requires arguments
    usage: '<dollname>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        if (message.author.id === "98201428434104320") {
            for (i = 0; i < stats.length; i++) {
                let found = false;
                stats[i].NAME.forEach(name => {
                    if (name.toUpperCase() === args.join(" ").toUpperCase()) found = true;
                });
                if (found) {
                    let colorVar = "ffffff";
                    let starVar = ":star::star:";

                    if (stats[i].RARITY === 3) {
                        colorVar = "6bdfce";
                        starVar = ":star::star::star:";
                    }
                    else if (stats[i].RARITY === 4) {
                        colorVar = "d6e35a";
                        starVar = ":star::star::star::star:";
                    }
                    else if (stats[i].RARITY === 5) {
                        colorVar = "ffb600";
                        starVar = ":star::star::star::star::star:";
                    }
                    else if (stats[i].RARITY === 6) {
                        colorVar = "C040B0";
                        starVar = ":star::star::star::star::star::star:";
                    }

                    let embed = new Discord.MessageEmbed()
                        .setColor(colorVar)
                        .addField("Showing level 1, single link stats for:", stats[i].NAME[0])
                        .addField("Hit Points:", stats[i].HEALTH, true)
                        .addField("Ammo/turn:", stats[i].AMMO, true)
                        .addField("Rations/turn:", stats[i].RATION, true)

                        .addField("Damage:", stats[i].DAMAGE, true)
                        .addField("Evasion:", stats[i].EVASION, true)
                        .addField("Accuracy:", stats[i].ACCURACY, true)
                        .addField("Rate of Fire:", stats[i].ROF, true)

                        .addField("Move Speed:", stats[i].MOVESPEED, true)
                        .addField("Armor:", stats[i].ARMOR, true)
                        .addField("Crit Rate:", stats[i].CRITRATE, true)
                        .addField("Crit Damage:", stats[i].CRITDMG, true)
                        .addField("Armor Pen:", stats[i].ARMORPEN, true);

                    return message.channel.send(embed);
                }
            }
            return message.channel.send("Not found, check for spelling and accidental extra spaces. Make sure you use the full doll name.");
        }
        else return;
    },
};