const Discord = require('discord.js');
const fs = require("fs");

var expTable = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500, 6600, 7800, 9100, 10500, 12000, 13600, 15300, 17100, 19000, 21000, 23100, 25300, 27600, 30000, 32500, 35100, 37900, 41000, 44400, 48600, 53200, 58200, 63600, 69400, 75700, 82400, 89600, 97300, 105500, 114300, 123600, 133500, 144000, 155100, 166900, 179400, 192500, 206400, 221000, 236400, 252500, 269400, 287100, 305700, 325200, 345600, 366900, 389200, 412500, 436800, 462100, 488400, 515800, 544300, 573900, 604700, 636700, 669900, 704300, 749400, 796200, 844800, 895200, 947400, 1001400, 1057300, 1115200, 1175000, 1236800, 1300700, 1366700, 1434800, 1505100, 1577700, 1652500, 1729600, 1809100, 1891000, 1975300, 2087900, 2204000, 2323500, 2446600, 2573300, 2703700, 2837800, 2975700, 3117500, 3263200];

module.exports = {
    name: 'experience',
    aliases: ['exp', 'xp'],
    description: 'Calculate the difference in exp between two given levels. First level must be lower than the second.',
    args: true, //change to true if command requires arguments
    usage: '<current level> <target level>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        if (!args[0] || !args[1] || args[2]) return message.channel.send("Usage: `!!exp (current level) (target level)`");
        var a = parseInt(args[0], 10); //current level
        var b = parseInt(args[1], 10); //target level
        if (isNaN(a) || isNaN(b)) return message.channel.send("Please use numbers with this command, i.e. 12 not 'twelve'");
        else if (a < 1) return message.channel.send("EN T-Dolls cannot be lower than level 1");
        else if (a > 100) return message.channel.send("EN T-Dolls cannot be greater than level 100");
        else if (b > 100) return message.channel.send("EN T-Dolls cannot surpass level 100");
        else if (b < a) return message.channel.send("Target level cannot be lower than current level");
        else {

            var experienceNeeded = (expTable[b - 1] - expTable[a - 1]);
            var levelDifference = b - a;
            var reportsNeeded = experienceNeeded / 3000;
            var CRString = reportsNeeded.toString();
            if (CRString.includes('.')) {
                CRString = CRString.substring(0, CRString.indexOf('.'));
                let tempInt = parseInt(CRString, 10);
                tempInt = tempInt + 1;
                CRString = tempInt.toString();
            }
            var embed = new Discord.MessageEmbed()
                .addField("Current Level:", `${a}`, true)
                .addField("Target Level:", `${b}`, true)
                .addField("Level difference:", `${levelDifference}`, true)
                .addField(`EXP needed for level ${b}:`, `${experienceNeeded}`, true)
                .addField("Combat Reports needed:", `${CRString}`, true);

            return message.channel.send(embed);
            //} else return;
        }
    },
};