const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json")

module.exports = {
    name: "leave",
    description: "Destroys the player, and leaves the channel!",
    category: "Music",
    userPerms: [],
    botPerms: ['EMBED_LINKS'],
    guildOnly: true,
    dj: false,
    player: false,
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
        await player.destroy(interaction.guild.id);
        // if (player) { await player.destroy(interaction.guild.id); }
        // else { interaction.guild.me.voice.channel.leave() }

        return interaction.editReply({
            embeds: [new MessageEmbed()
                .setColor(Embed.ThemeColor)
                .setAuthor({ name: "Thank you for using my service!", iconURL: "https://cdn.discordapp.com/emojis/984848652969328660.gif?size=100&quality=lossless" })
                .setDescription(`I hope you enjoyed the time with me ${Emoji.Message.PINKHEART}\nI am still under development so, if you find any bugs feel free to ping my Master **InfernOZzz#0047**, Bbyee!`)
                .setTimestamp()
                .setFooter({ text: "</> By InfernOz#0047", iconURL: "https://cdn.discordapp.com/avatars/782274609030103111/a_f4124957d39e49ca32bfe6c886096f56.gif?size=4096" })]
        });
    },
};
