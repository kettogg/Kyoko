const { Message, MessageEmbed, Client, TextChannel, MessageButton, MessageActionRow } = require("discord.js");
const DB = require("../Schema/Setup");
const { convertTime } = require("./Convert");

/**
 * 
 * @param {String} msgId
 * @param {TextChannel} channel 
 * @param {Player} player 
 * @param {import("erela.js").Track} track 
 * @param {Client} client
 */

async function trackStartEventHandler(msgId, channel, player, track, client) {
    try {

        let Icon = `${track.thumbnail ? track.thumbnail : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`}` || client.config.links.bg;

        let message;
        try {

            message = await channel.messages.fetch(msgId, { cache: true });

        } catch (error) { };


        if (!message) {

            let Embed1 = new MessageEmbed().setColor(client.embedColor).setDescription(`[${track.title}](${track.uri}) - \`[ ${track.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)} ]\``).setImage(Icon).setFooter({ text: `Requested by ${player.current.requester.tag}`, iconURL: player.current.requester.displayAvatarURL({ dynamic: true }) });

            const Btn1 = new MessageButton().setCustomId(`${player.guild}pause`).setEmoji(`⏸️`).setStyle('SECONDARY')
            const Btn2 = new MessageButton().setCustomId(`${player.guild}previous`).setEmoji(`⏮️`).setStyle('SECONDARY')
            const Btn3 = new MessageButton().setCustomId(`${player.guild}skip`).setEmoji(`⏭️`).setStyle('SECONDARY')
            const Btn4 = new MessageButton().setCustomId(`${player.guild}voldown`).setEmoji(`🔉`).setStyle('SECONDARY')
            const Btn5 = new MessageButton().setCustomId(`${player.guild}volup`).setEmoji(`🔊`).setStyle('SECONDARY')

            const row = new MessageActionRow().addComponents(Btn4, Btn2, Btn1, Btn3, Btn5)

            const Msg = await channel.send({
                content: "__**Join a voice channel and queue songs by name/url.**__\n\n",
                embeds: [Embed1],
                components: [row]
            });

            return await DB.findOneAndUpdate({ Guild: channel.guildId }, { Message: Msg.id });
        } else {

            let Embed2 = new MessageEmbed().setColor(message.client.embedColor).setDescription(`[${track.title}](${track.uri}) - \`[ ${track.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)} ]\``).setImage(Icon).setFooter({ text: `Requested by ${player.current.requester.tag}`, iconURL: player.current.requester.displayAvatarURL({ dynamic: true }) });

            await message.edit({
                content: "__**Join a voice channel and queue songs by name/url.**__\n",
                embeds: [Embed2]

            });
        };
    } catch (error) {
        return console.error(error);
    }
};

module.exports = { trackStartEventHandler }