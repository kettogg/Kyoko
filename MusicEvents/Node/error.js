const { Log } = require("../../Utils/Logger");

module.exports = {
    name: "error",
    async execute(name, error, client) {
        Log(`Lavalink "${name}" Error ${error}`, "ERROR");
    }
};