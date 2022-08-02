const { MessageEmbed } = require("discord.js");
const DB = require("../../../Database/Schema/Setup");
const Embed = require("../../../Settings/Embed.json")

module.exports = {
    name: "playerEnd",
    async execute(player, client) {
        if (player.data.get("message") && !player.data.get("message").deleted) player.data.get("message").delete().catch(() => null);
        let guild = client.guilds.cache.get(player.guild);
        if (!guild) return;
        const data = await DB.findOne({ Guild: guild.id });
        if (!data) return;
        let channel = guild.channels.cache.get(data.Channel);
        if (!channel) return;

        let message;

        try {

            message = await channel.messages.fetch(data.Message, { cache: true });

        } catch (e) { };

        if (!message) return;
        await message.edit({ embeds: [new MessageEmbed().setColor(Embed.ThemeColor).setTitle(`Nothing playing right now in this server!`)] }).catch(() => { });
    }
}