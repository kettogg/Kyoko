const { MessageEmbed, Client, MessageButton, MessageActionRow } = require("discord.js");
const { convertTime } = require("../../Utils/Convert");
const { trackStartEventHandler } = require("../../Utils/Functions");
const DB = require("../../Schema/Setup");
const Emoji = require("../../Settings/Emojis.json")
const Embed = require("../../Settings/Embed.json");

// ============================< /play => playerStart >============================ //

module.exports = {
    name: "playerStart",
    /**
     * 
     * @param {Client} client 
     * @param {*} player 
     * @param {*} track 
     */
    async execute(client, player, track) {
        let guild = client.guilds.cache.get(player.guild);
        if (!guild) return;
        let channel = guild.channels.cache.get(player.text);
        if (!channel) return;
        let data = await DB.findOne({ Guild: guild.id });
        if (data && data.Channel) {
            let textChannel = guild.channels.cache.get(data.Channel);
            const id = data.Message;
            if (channel === textChannel) {
                return await trackStartEventHandler(id, textChannel, player, track, client);
            } else {
                await trackStartEventHandler(id, textChannel, player, track, client);
            };
        }
        const emojiPlay = Emoji.Music.PLAY;

        const Msg = new MessageEmbed()
            .setAuthor({ name: `Now Playing`, iconURL: `https://cdn.discordapp.com/emojis/984495097339056168.gif?size=100&quality=lossless` })
            .setTitle(`Track Name - [ ${track.title} ]`)
            .setURL(`${track.uri}`)
            .addField("Author", `${track.author}`, true)
            .addField("Track Length", `${track.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)}`, true)
            .setColor(Embed.ThemeColor)
            .setFooter({ text: `Requested By ${track.requester.tag}`, iconURL: track.requester.displayAvatarURL() })
            .setTimestamp()
            .setThumbnail(`${track.thumbnail ? track.thumbnail : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`}`)


        client.channels.cache.get(player.text)?.send({ embeds: [Msg] }).then(x => player.data.set("message", x));
        await player.data.set("autoplaySystem", player.current.identifier);
    }
};
