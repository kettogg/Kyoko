const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const got = require("got");
//=====================================| Code |=====================================//

module.exports = {
    name: "meme",
    description: "Get's a meme from reddit",
    cooldown: 10,
    category: 'Fun',
    guildOnly: true,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_APPLICATION_COMMAND', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    /**
    * 
    * @param {Client} client
    * @param {CommandInteraction} interaction 
    */
    async execute(interaction, client) {
        await interaction.deferReply();
        got("https://meme-api.herokuapp.com/gimme")
            .then((res) => {
                const data = JSON.parse(res.body);

                interaction.editReply({
                    embeds: [new MessageEmbed().setTitle(data.title)
                        .setURL(data.postLink)
                        .setColor("#FFC0CB")
                        .setDescription(`Author-> ${data.author}  |  Upvotes-> ${data.ups}`)
                        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()
                        .setImage(data.url)]
                });
            })
            .catch((err) => {
                interaction.editReply({ embeds: [new MessageEmbed().setColor("DARK_RED").setDescription(`Something went wrong, Please try again :(`)] });
            })
    }
}