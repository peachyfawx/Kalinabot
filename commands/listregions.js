const Discord = require('discord.js');
const fs = require("fs");
module.exports = {
    name: 'listregions',
    aliases: ['lisreg', 'lreg', 'listr', 'regions'],
    description: 'List which regions are available (mostly just for proper reminder schedules)',
    args: false, //change to true if command requires arguments
    usage: '<no arguments taken>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        let embed = new Discord.MessageEmbed()
            .setTitle(`Use the command ${prefix}setregion XX to adjust alert times to your region\nThese are the currently supported regions:`)
            .addField('EN', 'English Server')
            .addField('JP', 'Japanese Server');

        return message.channel.send(embed);
    },
};