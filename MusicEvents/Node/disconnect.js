const { Log } = require("../../Utils/Logger");

module.exports = {
    name: "disconnect",
    async execute(name, players, moved, client) {
        if (moved) return;
        players.map(player => player.connection.disconnect())
        Log(`Lavalink Node "${name}"  Disconnected`, "WARN");
    }
};