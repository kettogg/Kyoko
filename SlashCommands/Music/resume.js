const { MessageEmbed, CommandInteraction, Client } = require('discord.js');
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json");

module.exports = {
    name: "resume",
    description: "Resumes the currently playing music",
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
        await interaction.deferReply({ ephemeral: false });
        const player = client.manager.players.get(interaction.guild.id);
        const song = player.current;

        if (!player.current) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(Embed.WrongColor).setDescription("There is no music playing, add some songs in the queue using \`/play\` commmand!")] });
        }

        if (!player.player.paused) {
            return interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor(Embed.WrongColor)
                    .setDescription(`${Emoji.Music.RESUME} The player is already resumed!`)]
            });
        }
        await player.setPaused(false);

        let resumeMsgEmbed = new MessageEmbed()
            .setDescription(`${Emoji.Music.RESUME} **Resumed - [${song.title}](${song.uri})**`)
            .setColor(Embed.SuccessColor);
        return interaction.editReply({ embeds: [resumeMsgEmbed] });
    },
};
