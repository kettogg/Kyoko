//=====================================| Import the Module |=====================================\\

const { ValidPerms } = require("../Validation/ValidPermissions")
const { readdirSync, read } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require("dotenv").config();
const chalk = require("chalk");
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ========================================| Code |======================================= //

module.exports = async (client, globPromise, AsciiTable) => {
    let Table = new AsciiTable().setHeading("Slash Commands", "Stats").setBorder('|', '=', "0", "0");
    const slashCommandsArray = [];

    (await globPromise(`${process.cwd()}/SlashCommands/*/*.js`)).map(async (file) => {

        const slashCommand = require(file);

        if (!slashCommand.name)
            return Table.addRow(file.split("/")[file.split("/").length - 1], "⛔Name-> Missing")

        if (!slashCommand.context && !slashCommand.description)
            return Table.addRow(slashCommand.name, "⛔Description-> Missing")

        client.slashCommands.set(slashCommand.name, slashCommand)
        slashCommandsArray.push(slashCommand)
        await Table.addRow(slashCommand.name, "✅")

    })
    console.log(chalk.magentaBright(Table.toString()));

    // readdirSync(`${process.cwd()}/SlashCommands/`)
    //     .forEach((dir) => {
    //         readdirSync(`${process.cwd()}/SlashCommands/${dir}/`).filter((file) => file.endsWith('.js'))
    //             .forEach((file) => {
    //                 let slashObj = require(`${process.cwd()}/SlashCommands/${dir}/${file}`);
    //                 if(!slashObj.name) return Table.addRow()
    //                 client.slashCommands.set(slashObj.name, slashObj);

    //                 slashCommandsArray.push(slashObj);
    //             });
    //         console.log(`[SLASH COMMANDS] ` + `[${slashCommandsArray.length}] ` + `in ` + `${dir} ` + `was loaded!`);
    //     });

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
    // ========================================| Deploying Slash Commands |======================================= //
    client.on("ready", async () => {
        if (client.deploySlash.enabled) {
            if (client.deploySlash.guild) {
                console.log(chalk.yellowBright('Started refreshing application (/) commands...'));
                client.guilds.cache.get(client.deploySlash.guild).commands.set(slashCommandsArray);
                console.log(chalk.green('[GUILD] ') + chalk.yellow('Slash Commands (/) Registered!!'))
            } else {
                console.log(chalk.yellowBright('Started refreshing application (/) commands...'));
                client.application.commands.set(slashCommandsArray);
                console.log(chalk.green('[GLOBAL] ') + chalk.yellow('Slash Commands (/) Registered!!'))
            };
        };
    });
}