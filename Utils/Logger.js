const chalk = require("chalk");
const moment = require("moment");

/*================================< Logs Errors >================================*/

function Log(content, type = "LOG") {
    const Moment = `${moment().format("DD-MM-YYYY hh:mm:ss")}`;
    switch (type) {

        case "LOG": {
            return console.log(`|${chalk.magenta(Moment)}| ${chalk.black.bgBlue(` ${type} `)} ${chalk.blueBright(content)}`);
        }
        case "WARN": {
            return console.log(`|${chalk.magenta(Moment)}| ${chalk.black.bgYellow(` ${type} `)} ${chalk.yellowBright(content)}`);
        }
        case "ERROR": {
            return console.log(`|${chalk.magenta(Moment)}| ${chalk.black.bgRed(` ${type} `)} ${chalk.red(content)}`);
        }
        // case "DEBUG": {
        //     return console.log(`|${chalk.magenta(Moment)}| ${chalk.black.bgGreen(` ${type} `)} ${chalk.blue(content)}`);
        // }
        // case "CMD": {
        //     return console.log(`|${chalk.magenta(Moment)}| ${chalk.black.bgWhite(` ${type} `)} ${chalk.blue(content)}`);
        // }
        case "READY": {
            return console.log(`|${chalk.magenta(Moment)}| ${chalk.black.bgHex("#067032")(` ${type} `)} ${chalk.blueBright(content)}`);
        }
        default: throw new TypeError("Logger type must be either warn, debug, log, ready, cmd or error.");
    }
}

module.exports = { Log }
