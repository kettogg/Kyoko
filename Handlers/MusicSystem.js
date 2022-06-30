const chalk = require("chalk");

module.exports = async (client, globPromise, AsciiTable) => {
    // =========================< LOAD LAVALINK NODE EVENTS >========================= //
    let Table1 = new AsciiTable();
    Table1.setHeading("Lavalink Node Events", "Stats").setBorder('|', '=', '0', '0');
    (await globPromise(`${process.cwd()}/MusicEvents/Node/*.js`)).map((eventFile) => {
        const event = require(eventFile);
        if (!event.name) {
            const PathArray = eventFile.split("/");
            const len = PathArray.length;
            Table1.addRow(PathArray[len - 1], "⛔ Event Name Missing");
            return;
        }
        else {
            client.manager.shoukaku.on(event.name, (...args) => event.execute(...args, client));
        }
        Table1.addRow(event.name, '✅');
    });
    console.log(chalk.blueBright(Table1.toString()));

    // =======================< LOAD PLAYER MANAGER EVENTS > ======================= //
    let Table2 = new AsciiTable();
    Table2.setHeading("Player Events", "Stats").setBorder('|', '=', '0', '0');

    (await globPromise(`${process.cwd()}/MusicEvents/Player/*.js`)).map((eventFile) => {
        const event = require(eventFile);
        if (!event.name) {
            const PathArray = eventFile.split("/");
            const len = PathArray.length;
            Table2.addRow(PathArray[len - 1], "⛔ Event Name Missing")
        }
        else {
            client.manager.on(event.name, (...args) => event.execute(...args, client));
        }
        Table2.addRow(event.name, '✅');
    });
    console.log(chalk.blueBright(Table2.toString()));
}