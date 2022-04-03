const Discord = require('discord.js');
const fs = require("fs");
const fairyList = require('../fairies.json');
module.exports = {
    name: 'fairy',
    aliases: ['f', 'fairie', 'fairies'],
    description: 'Look up info about a fairy via its name or build timer (XX:XX format)',
    args: true, //change to true if command requires arguments
    usage: '<fairy name> or <build timer>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        let found = false;
        for (i = 0; i < fairyList.length; i++) {
            let shorthand = fairyList[i].BUILDTIME.slice(1);
            let cSplit1 = fairyList[i].BUILDTIME.replace(':', '');
            let cSplit2 = shorthand.replace(':', '');
            nameSplit = fairyList[i].NAME.split(" ");
            shortName = nameSplit[0];
            if (fairyList[i].BUILDTIME === args[0] || fairyList[i].NAME.toUpperCase() === args.join(" ").toUpperCase() || args[0].toUpperCase() === shortName.toUpperCase() || args[0] === cSplit1 || args[0] === cSplit2 || shorthand === args[0]) {
                //Battle color hex: #DF6334
                //Strategy color hex: #7190E0
                found = true;
                let colorVar = "ffffff";
                if (fairyList[i].TYPE === "B") { colorVar = "DF6334" }
                else if (fairyList[i].TYPE === "S") { colorVar = "7190E0" }
                let embed = new Discord.MessageEmbed()
                    .setColor(colorVar)
                    .addField("Name:", fairyList[i].NAME, true)
                    .addField("Build Time:", fairyList[i].BUILDTIME, true)
                    .addField("Crit Bonus (Lv.1):", fairyList[i].CRITDAMAGE, true)
                    .addField("Damage Bonus (Lv.1):", fairyList[i].DAMAGE, true)
                    .addField("Accuracy Bonus (Lv.1):", fairyList[i].ACCURACY, true)
                    .addField("Evasion Bonus (Lv.1):", fairyList[i].EVASION, true)
                    .addField("Armor Bonus (Lv.1):", fairyList[i].ARMOR, true)
                    .addField("Skill:", fairyList[i].SKILL, true)
                    .addField("Description:", fairyList[i].DESC, true)
                    .setImage(fairyList[i].IMAGE);
                return message.channel.send(embed);
            }
        }
        if (found === false) { return message.channel.send("Not Found."); }
    },
};