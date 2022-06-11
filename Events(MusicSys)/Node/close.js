module.exports = {
    name: "close",
    async execute(client, name, code, reason) {
        client.logger.log(`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || 'No reason'}`, "error");
    }
};