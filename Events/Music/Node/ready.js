const DB = require("../../../Database/Schema/AutoReconnect");
const { Log } = require("../../../Utils/Logger");

module.exports = {
    name: "ready",
    async execute(name, client) {

        Log(`Lavalink Node "${name}" Connected`, "READY");

        //---------------------[RETRIVING DATA FROM DB]---------------------//

        Log("Auto Reconnect Collecting player 24/7 data", "LOG");
        const MainData = await DB.find();
        Log(`Auto Reconnect found ${MainData.length ? `${MainData.length} Queue${MainData.length > 1 ? 's' : ''} - Resuming all auto reconnect Queue` : '"0" Queue'}`, "READY");
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