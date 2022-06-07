const { Client, MessageEmbed, Message } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

module.exports = {
    name: "getavatar",
    description: "Displays the user's Avatar Image.",
    cooldown: 10,
    category: 'Info',
    guildOnly: true,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_APPLICATION_COMMAND', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    options: [
        {
            name: "member",
            description: "The member whose Avatar you want.",
            type: "USER",
            required: true
        }
    ],
    /**
     * 
     * @param {Client} client
     * @param {Message} message
     */
    async execute(interaction, client) {
        const { user } = interaction.options.get("member");
        await interaction.deferReply();
        axios.get(`https://discord.com/api/users/${user.id}`, { headers: { Authorization: `Bot ${process.env.TOKEN}` } })
            .then((res) => {
                const { avatar, accent_color } = res.data;
                if (avatar) {
                    const extension = avatar.startsWith("a_") ? ".gif" : ".png";
                    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${avatar}${extension}?size=4096`;
                    const avatarEmbed = new MessageEmbed()
                        .setTitle(`${user.tag}'s Avatar`)
                        .setImage(avatarUrl)
                        .setColor(accent_color || "#FFC0CB")
                        .setTimestamp()

                    interaction.followUp({ embeds: [avatarEmbed] })
                } else {
                    interaction.followUp({ embeds: [new MessageEmbed().setColor("#FFC0CB").setDescription(`**${user.tag}** doesnot have an Avatar`).setTimestamp()] });
                }
            })
            .catch((err) => {
                interaction.editReply({ embeds: [new MessageEmbed().setColor("DARK_RED").setDescription(`Something went wrong :(`).setTimestamp()] });
            })

    }
}