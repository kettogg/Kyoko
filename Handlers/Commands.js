/*====================================< IMPORT MODULES >====================================*/
const { readdirSync, read } = require("fs");
const chalk = require("chalk");

/*=========================================| </> |=========================================*/

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
}
