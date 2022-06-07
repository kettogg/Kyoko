//=====================================| Import the Module |=====================================//

const { ValidEvents } = require("../Validation/ValidEvents");
// const { readdirSync } = require("fs");
const chalk = require("chalk");

// ========================================| Code |======================================= //

module.exports = async (client, globPromise, AsciiTable) => {

    let Table = new AsciiTable();
    Table.setHeading("Events", "Stats").setBorder('|', '=', '0', '0');

    (await globPromise(`${process.cwd()}/Events/*/*.js`)).map(async (eventFile) => {

        const event = require(eventFile);
        if (!ValidEvents.includes(event.name) || !event.name) {
            const PathArray = eventFile.split("/");
            let len = PathArray.length;
            await Table.addRow(`${event.name || "Missing"}`, `⛔ Event Name Invalid/Missing-->${PathArray[len - 2] + `/` + PathArray[len - 1]}`);
            return;
        }
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client))
        } else {
            client.on(event.name, (...args) => event.execute(...args, client))
        }

        Table.addRow(event.name, '✅');
    })
    console.log(chalk.greenBright(Table.toString()));

    // const load_dir = (dir) => {
    //     const eventsFolders = readdirSync(`${process.cwd()}/Events/${dir}`).filter(x => x.endsWith('.js'));
    //     for (const File of eventsFolders) {
    //         const pull = require(`${process.cwd()}/Events/${dir}/${File}`);
    //         const eventName = File.split('.')[0];
    //         console.log(eventName);
    //         client.on(eventName, pull.bind(null, client));
    //     };
    //     console.log(`[EVENTS] ` + `[${eventsFolders.length}] ` + `in ` + `${dir} ` + `was loaded!`);
    // };
    // ['Client', 'Interaction', 'Message'].forEach(e => load_dir(e));
}
