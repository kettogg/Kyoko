const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const { convertTime } = require("../../Utils/Convert");
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json");

// =========================< ANIMATE THE TRACK BAR >========================= //
function TrackBar(player) {
    let size = 30;
    let line = "-";
    let slider = `${Emoji.Music.MUSICNOTE_SINGLE}`;

    if (!player.current) return `${slider}${line.repeat(size - 1)}]`;
    let current = player.current.length !== 0 ? player.player.position : player.current.length;
    let total = player.current.length;
    let bar = current > total ? [line.repeat(size / 2 * 2), (current / total) * 100] : [line.repeat(Math.round(size / 2 * (current / total))).replace(/.$/, slider) + line.repeat(size - Math.round(size * (current / total)) + 1), current / total];

    if (!String(bar).includes(slider)) return `${slider}${line.repeat(size - 1)}`;
    return `${bar[0]}`;
}
// =================================| </> |================================= //
module.exports = {
    name: "nowplaying",
    description: "Shows the info about currently playing song!",
    userPerms: [],
    botPerms: ['EMBED_LINKS'],
    guildOnly: true,
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false, });
        const player = client.manager.players.get(interaction.guild.id);
        const track = player.current;
        if (!player.current) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(Embed.WrongColor).setDescription("There is no music playing, add some songs in the queue using \`/play\` commmand!")] });
        }
        let total = track.length;
        let current = player.player.position;

        let MsgEmbed = new MessageEmbed()
            .setAuthor({ name: `Now Playing`, iconURL: `https://cdn.discordapp.com/emojis/984495097339056168.gif?size=100&quality=lossless` })
            .setTitle(`Track Name - [ ${track.title} ]`)
            .setURL(`${track.uri}`)
            .addField("Author", `${track.author}`, true)
            .addField("Track Length", `${track.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)}`, true)
            .addField("Requested By", `${track.requester}`, true)
            .addField("Track Bar", `**< ${TrackBar(player)} >  |**  **<** ${convertTime(current)}/${convertTime(total)} **>**`, false)
            .setImage("https://media1.tenor.com/images/0accfe33701e75a4774231fd6970f697/tenor.gif?itemid=25929352")
            .setColor(Embed.ThemeColor)
            .setFooter({ text: `Requested By ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()
            .setThumbnail(`${track.thumbnail ? track.thumbnail : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`}`)
        return interaction.editReply({ embeds: [MsgEmbed] });
    },
};