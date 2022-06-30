/*====================================< IMPORT MODULES >====================================*/

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
require("dotenv").config();
const chalk = require("chalk");
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

/*=========================================| </> |=========================================*/

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
    console.log(chalk.magenta(Table.toString()));

    /*==============================< DEPLOYING (/) COMMANDS >==============================*/

    client.on("ready", async () => {
        if (client.deploySlash.enabled) {
            if (client.deploySlash.guild) {
                console.log(chalk.yellowBright('Started refreshing application (/) commands...'));
                client.guilds.cache.get(client.deploySlash.guild).commands.set(slashCommandsArray);
                console.log(chalk.greenBright('[GUILD] ') + chalk.yellowBright('Slash Commands (/) Registered!!'))
            } else {
                console.log(chalk.yellowBright('Started refreshing application (/) commands...'));
                client.application.commands.set(slashCommandsArray);
                console.log(chalk.greenBright('[GLOBAL] ') + chalk.yellowBright('Slash Commands (/) Registered!!'))
            };
        };
    });
}