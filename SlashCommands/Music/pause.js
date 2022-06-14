const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json");

module.exports = {
    name: "pause",
    description: "Pauses the currently playing music",
    category: "Music",
    userPerms: [],
    botPerms: ['EMBED_LINKS'],
    guildOnly: true,
    dj: false,
    player: true,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: false, });

        const player = client.manager.players.get(interaction.guild.id);
        if (!player.current) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(Embed.WrongColor).setDescription("There is no music playing, add some songs in the queue using \`/play\` commmand!")] });
        }
        if (player.player.paused) {
            return interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor(Embed.WrongColor)
                    .setDescription(`${Emoji.Music.PAUSE} The player is already paused!`)]
            });
        }
        await player.setPaused(true);
        const song = player.current;

        let pauseMsgEmbed = new MessageEmbed()
            .setColor(Embed.SuccessColor)
            .setDescription(`${Emoji.Music.PAUSE} **Paused - [${song.title}](${song.uri})**`);
        return interaction.editReply({ embeds: [pauseMsgEmbed] });
    },
};
