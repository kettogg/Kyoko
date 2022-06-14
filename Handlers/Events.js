/*====================================< IMPORT MODULES >====================================*/

const { ValidEvents } = require("../Validation/ValidEvents");
const chalk = require("chalk");

/*=========================================| </> |=========================================*/

module.exports = async (client, globPromise, AsciiTable) => {

    let Table = new AsciiTable();
    Table.setHeading("Events", "Stats").setBorder('|', '=', '0', '0');

    (await globPromise(`${process.cwd()}/Events/*/*.js`)).map(async (eventFile) => {

        const event = require(eventFile);
        // if (!ValidEvents.includes(event.name) || !event.name) {
        //     const PathArray = eventFile.split("/");
        //     let len = PathArray.length;
        //     await Table.addRow(`${event.name || "Missing"}`, `⛔ Event Name Invalid/Missing-->${PathArray[len - 2] + `/` + PathArray[len - 1]}`);
        //     return;
        // }
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client))
        } else {
            client.on(event.name, (...args) => event.execute(...args, client))
        }
        Table.addRow(event.name, '✅');

    })

    console.log(chalk.green(Table.toString()));
}
