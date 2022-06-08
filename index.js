/*====================================< IMPORT MODULES >====================================*/

const { Client, Collection } = require('discord.js');
const Settings = require(`${process.cwd()}/Settings/Settings.json`);
require("dotenv").config();
require("ms");

/*================================< CREATE DISCORD CLIENT >================================*/

const client = new Client({
    shards: 'auto',
    allowedMentions: {
        parse: ['roles', 'users', 'everyone'],
        repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: 32767,
})

/*================================< DEPLOY [GUILD/GLOBAL] >================================*/

client.deploySlash = {
    enabled: Settings.slashSettings.globalSlash,
    guild: Settings.slashSettings.guildSlashOnly
};

/*=====================================< COLLECTIONS >=====================================*/

client.slashCommands = new Collection();
client.categories = new Collection();
client.cooldowns = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.aliases = new Collection();
client.events = new Collection();

const { promisify } = require("util");
const { glob } = require("glob");
const globPromise = promisify(glob);
const AsciiTable = require("ascii-table");

/*=======================================< HANDLERS >=======================================*/

["Events", "Commands", "SlashCommands", Settings.antiCrash ? "AntiCrash" : null]
    .forEach(Handler => {
        require(`${process.cwd()}/Handlers/${Handler}`)(client, globPromise, AsciiTable);
    });

/*=======================================< DATABASE >=======================================*/

require(`${process.cwd()}/Database/Connect.js`);

/*=====================================< CLIENT LOGIN >=====================================*/

client.login(process.env.TOKEN);
