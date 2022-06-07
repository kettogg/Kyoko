//=====================================| Import the Module |=====================================\\

const { readdirSync, read } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();
// const chalk = require("chalk");
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ========================================| Code |======================================= //

module.exports = async (client) => {
    const slashCommandsArray = [];
    readdirSync(`${process.cwd()}/SlashCommands/`)
        .forEach((dir) => {
            readdirSync(`${process.cwd()}/SlashCommands/${dir}/`).filter((file) => file.endsWith('.js'))
                .forEach((file) => {
                    let pull = require(`${process.cwd()}/SlashCommands/${dir}/${file}`);
                    client.slashCommands.set(pull.name, pull);

                    slashCommandsArray.push(pull);
                });
            console.log(`[SLASH COMMANDS] ` + `[${slashCommandsArray.length}] ` + `in ` + `${dir} ` + `was loaded!`);
        });

    // const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    // (async () => {
    //     try {
    //         console.log('Started refreshing application (/) commands...');
    //         await rest.put(
    //             Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    //             { body: slashCommandsArray },
    //         );
    //         console.log('Successfully reloaded application (/) commands!');
    //     } catch (error) {
    //         console.error(error);
    //     }
    // })();

    client.on('ready', async () => {
        if (client.deploySlash.enabled) {
            if (client.deploySlash.guild) {
                client.guilds.cache.get(client.deploySlash.guild).commands.set(slashCommandsArray);
            } else {
                client.application.commands.set(slashCommandsArray);
            };
        };
    });
}