const { Log } = require("../../Utils/Logger");

module.exports = {
    name: "close",
    async execute(name, code, reason, client) {
        Log(`Lavalink "${name}" Closed, Code ${code}, Reason ${reason || "No reason"}`, "ERROR");
    }
};