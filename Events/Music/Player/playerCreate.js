const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const DB = require("../../../Database/Schema/Setup");
const Emoji = require("../../../Settings/Emojis.json");
const Embed = require("../../../Settings/Embed.json");
const { Log } = require("../../../Utils/Logger");

// ============================< /setup => playerStart >============================ //

module.exports = {
    name: "playerCreate",
    async execute(player, client) {
        Log(`Player Created in Guild ID "${player.guild}"`, "LOG");

        let guild = client.guilds.cache.get(player.guild);
        if (!guild) return;
        const data = await DB.findOne({ Guild: guild.id });
        if (!data) return;

        let channel = guild.channels.cache.get(data.Channel);
        if (!channel) return;

        let message;
        try {

            message = await channel.messages.fetch(data.Message, { cache: true });
            // console.log(message);

        } catch (err) { };

        if (!message) return;

        const Btn1 = new MessageButton().setCustomId(`${message.guildId}pause`).setEmoji(`${Emoji.Music.PLAYPAUSE}`).setStyle('SECONDARY').setDisabled(false)
        const Btn2 = new MessageButton().setCustomId(`${message.guildId}previous`).setEmoji(`${Emoji.Music.PREVSONG}`).setStyle('SECONDARY').setDisabled(false)
        const Btn3 = new MessageButton().setCustomId(`${message.guildId}skip`).setEmoji(`${Emoji.Music.NEXTSONG}`).setStyle('SECONDARY').setDisabled(false)
        const Btn4 = new MessageButton().setCustomId(`${message.guildId}volDown`).setEmoji(`${Emoji.Music.VOLUMEDOWN}`).setStyle('SECONDARY').setDisabled(false)
        const Btn5 = new MessageButton().setCustomId(`${message.guildId}volUp`).setEmoji(`${Emoji.Music.VOLUMEUP}`).setStyle('SECONDARY').setDisabled(false)

        const row = new MessageActionRow().addComponents(Btn4, Btn2, Btn1, Btn3, Btn5)
        // console.log(message);
        await message.edit({ embeds: [new MessageEmbed().setColor(Embed.ThemeColor).setDescription(`**Need Help? Summon me with \`/help\` command for help ;) Join a VC\nand, Start Queuing songs by using \`/play\` command!**`)], components: [row] }).catch(() => { });

    }
};