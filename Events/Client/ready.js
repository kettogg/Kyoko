//=================================< IMPORT MODULES >=================================//

const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, MessageAttachment } = require('discord.js');
const { author, version } = require(`${process.cwd()}/package.json`);
const Config = require(`${process.cwd()}/Settings/Config.json`);
const Discord = require('discord.js');
require('dotenv').config();
const chalk = require("chalk");
const { Log } = require("../../Utils/Logger");

//======================================| </> |======================================//

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.table({
            'Name': client.user.tag,
            'Author': `${author}`,
            'Version': `v${version}`,
            'Status': `${client.user.presence.status}`,
            'Prefix': Config.SETTINGS.PREFIX,
            'Discord.js': `v${Discord.version}`,
            'Node.js': `${process.version}`,
            'Guilds': client.guilds.cache.size,
            'Users': client.users.cache.size,
            'Channels': client.channels.cache.size,
            'Message Commands': client.commands.size,
            'Slash Commands': client.slashCommands.size,
            'Memory Usage': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            'CPU Usage': `${(process.cpuUsage().system / 1024 / 1024).toFixed(2)}%`,
            'Platform': process.platform,
            'Arch': process.arch,
        });

        console.log(chalk.greenBright(`[READY]`) + chalk.cyan(` Successfully Logged in as ${client.user.tag}!`));

        //======================< Activity >======================//
        setInterval(async () => {
            // Animated Status Presence
            const Activities = [
                `${Config.SETTINGS.PREFIX}help | /help`,
                `Roses are red, silent as a mouse, your door is unlocked, I'm inside your house Booo!!`,
                `I was born at a very young age`,
                `I deserve a medal every day I do not stab someone with a fork`,
                `We are all time travelers moving at the speed of exactly 60 minutes per hour`,
                `If you are reading this, you have to use light mode for 5 minutes`,
                `You just do not know how lucky you are that I am terrified of prison`
            ];
            let Index = Math.floor(Math.random() * Activities.length)
            let Type = "LISTENING"
            if (Index !== 0) Type = "PLAYING"
            // PLAYING, STREAMING, LISTENING, WATCHING
            client.user.setActivity(Activities[Index], {
                type: Type
            });
        }, 30000);
    }
}