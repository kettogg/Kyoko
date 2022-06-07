const { readdirSync, read } = require("fs");
const chalk = require("chalk");

//========================================| Code |=======================================//

module.exports = async (client, globPromise, AsciiTable) => {
    let Table = new AsciiTable().setHeading("Commands", "Stats").setBorder('|', '=', "0", "0");
    (await globPromise(`${process.cwd()}/MessageCommands/*/*.js`)).map(async (file) => {

        const command = require(file);

        if (!command.name)
            return Table.addRow(file.split("/")[file.split("/").length - 1], "⛔Name-> Missing")

        if (!command.description)
            return Table.addRow(command.name, "⛔Description-> Missing")

        client.commands.set(command.name, command)

        await Table.addRow(command.name, "✅")

    })
    console.log(chalk.blue(Table.toString()));

    // const commandFolders = readdirSync(`${process.cwd()}/MessageCommands`);
    // for (const folder of commandFolders) {
    //     const commandFiles = readdirSync(`${process.cwd()}/MessageCommands/${folder}/`).filter(File => File.endsWith('.js'));
    //     for (const File of commandFiles) {
    //         const command = require(`${process.cwd()}/MessageCommands/${folder}/${File}`);
    //         client.commands.set(command.name, command);
    //     }
    //     console.log(chalk.green(`[MESSAGE COMMANDS] `) + chalk.cyan(`[${commandFiles.length}] `) + chalk.yellow(`in `) + chalk.magenta(`${folder} `) + chalk.yellow(`was loaded Successfully!`));
    // };
}
