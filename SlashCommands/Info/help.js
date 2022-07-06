const { MessageEmbed, CommandInteraction, Client } = require("discord.js");
const Embed = require("../../Settings/Embed.json");
const { Message } = require("../../Settings/Emojis.json")
//=====================================| </> |=====================================//

function getCommands(CommandsArray) {
    return CommandsArray.join("\n");
}
/**
 * 
 * @param {Client} client
 * @param {CommandInteraction} interaction 
 */
module.exports = {
    name: "help",
    description: "Need Help? See all my commands!",
    cooldown: 10,
    category: 'Info',
    guildOnly: true,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],

    async execute(interaction, client) {
        await interaction.deferReply();

        const Categories = [...new Set(client.slashCommands.map((command) => command.category))];
        // console.log(Categories);

        // ============< GET CATEGORY, LIST OF COMMANDS >============ //
        const CatCommandList = Categories.map((Category) => {
            const CommandList = client.slashCommands
                .filter((command) => command.category === Category)
                .map((command) => {
                    return `▸**/${command.name}** | ${command.description}`
                });
            return {
                CategoryName: Category,
                Commands: CommandList
            }
        });
        // console.log(CatCommandList);

        const MsgEmbed = new MessageEmbed()
            .setColor(Embed.ThemeColor)
            .setAuthor({ name: `${interaction.user.tag}, Help has arrived!`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`Hiya! Looks like you summoned me with **/help**, Here are all my commands! Feel free to ping my Master if you find any bugs/issues ${Message.HEARTPINK}`)
            .addFields(CatCommandList.map((Category) => {
                return {
                    name: `${Category.CategoryName}`,
                    value: getCommands(Category.Commands),
                    inline: false
                }
            }))
            .setFooter({ text: `</> By InfernOz#0047`, iconURL: Embed.AuthorIcon })
            .setTimestamp()

        interaction.editReply({ embeds: [MsgEmbed] });
    }
}