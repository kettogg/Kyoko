const { MessageEmbed, CommandInteraction, Client, Permissions } = require('discord.js');
const Emoji = require("../../Settings/Emojis.json");
const Embed = require("../../Settings/Embed.json");

module.exports = {
    name: "join",
    description: "Joins your Voice Channel!",
    category: "Music",
    userPerms: [],
    botPerms: ['EMBED_LINKS'],
    player: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */

    async execute(interaction, client) {
        await interaction.deferReply({
            ephemeral: false,
        });
        const { channel } = interaction.member.voice;
        const player = client.manager.players.get(interaction.guild.id);
        // console.log(player.voice)
        if (player) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor(Embed.ThemeColor)
                        .setDescription(`I'm already connected to ${player.voice} voice channel!`),
                ],
            });
        } else {
            // ============================< GUILD PERMS CHECK >============================ //
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
            // =============================< VC PERMS CHECK >============================= //
            if (!interaction.guild.me.permissionsIn(channel).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK]))
                return interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setDescription(
                                `I don't have enough permissions to join/connect your VC <#${interaction.member.voice.channel}>, Please give me \`CONNECT\` or \`SPEAK\` permission!`,
                            ),
                    ],
                });

            const emojiJoin = Emoji.Music.YIPEE;

            await client.manager.createPlayer({
                guildId: interaction.guild.id,
                voiceId: interaction.member.voice.channel.id,
                textId: interaction.channel.id,
                deaf: true,
            });

            let Msg = new MessageEmbed()
                .setColor(Embed.SuccessColor)
                .setTitle(`${emojiJoin} **Joined the voice channel**`)
                .setDescription(
                    `Joined <#${channel.id}> voice channel and bound to <#${interaction.channel.id}> text channel!`,
                );
            return interaction.editReply({ embeds: [Msg] });
        }
    },
};
