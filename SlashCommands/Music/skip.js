const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json")

module.exports = {
    name: "skip",
    description: "Skips to next song in the Queue!",
    guildOnly: true,
    player: true,
    dj: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String} color
     */

    async execute(interaction, client) {
        await interaction.deferReply({
            ephemeral: false,
        });
        const player = client.manager.players.get(interaction.guild.id);
        if (!player.current) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(Embed.WrongColor).setDescription("There is no music playing, add some songs in the queue using \`/play\` commmand!")] })
        }
        if (player.queue.length == 0) {
            return interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor(Embed.WrongColor)
                    .setDescription(`No more songs left in the queue to skip!`)]
            });
        }

        await player.player.stopTrack();

        let skipMsgEmbed = new MessageEmbed()
            .setDescription(`${Emoji.Music.SKIP} **Skipped - [${player.current.title}](${player.current.uri})**`)
            .setColor(Embed.SuccessColor);
        return interaction.editReply({ embeds: [skipMsgEmbed] });
    },
};