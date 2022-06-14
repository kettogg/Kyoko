const { Message, MessageEmbed, Client, TextChannel, MessageButton, MessageActionRow } = require("discord.js");
const DB = require("../Schema/Setup");
const { convertTime } = require("./Convert");
const Embed = require("../Settings/Embed.json");
const Emoji = require("../Settings/Emojis.json");

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

        let Icon = `${track.thumbnail ? track.thumbnail : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`}`;

        let message;
        try {
            message = await channel.messages.fetch(msgId, { cache: true });
        } catch (error) { };

        if (!message) {
            let Embed1 = new MessageEmbed().setColor(Embed.ThemeColor).setDescription(`**[${track.title}](${track.uri})** - \`${track.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)}\``).setImage(Icon).setTimestamp().setFooter({ text: `Requested By ${player.current.requester.tag}`, iconURL: player.current.requester.displayAvatarURL({ dynamic: true }) });

            const Btn1 = new MessageButton().setCustomId(`${player.guild}pause`).setEmoji(`${Emoji.Music.PLAYPAUSE}`).setStyle('SECONDARY')
            const Btn2 = new MessageButton().setCustomId(`${player.guild}previous`).setEmoji(`${Emoji.Music.PREVSONG}`).setStyle('SECONDARY')
            const Btn3 = new MessageButton().setCustomId(`${player.guild}skip`).setEmoji(`${Emoji.Music.NEXTSONG}`).setStyle('SECONDARY')
            const Btn4 = new MessageButton().setCustomId(`${player.guild}voldown`).setEmoji(`${Emoji.Music.VOLUMEDOWN}`).setStyle('SECONDARY')
            const Btn5 = new MessageButton().setCustomId(`${player.guild}volup`).setEmoji(`${Emoji.Music.VOLUMEUP}`).setStyle('SECONDARY')

            const row = new MessageActionRow().addComponents(Btn4, Btn2, Btn1, Btn3, Btn5)

            const Msg = await channel.send({
                content: `**${Emoji.Music.MIKUCUTE} Join voice channel and start queuing songs by Name/URL using \`/play\` command!**\n`,
                embeds: [Embed1],
                components: [row]
            });
            return await DB.findOneAndUpdate({ Guild: channel.guildId }, { Message: Msg.id });
        } else {
            let Embed2 = new MessageEmbed().setColor(Embed.ThemeColor).setDescription(`[${track.title}](${track.uri}) - \`${track.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)}\``).setImage(Icon).setTimestamp().setFooter({ text: `Requested By ${player.current.requester.tag}`, iconURL: player.current.requester.displayAvatarURL({ dynamic: true }) });
            await message.edit({
                content: `**${Emoji.Music.MIKUCUTE} Join voice channel and start queuing songs by Name/URL using \`/play\` command!**\n`,
                embeds: [Embed2]
            });
        };
    } catch (error) {
        return console.error(error);
    }
};
/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {String} args 
 * @param {Client} client 
 */
async function buttonReply(interaction, args, color) {

    if (interaction.replied) {
        await interaction.editReply({ embeds: [new MessageEmbed().setColor(color).setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() }).setDescription(args)] })
    } else {
        await interaction.editReply({ embeds: [new MessageEmbed().setColor(color).setAuthor({ name: interaction.member.user.tag, iconURL: interaction.member.user.displayAvatarURL() }).setDescription(args)] })
    };

    setTimeout(async () => {
        if (interaction && !interaction.ephemeral) {
            await interaction.deleteReply().catch(() => { });
        };
    }, 4000);
};
async function OOPS(channel, args) {
    try {
        let Embed1 = new MessageEmbed().setColor(Embed.WrongColor).setDescription(`${args}`);
        const Msg = await channel.send({
            embeds: [Embed1]
        });

        setTimeout(async () => await Msg.delete().catch(() => { }), 12000);
    } catch (e) {
        return console.error(e)
    }
};
/**
 * 
 * @param {String} query 
 * @param {Player} player 
 * @param {Message} message 
 * @param {Client}  client
 */

async function playerHandler(query, player, message) {
    let Msg;
    const emojiAddSong = Emoji.Music.MUSICNOTE_SINGLE;
    const emojiPlaylist = Emoji.Music.MUSIC_QUEUE;
    let data = await DB.findOne({ Guild: message.guildId });
    let n = new MessageEmbed().setColor(Embed.ThemeColor);

    try {
        if (data) Msg = await message.channel.messages.fetch(data.Message, { cache: true });
    } catch (e) { };

    if (!message.guild.me.voice.channel || player.state !== "CONNECTED") player = await message.client.manager.createPlayer({
        guildId: message.guild.id,
        voiceId: message.member.voice.channel.id,
        textId: message.channel.id,
        deaf: true,
    });

    const result = await player.search(query, message.author);
    if (!result.tracks.length) return message.reply({ content: 'No result was found' });
    const tracks = result.tracks;
    if (result.type === 'PLAYLIST') for (let track of tracks) player.addSong(track);
    else player.addSong(tracks[0]);
    if (!player.current) player.play();
    return message.channel.send(
        result.type === 'PLAYLIST'
            ? {
                embeds: [
                    new MessageEmbed()
                        .setColor(message.client.embedColor)
                        .setDescription(
                            `${emojiPlaylist} Queued ${tracks.length} from ${result.playlistName}`,
                        ),
                ],
            }
            : {
                embeds: [
                    new MessageEmbed()
                        .setColor(message.client.embedColor)
                        .setDescription(`${emojiAddSong} Queued [${tracks[0].title}](${tracks[0].uri})`),
                ],
            },
    ).then((res) => setTimeout(async () => await res.delete().catch(() => { }), 5000)).catch(() => { });

};

module.exports = { trackStartEventHandler, buttonReply, OOPS, playerHandler }