module.exports = {
    name: "error",
    async execute(client, name, error) {
        client.logger.log(`Lavalink "${name}" error ${error}`, "error");
    }
};