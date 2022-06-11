const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const DB = require("../../Schema/Setup");

// ============================< /setup => playerStart >============================ //

module.exports = {
    name: "playerCreate",
    async execute(client, player) {
        client.logger.log(`Player Created in Guild ID: ${player.guild}`, "log");

        let guild = client.guilds.cache.get(player.guild);
        if (!guild) return;
        const data = await DB.findOne({ Guild: guild.id });
        if (!data) return;

        let channel = guild.channels.cache.get(data.Channel);
        if (!channel) return;

        let message;
        try {

            message = await channel.messages.fetch(data.Message, { cache: true });
            console.log(message);

        } catch (err) { };

        if (!message) return;

        const Btn1 = new MessageButton().setCustomId(`${message.guildId}pause`).setEmoji(`⏸️`).setStyle('SECONDARY').setDisabled(false)
        const Btn2 = new MessageButton().setCustomId(`${message.guildId}previous`).setEmoji(`⏮️`).setStyle('SECONDARY').setDisabled(false)
        const Btn3 = new MessageButton().setCustomId(`${message.guildId}skip`).setEmoji(`⏭️`).setStyle('SECONDARY').setDisabled(false)
        const Btn4 = new MessageButton().setCustomId(`${message.guildId}voldown`).setEmoji(`🔉`).setStyle('SECONDARY').setDisabled(false)
        const Btn5 = new MessageButton().setCustomId(`${message.guildId}volup`).setEmoji(`🔊`).setStyle('SECONDARY').setDisabled(false)

        const row = new MessageActionRow().addComponents(Btn4, Btn2, Btn1, Btn3, Btn5)
        console.log(message);
        await message.edit({ content: "__**Join a voice channel and queue songs by name/url.**__\n\n", components: [row] }).catch(() => { });

    }
};