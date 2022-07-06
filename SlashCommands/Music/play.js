const { CommandInteraction, Client, MessageEmbed, Permissions, GuildScheduledEventManager } = require('discord.js');
const { convertTime } = require('../../Utils/Convert');
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json")

module.exports = {
    name: 'play',
    description: 'Lets listen to some music with me!',
    category: "Music",
    userPerms: [],
    botPerms: ['EMBED_LINKS'],
    guildOnly: true,
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: 'query',
            description: 'The song/playlist you wanna play! (Name/URL)...',
            required: true,
            type: 'STRING',
        },
    ],

    /**
     * 
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async execute(interaction, client) {
        await interaction.deferReply({
            ephemeral: false,
        });
        if (!interaction.guild.me.permissions.has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK]))
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor(Embed.WrongColor)
                        .setDescription(
                            `I don't have enough permissions to execute this command, Please give me \`CONNECT\` or \`SPEAK\` permission to execute this command!`,
                        ),
                ],
            });
        const { channel } = interaction.member.voice;
        if (!interaction.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK]))
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor(Embed.WrongColor)
                        .setDescription(
                            `I don't have enough permissions to connect to your VC, Please give me \`CONNECT\` or \`SPEAK\` permission to execute this command!`,
                        ),
                ],
            });

        const emojiAddSong = Emoji.Music.MUSICNOTE_SINGLE;
        const emojiPlaylist = Emoji.Music.MUSICNOTE;
        let query = interaction.options.getString("query");

        const player = await client.manager.createPlayer({
            guildId: interaction.guildId,
            voiceId: interaction.member.voice.channelId,
            textId: interaction.channelId,
            deaf: true,
        });
        const result = await player.search(query, interaction.user);
        if (!result.tracks.length) return interaction.editReply({ content: "No result's found!" });
        const tracks = result.tracks;
        if (result.type === 'PLAYLIST') for (let track of tracks) player.addSong(track);
        else player.addSong(tracks[0]);
        if (!player.current) player.play();
        // console.log(result);
        return interaction.editReply(
            result.type === 'PLAYLIST'
                ? {
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.SuccessColor)
                            .setDescription(
                                `${emojiPlaylist}  Queued ${tracks.length} songs, from ${result.playlistName} playlist`,
                            ),
                    ],
                }
                : {
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.SuccessColor)
                            .setDescription(`${emojiAddSong}  Queued [${tracks[0].title}](${tracks[0].uri})`),
                    ],
                },
        );
    },
};
