module.exports = {
	name: 'ping',
	aliases: [],
	description: 'Ping!',
	args: false,
	usage: '<no arguments taken>',
	async execute(message, args, pool, bot, prefix) {
		let m = await message.channel.send("Ping?");
		m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
	},
};