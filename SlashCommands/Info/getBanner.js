const { Client, MessageEmbed, Message } = require("discord.js");
const axios = require("axios");
require("dotenv").config();
const Embed = require("../../Settings/Embed.json");

/*==================================| </> |==================================*/

module.exports = {
    name: "getbanner",
    description: "Displays the user's banner, Lets steal it...",
    cooldown: 10,
    category: 'Info',
    guildOnly: true,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_APPLICATION_COMMAND', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    options: [
        {
            name: "member",
            description: "The member whose banner you want.",
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
                const { banner, accent_color } = res.data;
                if (banner) {
                    const extension = banner.startsWith("a_") ? ".gif" : ".png";
                    const bannerUrl = `https://cdn.discordapp.com/banners/${user.id}/${banner}${extension}?size=4096`;
                    // console.log(bannerUrl)
                    const bannerEmbed = new MessageEmbed()
                        .setTitle(`${user.tag}'s banner`)
                        .setImage(bannerUrl)
                        .setColor(accent_color || Embed.ThemeColor)
                        .setTimestamp()
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

                    interaction.followUp({ embeds: [bannerEmbed] })
                } else {
                    if (accent_color) {
                        const accentEmbed = new MessageEmbed()
                            .setDescription(`${user.tag} doesnot have a banner!,`)
                            .setColor(accent_color)
                            .setTimestamp()
                            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

                        interaction.followUp({ embeds: [accentEmbed] });
                    } else {
                        interaction.followUp({ embeds: [new MessageEmbed().setColor(Embed.ThemeColor).setDescription(`**${user.tag}** doesnot have a banner nor a accent color`).setTimestamp()] });
                    }
                }
            })
            .catch((err) => {
                interaction.followUp({ embeds: [new MessageEmbed().setColor(Embed.WrongColor).setDescription(`Something went wrong, Please Try again :(`).setTimestamp()] });
            })
    }
}