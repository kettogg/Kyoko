const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const { convertTime } = require('../../Utils/Convert');
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json")

module.exports = {
    name: "stop",
    description: "Stops the music, and clears the queue!",
    userPerms: [],
    botPerms: ['EMBED_LINKS'],
    guildOnly: true,
    player: true,
    dj: false,
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
        if (!player.current) {
            return interaction.editReply({ embeds: [new MessageEmbed().setColor(Embed.WrongColor).setDescription("There is no music playing, add some songs in the queue using \`/play\` commmand!")] });
        }
        player.queue.length = 0;
        player.data.delete("autoplay")
        player.repeat = 'off';
        player.stopped = true;
        await player.player.stopTrack();
        setTimeout(() => {
            let stopMsgEmbed = new MessageEmbed()
                .setColor(Embed.SuccessColor)
                .setAuthor({ iconURL: "https://cdn.discordapp.com/emojis/984848605473021992.gif?size=48&quality=lossless", name: "Stopped the music, and cleared the Queue" });
            interaction.editReply({ embeds: [stopMsgEmbed] });
        }, 500)
    },
};
