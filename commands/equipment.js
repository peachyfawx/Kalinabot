const Discord = require('discord.js');
const fs = require("fs");
const equipList = require('../equipment.json');
module.exports = {
    name: 'equipment',
    aliases: ['equip', 'e'],
    description: 'Look up info on a piece of equipment',
    args: true, //change to true if command requires arguments
    usage: '<equipment name> or <equipment build timer>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        var nameA = new Array();
        var IDA = new Array();
        var rartiyA = new Array();
        var typeA = new Array();
        var imageA = new Array();
        var statA = new Array();

        var addString = "0:";
        var sHand1 = addString.concat(args[0]);

        for (i = 0; i < equipList.length; i++) {
            if (equipList[i].BUILDTIME.toUpperCase() === args[0].toUpperCase() || equipList[i].NAME.toUpperCase() === args.join(" ").toUpperCase() || equipList[i].BUILDTIME.toUpperCase() === sHand1) {
                nameA.push(equipList[i].NAME);
                IDA.push(equipList[i].ID);
                rartiyA.push(equipList[i].RARITY);
                typeA.push(equipList[i].TYPE);
                imageA.push(equipList[i].IMAGE);
                statA.push(equipList[i].STATS);
            }
        }
        if (!nameA[0]) return message.channel.send('Not found.');
        else {
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
                    .addField("Equipment Name:", nameA[x], true)
                    .addField("Rarity:", starVar, true)
                    .addField("Type:", typeA[x], true)
                    .addField("Stats:", statA[x], true)
                    .setThumbnail(imageA[x]);
                return message.channel.send(embed);
            }
        }
    },
};