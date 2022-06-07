//=====================================| Import the Module |=====================================//

const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectmenu, MessageAttachment, Interaction, Discord, InteractionCreate, Client, Collection } = require('discord.js');
// const clientSettingsObject = require(`${process.cwd()}/Functions/clientSettingsObject.js`);
const Settings = require(`${process.cwd()}/Settings/Settings.json`);
// const Config = require(`${process.cwd()}/Settings/Config.json`);
// const Emoji = require(`${process.cwd()}/Settings/Emojis.json`);
// const Embed = require(`${process.cwd()}/Settings/Embed.json`);
require("dotenv").config();
require("ms");

//=====================================| Creating Discord Client |=====================================//

const client = new Client({
    shards: 'auto',
    allowedMentions: {
        parse: ['roles', 'users', 'everyone'],
        repliedUser: false,
    },
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    intents: 32767,
})

//=====================================| DEPLOY SLASH COMMANDS |=====================================\\

client.deploySlash = {
    enabled: Settings.slashSettings.globalSlash,
    guild: Settings.slashSettings.guildSlashOnly
};

//=====================================| COLLECTIONS |=====================================//

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


//=====================================| HANDLERS |=====================================//

["Events", "Commands", "SlashCommands", Settings.antiCrash ? "AntiCrash" : null]
    .forEach(Handler => {
        require(`${process.cwd()}/Handlers/${Handler}`)(client, globPromise, AsciiTable);
    });

//=====================================| DATABASE |=====================================//

require(`${process.cwd()}/Database/Connect.js`);

//=====================================| CLIENT LOGIN |=====================================//

client.login(process.env.TOKEN);
