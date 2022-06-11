/*====================================< IMPORT MODULES >====================================*/

const { Client, Collection } = require('discord.js');
const Manager = require("kazagumo");
const ShoukakuOptions = require("./Settings/ShoukakuOptions");
const Settings = require(`${process.cwd()}/Settings/Settings.json`);
const { readdirSync } = require("fs");
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

/*====================================< MUSIC CLIENT >====================================*/

client.logger = require("./Utils/Logger");
const NodeConfig = require("./Utils/Config");
client.manager;

const SpotifyCreds = {
    spotify: {
        clientId: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET
    },
    defaultSearchEngine: "youtube_music"
};
client.manager = new Manager(client, NodeConfig.nodes, ShoukakuOptions, SpotifyCreds);

// =========================< LOAD NODE MANAGER EVENTS >========================= //
readdirSync("./Events(MusicSys)/Node/").forEach(eventFile => {
    const event = require(`./Events(MusicSys)/Node/${eventFile}`);
    let eventName = eventFile.split(".")[0];
    client.logger.log(`Loading Lavalink Events ${eventName}`, "event");
    client.manager.shoukaku.on(event.name, (...args) => event.execute(client, ...args));
});
// =======================< LOAD PLAYER MANAGER EVENTS > ======================= //
readdirSync("./Events(MusicSys)/Player/").forEach(eventFile => {
    const event = require(`./Events(MusicSys)/Player/${eventFile}`);
    let eventName = eventFile.split(".")[0];
    client.logger.log(`Loading Player Events ${eventName}`, "event");
    client.manager.on(event.name, (...args) => event.execute(client, ...args));
});

/*=======================================< HANDLERS >=======================================*/

["Events", "Commands", "SlashCommands", Settings.antiCrash ? "AntiCrash" : null]
    .forEach(Handler => {
        require(`${process.cwd()}/Handlers/${Handler}`)(client, globPromise, AsciiTable);
    });

/*=======================================< DATABASE >=======================================*/

require(`${process.cwd()}/Database/Connect.js`);

/*=====================================< CLIENT LOGIN >=====================================*/

client.login(process.env.TOKEN);
