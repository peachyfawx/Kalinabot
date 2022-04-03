module.exports = {
    name: 'reload',
    aliases: [],
    description: '[DEV ONLY]Reloads a command so I don\'t have to restart the bot to do it.',
    args: true, //change to true if command requires arguments
    usage: '<command>',
    execute(message, args, pool, bot, prefix) {
        //command code goes here
        if (!args.length) return message.channel.send(`You didn't give a command to reload, ${message.author}.`);
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}.`);

        delete require.cache[require.resolve(`./${command.name}.js`)];

        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }

        return message.channel.send(`Command \`${command.name}\` was reloaded successfully.`);
    },
};