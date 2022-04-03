module.exports = {
    name: 'help',
    aliases: ['commands'],
    description: 'Provides a list of commands and how to use them, or provides help with a specific command',
    args: false, //change to true if command requires arguments
    usage: '<command name>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        const data = [];
        const { commands } = message.client;

        if (!args.length) {
            data.push('Here is a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can use ${prefix}help <command name> to get help with a specific command.`);

            return message.author.send(data, { split: true })
                .then(() => {
                    if (message.channel.type === 'dm') return;
                    message.reply('I have sent a list of my commands to you in a DM.');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                    message.reply(`I could not send you a DM, please be sure to enable them.`);
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) return message.channel.send(`I could not find that command.`);

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        message.channel.send(data, { split: true });
    },
};