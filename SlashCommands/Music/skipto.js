const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json");

module.exports = {
    name: "skipto",
    description: "Jump over to any song in the queue",
    userPerms: [],
    botPerms: ['EMBED_LINKS'],
    guildOnly: true,
    player: true,
    dj: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    options: [
        {
            name: "track-number",
            description: "Track Number of the song in Queue you want to SkipTo..",
            required: true,
            type: "NUMBER",
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
        const number = interaction.options.getNumber("track-number");
        const player = client.manager.players.get(interaction.guildId);

        if (!player.current) {
            return await interaction.editReply({ embeds: [new MessageEmbed().setColor(Embed.WrongColor).setDescription('There is no music playing!')] });
        }

        const position = Number(number);

        if (!position || position < 0 || position > player.queue.size) {
            return await interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor(Embed.WrongColor)
                    .setDescription(`The track number out of bounds, Enter a valid track number!`)]
            });
        }
        if (number[0] == 1) player.player.stopTrack();
        player.queue.splice(0, position - 1);
        await player.player.stopTrack();

        let skipToMsg = new MessageEmbed()
            .setDescription(`${Emoji.Music.SKIP} Forwarded **${position}** Songs`)
            .setColor(Embed.SuccessColor);
        return await interaction.editReply({ embeds: [skipToMsg] });
    },
};

