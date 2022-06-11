const DB = require("../../Schema/autoReconnect");

module.exports = {
    name: "ready",
    async execute(client, name) {

        client.logger.log(`Lavalink "${name}" connected.`, "ready");

        //---------------------[RETRIVING DATA FROM DB]---------------------//

        client.logger.log("Auto Reconnect Collecting player 24/7 data", "log");
        const MainData = await DB.find()
        client.logger.log(`Auto Reconnect found ${MainData.length ? `${MainData.length} queue${MainData.length > 1 ? 's' : ''}. Resuming all auto reconnect queue` : '0 queue'}`, "ready");
        for (let data of MainData) {
            const index = MainData.indexOf(data);
            setTimeout(async () => {
                const channel = client.channels.cache.get(data.TextId)
                const voice = client.channels.cache.get(data.VoiceId)
                if (!channel || !voice) return data.delete()
                await client.manager.createPlayer({
                    guildId: data.Guild,
                    voiceId: data.VoiceId,
                    textId: data.TextId,
                    deaf: true,
                });
            }
            ), index * 5000
        }
    }
};