const nDolls = require(`../newdolls.json`);
const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: 'newdolls',
    aliases: [],
    description: 'Lists the new dolls added as per the latest update (assuming we have updated it)',
    args: false, //change to true if command requires arguments
    usage: '<no arguments taken>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        //IMPORTANT:
        var newGunCount = 5;
        message.channel.send("**__This T-Doll was added as of the September 3rd Patch__**");
        //UPDATE ^THIS^ WITH EACH NEW SET OF DOLLS ADDED
        for (var i = 0; i < newGunCount; i++) {
            let colorVar = "ffffff";
            let starVar = ":star::star:";

            if (nDolls[i].RARITY === 3) {
                colorVar = "6bdfce";
                starVar = ":star::star::star:";
            }
            else if (nDolls[i].RARITY === 4) {
                colorVar = "d6e35a";
                starVar = ":star::star::star::star:";
            }
            else if (nDolls[i].RARITY === 5) {
                colorVar = "ffb600";
                starVar = ":star::star::star::star::star:";
            }
            else if (nDolls[i].RARITY === 6) {
                colorVar = "C040B0";
                starVar = ":star::star::star::star::star::star:";
            }
            let embed = new Discord.MessageEmbed()
                .setColor(colorVar)
                .addField("Gun Name:", nDolls[i].NAME[0], true)
                .addField("Rarity:", starVar, true)
                .addField("Type:", nDolls[i].TYPE, true)
                .setImage(nDolls[i].IMAGE);
            message.channel.send(embed);
        }
    },
};