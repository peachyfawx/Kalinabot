const fs = require('fs');
const CronJob = require('cron').CronJob;
const mysql = require('mysql');
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const { token, sqlPass, sqlHost, sqlDB } = require('./settings.json');

//load command files from commands folder
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

//set up connection to the MySQL server to be used later
const pool = mysql.createPool({
    connectionLimit: 1000,
    host: sqlHost,
    user: sqlDB,
    password: sqlPass,
    database: sqlDB
});

//executes once when the bot is ready (right after the 'node .' console command)
bot.once('ready', function () {
    console.log(`Logged in as ${bot.user.tag}.`);
    //starts the EN reminder timers
    daily1hr.start();
    capsuleDay.start();
    dataDay.start();
    expDay.start();
    allDay.start();
    weekly1hr.start();
    batAvailable.start();
    bat30mWarn.start();
    batUnavailable.start();
    randActivity.start();

    //start the JP timers
    JPdaily1hr.start();
    JPcapsuleDay.start();
    JPdataDay.start();
    JPexpDay.start();
    JPallDay.start();
    JPweekly1hr.start();
    JPbatAvailable.start();
    JPbat30mWarn.start();
    JPbatUnavailable.start();

    /*

    //loop over each guild the bot is in
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        bot.guilds.cache.forEach(guild => {
            //look up the guild's ID in the database
            connection.query(`SELECT * FROM guilds WHERE guild = '${guild.id}'`, function (error, results, fields) {
                if (error) {
                    connection.release();
                    throw error;
                }
                //if it isn't there, it should be
                if (results.length === 0) {
                    //add it in to the database
                    connection.query(`INSERT INTO guilds (guild) VALUES ('${guild.id}')`, function (error, results, fields) {
                        if (error) {
                            connection.release();
                            throw error;
                        }
                    });
                    console.log(`Added a missing guild to database.`);
                }
            });
        });
        connection.release();
    });

    */

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        else {
            //check the database for any guilds that kicked kalina while she was offline
            connection.query(`SELECT * FROM guilds`, function (error, results, fields) {
                if (error) {
                    connection.release();
                    throw error;
                }
                //iterate over the database
                for (let i = 0; i < results.length; i++) {
                    //check the bot's list of guilds for the database entry
                    if (!bot.guilds.cache.get(results[i].guild)) {
                        //if not there, delete it from the database
                        connection.query(`DELETE FROM guilds WHERE guild = '${results[i].guild}'`, function (error, results, fields) {
                            if (error) {
                                connection.release();
                                throw error;
                            }
                            console.log(`${results[i].guild.name} gave poor Kalina the boot.`);
                            bot.channels.cache.get('706234956778831872').send(`${guild.name} gave poor Kalina the boot.`);
                        });
                    }
                }
            });

            //check for any deleted channels that were receiving reminders
            connection.query(`SELECT * FROM guilds WHERE reminder <> 'OFF'`, function (error, results, fields) {
                if (error) {
                    connection.release();
                    throw error;
                }
                //iterate over the database
                for (let i = 0; i < results.length; i++) {
                    if (!bot.channels.cache.get(results[i].reminder)) {
                        connection.query(`UPDATE guilds SET reminder = 'OFF' WHERE guild = '${results[i].guild}'`, function (error, results, fields) {
                            if (error) {
                                connection.release();
                                throw error;
                            }
                        });
                        console.log(`No reminder channel found for guild with ID: ${results[i].guild}, set to OFF`);
                    }
                }
            });

            //check for any deleted channels that were receiving battery reminders
            connection.query(`SELECT * FROM guilds WHERE battery <> 'OFF'`, function (error, results, fields) {
                if (error) {
                    connection.release();
                    throw error;
                }
                //iterate over the database
                for (let i = 0; i < results.length; i++) {
                    if (!bot.channels.cache.get(results[i].battery)) {
                        connection.query(`UPDATE guilds SET battery = 'OFF' WHERE guild = '${results[i].guild}'`, function (error, results, fields) {
                            if (error) {
                                connection.release();
                                throw error;
                            }
                        });
                        console.log(`No battery channel found for guild with ID: ${results[i].guild}, set to OFF`);
                    }
                }
            });

            //check for any deleted channels that were receiving announcements
            connection.query(`SELECT * FROM guilds WHERE announcement <> 'OFF'`, function (error, results, fields) {
                if (error) throw error;
                //iterate over the database
                for (let i = 0; i < results.length; i++) {
                    if (!bot.channels.cache.get(results[i].announcement)) {
                        connection.query(`UPDATE guilds SET announcement = 'OFF' WHERE guild = '${results[i].guild}'`, function (error, results, fields) {
                            if (error) {
                                connection.release();
                                throw error;
                            }
                        });
                        console.log(`No announcement channel found for guild with ID: ${results[i].guild}, set to OFF`);
                    }
                }
            });
            connection.release();
        }
    });
});

bot.on('warn', (e) => console.warn(e));
bot.on('error', (e) => console.error(e));
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

//executes when the bot joins a new guild
bot.on('guildCreate', guild => {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        //ask the database to look up the new guild's ID
        connection.query(`SELECT * FROM guilds WHERE guild = '${guild.id}'`, function (error, results, fields) {
            if (error) {
                connection.release();
                throw error;
            }
            //make sure the guild ID isn't already in there somehow
            if (results.length === 0) {
                //if it isn't, add it in
                connection.query(`INSERT INTO guilds (guild) VALUES ('${guild.id}')`, function (error, results, fields) {
                    if (error) {
                        connection.release();
                        throw error;
                    }
                });
            }
        });
        bot.channels.cache.get('706234956778831872').send(`${guild.name} has added Kalina to their server.`);
        connection.release();
    });

});

bot.on('guildDelete', guild => {
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        else {
            connection.query(`DELETE FROM guilds WHERE guild = '${guild.id}'`, function (error) {
                if (error) {
                    connection.release();
                    throw error;
                }
            });
            bot.user.setActivity(`Serving ${bot.guilds.cache.size} guilds.`);
            console.log(`${guild.name} gave poor Kalina the boot.`);
            bot.channels.cache.get('706234956778831872').send(`${guild.name} gave poor Kalina the boot.`);
            connection.release();
        }
    });

});

//executes any time a message is sent
bot.on('message', message => {
    //make sure the message sender isn't a bot and starts with our prefix
    if (message.channel.type === 'dm' || message.author.bot) return;
    pool.getConnection(function (err, connection) {
        if (err) throw err;
        else {
            connection.query(`SELECT * FROM guilds WHERE guild = '${message.guild.id}'`, function (error, results, fields) {
                if (error) {
                    connection.release();
                    throw error;
                }

                //if the guild is not in the database for some reason
                if (results.length === 0) {
                    connection.query(`INSERT INTO guilds (guild) VALUES ('${guild.id}')`, function (error, results, fields) {
                        if (error) {
                            connection.release();
                            throw error;
                        }
                        console.log(`Added guild to database. ID: ${guild.id}`);
                    });
                }
                //pull the guild's prefix from the database
                if (results.length === 1) prefix = results[0].gPrefix;
                if (!message.content.startsWith(prefix)) {
                    connection.release();
                    return;
                }
                //split up the command, first cut the prefix off the message then get the command name
                const args = message.content.slice(prefix.length).split(/ +/);
                const commandName = args.shift().toLowerCase();

                const command = (bot.commands.get(commandName) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName)));

                if (!command) return message.channel.send(`I could not find that command. (Tried ${commandName})`);


                if (command.args && !args.length) {
                    let reply = `This command requires some form of arguments.`;
                    if (command.usage) { reply += `\nThe proper usage is: ${prefix}${commandName} ${command.usage}` }
                    connection.release();
                    return message.channel.send(reply);
                }
                //attempt to run the command
                try {
                    command.execute(message, args, pool, bot, prefix);
                } catch (error) {
                    console.log(error);
                    message.channel.send(`An error occurred trying to execute that command.`);
                }
                connection.release();
            });
        }
    });
});

//cron timer reference
//('second(0-59) minute(0-59) hour(0-23) day(0-6)  month(0-11) weekday(0-6)')

//change the bot's activity hourly
var randActivity = new CronJob('0 0 0-23 * * *', function () { randomActivity(); });

//times are set for UTC-8, remember to adjust the host server time zome with 'sudo timedatectl set-timezone America/Los_Angeles'
//-----------------------------------[EN TIMERS]-----------------------------------------------//
var daily1hr = new CronJob('0 0 23 * * 0-5', function () { sendENReminders(embedDaily1HrWarn); });      //daily quests will reset in 1 hour
var capsuleDay = new CronJob('0 0 0 * * 1,4', function () { sendENReminders(embedCapsule); });          //dailies reset - capsule combat sim
var dataDay = new CronJob('0 0 0 * * 2,5', function () { sendENReminders(embedData); });                //dailies reset - data combat sim
var expDay = new CronJob('0 0 0 * * 3,6', function () { sendENReminders(embedExp); });                  //dailies reset - exp combat sim
var allDay = new CronJob('0 0 0 * * 0', function () { sendENReminders(embedAll) });                     //dailies reset - all combat sims active
var weekly1hr = new CronJob('0 0 23 * * 6', function () { sendENReminders(embedDailyWeekly1HrWarn) });  //daily and weekly quests will reset in 1 hour
var batAvailable = new CronJob('0 0 11,17,22 * * 0-6', function () { sendENBatteryReminders(embedAvailableBatteries) });    //batteries are now available
var bat30mWarn = new CronJob('0 30 0,13,19 * * 0-6', function () { sendENBatteryReminders(embed30mBatteryWarn) });          //you have 30 minutes to collect batteries
var batUnavailable = new CronJob('0 0 1,14,20 * * 0-6', function () { sendENBatteryReminders(embedBatteryUnavailable) });   //batteries are no longer available

//-----------------------------------[JP TIMERS]-----------------------------------------------//
var JPdaily1hr = new CronJob('0 0 6 * * 0-5', function () { sendJPReminders(embedDaily1HrWarn); });      //daily quests will reset in 1 hour
var JPcapsuleDay = new CronJob('0 0 7 * * 1,4', function () { sendJPReminders(embedCapsule); });          //dailies reset - capsule combat sim
var JPdataDay = new CronJob('0 0 7 * * 2,5', function () { sendJPReminders(embedData); });                //dailies reset - data combat sim
var JPexpDay = new CronJob('0 0 7 * * 3,6', function () { sendJPReminders(embedExp); });                  //dailies reset - exp combat sim
var JPallDay = new CronJob('0 0 7 * * 0', function () { sendJPReminders(embedAll) });                     //dailies reset - all combat sims active
var JPweekly1hr = new CronJob('0 0 6 * * 6', function () { sendJPReminders(embedDailyWeekly1HrWarn) });  //daily and weekly quests will reset in 1 hour
var JPbatAvailable = new CronJob('0 0 17,23 * * 0-6', function () { sendJPBatteryReminders(embedAvailableBatteries) });    //batteries are now available
var JPbat30mWarn = new CronJob('0 30 1,19 * * 0-6', function () { sendJPBatteryReminders(embed30mBatteryWarn) });          //you have 30 minutes to collect batteries
var JPbatUnavailable = new CronJob('0 0 2,20 * * 0-6', function () { sendJPBatteryReminders(embedBatteryUnavailable) });   //batteries are no longer available

bot.login(token);

//-----------------------------------[EMBEDS]-----------------------------------//
const embedDaily1HrWarn = new Discord.MessageEmbed()
    .setTitle(":exclamation: Commanders. Daily quests reset in 1 hour")
    .setColor("#ff0000");

const embedWeekly1DayWarn = new Discord.MessageEmbed()
    .setTitle(":exclamation: Commanders. Weekly quests reset in 24 hours")
    .setColor("#fffc5b");

const embedDailyWeekly1HrWarn = new Discord.MessageEmbed()
    .setTitle(":exclamation: Commanders. Daily and weekly quests reset in 1 hour")
    .setColor("#ff0000");

const embedAvailableBatteries = new Discord.MessageEmbed()
    .setTitle(":battery: Commanders. Batteries are now available to be collected from your dorms.")
    .setColor("#1abc30");

const embed30mBatteryWarn = new Discord.MessageEmbed()
    .setTitle(":battery: Commanders. You have 30 minutes to collect your batteries!")
    .setColor("#fcea2a");

const embedBatteryUnavailable = new Discord.MessageEmbed()
    .setTitle(":battery: Commanders. Batteries are no longer available for collection.")
    .setColor("#ff0000");

const embedCapsule = new Discord.MessageEmbed()
    .setTitle(":exclamation: Commanders. Daily quests have reset!",
        "Capsule Combat Sim is active today.")
    .setColor("#1abc30");

const embedData = new Discord.MessageEmbed()
    .setTitle(":exclamation: Commanders. Daily quests have reset!",
        "Data Combat Sim is active today.")
    .setColor("#1abc30");

const embedExp = new Discord.MessageEmbed()
    .setTitle(":exclamation: Commanders. Daily quests have reset!",
        "EXP Combat Sim is active today.")
    .setColor("#1abc30");

const embedAll = new Discord.MessageEmbed()
    .setTitle(":exclamation: Commanders. Daily and weekly quests have reset!",
        "All Combat Sims are active today.")
    .setColor("#1abc30");

//-----------------------------------[FUNCTIONS]-----------------------------------//
function sendENBatteryReminders(msg) {
    let successes = 0;
    let removals = 0;
    let today = new Date();

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        else {
            //find all EN guilds where batteries aren't disabled
            connection.query(`SELECT * FROM guilds WHERE battery <> 'OFF' AND region = 'EN'`, function (error, results, fields) {
                if (error) {
                    connection.release();
                    throw error;
                }
                else {
                    //iterate over each channel
                    for (let i = 0; i < results.length; i++) {
                        //if the channel doesn't exist, remove it from the database
                        if (!bot.channels.cache.get(results[i].battery)) {
                            connection.query(`UPDATE guilds SET battery = 'OFF' WHERE guild = '${results[i].guild}'`, function (error) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                            console.log(`no battery channel found for guild: ${results[i].guild}, set to OFF`);
                            removals++;
                        } else {
                            //send the reminder
                            bot.channels.cache.get(results[i].battery).send(msg);
                            successes++;
                        }
                    }
                    console.log(`\nSent reminders to ${successes} channels. ${removals} channels were removed from the DB.`);
                    console.log(`Completed sending of EN BATTERY reminders. Time: ${today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()}\n`);
                    connection.release();
                }
            });
        }
    });

}

function sendJPBatteryReminders(msg) {
    let successes = 0;
    let removals = 0;
    let today = new Date();

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        else {
            //find all EN guilds where batteries aren't disabled
            connection.query(`SELECT * FROM guilds WHERE battery <> 'OFF' AND region = 'JP'`, function (error, results, fields) {
                if (error) throw error;
                else {
                    //iterate over each channel
                    for (let i = 0; i < results.length; i++) {
                        //if the channel doesn't exist, remove it from the database
                        if (!bot.channels.cache.get(results[i].battery)) {
                            connection.query(`UPDATE guilds SET battery = 'OFF' WHERE guild = '${results[i].guild}'`, function (error) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                            console.log(`no battery channel found for guild: ${results[i].guild}, set to OFF`);
                            removals++;
                        } else {
                            //send the reminder
                            bot.channels.cache.get(results[i].battery).send(msg);
                            successes++;
                        }
                    }
                    console.log(`\nSent reminders to ${successes} channels. ${removals} channels were removed from the DB.`);
                    console.log(`Completed sending of JP BATTERY reminders. Time: ${today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()}\n`);
                    connection.release();
                }
            });
        }
    });
}

function sendENReminders(msg) {
    let successes = 0;
    let removals = 0;
    let today = new Date();

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        else {
            //find all EN guilds where batteries aren't disabled
            connection.query(`SELECT * FROM guilds WHERE reminder <> 'OFF' AND region = 'EN'`, function (error, results, fields) {
                if (error) {
                    connection.release();
                    throw error;
                }
                else {
                    //iterate over each channel
                    for (let i = 0; i < results.length; i++) {
                        //if the channel doesn't exist, remove it from the database
                        if (!bot.channels.cache.get(results[i].reminder)) {
                            connection.query(`UPDATE guilds SET reminder = 'OFF' WHERE guild = '${results[i].guild}'`, function (error) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                            console.log(`no reminder channel found for guild: ${results[i].guild}, set to OFF`);
                            removals++;
                        } else {
                            //send the reminder
                            bot.channels.cache.get(results[i].reminder).send(msg);
                            successes++;
                        }
                    }
                    console.log(`\nSent reminders to ${successes} channels. ${removals} channels were removed from the DB.`);
                    console.log(`Completed sending of EN NON-BATTERY reminders. Time: ${today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()}\n`);
                    connection.release();
                }
            });
        }
    });
}

function sendJPReminders(msg) {
    let successes = 0;
    let removals = 0;
    let today = new Date();

    pool.getConnection(function (err, connection) {
        if (err) throw err;
        else {
            //find all EN guilds where batteries aren't disabled
            connection.query(`SELECT * FROM guilds WHERE reminder <> 'OFF' AND region = 'JP'`, function (error, results, fields) {
                if (error) {
                    connection.release();
                    throw error;
                }
                else {
                    //iterate over each channel
                    for (let i = 0; i < results.length; i++) {
                        //if the channel doesn't exist, remove it from the database
                        if (!bot.channels.cache.get(results[i].reminder)) {
                            connection.query(`UPDATE guilds SET reminder = 'OFF' WHERE guild = '${results[i].guild}'`, function (error) {
                                if (error) {
                                    connection.release();
                                    throw error;
                                }
                            });
                            console.log(`no reminder channel found for guild: ${results[i].guild}, set to OFF`);
                            removals++;
                        } else {
                            //send the reminder
                            bot.channels.cache.get(results[i].reminder).send(msg);
                            successes++;
                        }
                    }
                    console.log(`\nSent reminders to ${successes} channels. ${removals} channels were removed from the DB.`);
                    console.log(`Completed sending of EN NON-BATTERY reminders. Time: ${today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()}\n`);
                    connection.release();
                }
            });
        }
    });
}

function getRandInt(max) { return Math.floor(Math.random() * Math.floor(max)); }

function randomActivity() {
    var mArray = [
        "Rolling the Gacha",
        "Pandering for Gems",
        "Bullying 416",
        "Feeding SPAS-12",
        "Poking G11",
        "Getting Drunk with M16",
        "Dragging 0-2",
        "Breaking up KSG and RFB",
        "Bulling Bosses with Contender",
        "Growing Bamboo",
        "Use !!help",
        "Forming Exodia",
        "Counting Gems with Negev",
        "Swimming with SPP-1",
        "IDW!!!!",
        "Playing with IDW",
        `Serving ${bot.guilds.cache.size} servers`,
        "Writing Up Combat Reports",
        "Tending to the Shop",
        "Wasting Resources",
        "Heavy Crafting for S.A.T.8",
        "Finding SOPMOD another arm",
        "Insert content here",
        "Shipping AEK and Alisa"
    ]
    let x = getRandInt(mArray.size);
    bot.user.setActivity(mArray[x]);
}