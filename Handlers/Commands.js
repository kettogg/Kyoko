const { readdirSync, read } = require("fs");
const chalk = require("chalk");

//========================================| Code |=======================================//

module.exports = async (client) => {
    const commandFolders = readdirSync(`${process.cwd()}/MessageCommands`);
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`${process.cwd()}/MessageCommands/${folder}/`).filter(File => File.endsWith('.js'));
        for (const File of commandFiles) {
            const command = require(`${process.cwd()}/MessageCommands/${folder}/${File}`);
            client.commands.set(command.name, command);
        }
        console.log(chalk.green(`[MESSAGE COMMANDS] `) + chalk.cyan(`[${commandFiles.length}] `) + chalk.yellow(`in `) + chalk.magenta(`${folder} `) + chalk.yellow(`was loaded Successfully!`));
    };
}
