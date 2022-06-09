/*===================================< IMPORT MODULES >===================================*/
const { Client } = require("discord.js");
const chalk = require("chalk");

/*========================================| </> |========================================*/
/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {

    process.on('unhandledRejection', (reason, promise) => {
        console.log(chalk.red(`[UNHANDLED REJECTION] `));
        console.log(reason, promise)
    })

    process.on('multipleResolves', (type, promise, reason) => {
        console.log(chalk.red(`[MULTIPLE RESOLVES] `));
        console.log(type, promise, reason)
    })

    process.on('uncaughtException', (err, origin) => {
        console.log(chalk.red(`[UNCAUGHT EXCEPTION] `));
        console.log(err, origin)
    })

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log(chalk.red(`[UNCAUGHT EXCEPTION MONITOR] `));
        console.log(err, origin)
    })

    process.on('warning', (warning) => {
        console.log(chalk.red(`[WARNING] `) + chalk.yellow(`${warning}`))
    })
}