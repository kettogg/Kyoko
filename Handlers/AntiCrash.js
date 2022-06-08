/*===================================< IMPORT MODULES >===================================*/
const { Client } = require("discord.js");
const chalk = require("chalk");

/*========================================| </> |========================================*/
/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {

    process.on('multipleResolves', (type, promise, reason) => {
        console.log(chalk.red(`[MULTIPLE RESOLVES] `));
        console.log(type, promise, reason)
        client.user.send("Something went Wrong, Please try again :(")
    })

    process.on('unhandledRejection', (reason, promise) => {
        console.log(chalk.red(`[UNHANDLED REJECTION] `));
        console.log(reason, promise)
        process.exit(1) //Comment this out later!!
        client.user.send("Something went Wrong, Please try again :(")
    })

    process.on('uncaughtException', (err, origin) => {
        console.log(chalk.red(`[UNCAUGHT EXCEPTION ] `));
        console.log(err, origin)
        client.user.send("Something went Wrong, Please try again :(")
    })

    process.on('uncaughtExceptionMonitor', (err, origin) => {
        console.log(chalk.red(`[UNCAUGHT EXCEPTION MONITOR] `));
        console.log(err, origin)
        client.user.send("Something went Wrong, Please try again :(")
    })

    process.on('warning', (warning) => {
        console.log(chalk.red(`[WARNING] `) + chalk.yellow(`${warning}`))
        client.user.send("Something went Wrong, Please try again :(")
    })

    // process.on('message', (message) => {
    //     console.log(`[MESSAGE] `.bold.red + `${message}`.yellow);
    // })
}