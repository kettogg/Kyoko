module.exports = {
    name: "disconnect",
    async execute(client, name, players, moved) {
        if (moved) return;
        players.map(player => player.connection.disconnect())
        client.logger.log(`Lavalink ${name}: Disconnected`, "warn");
    }
};