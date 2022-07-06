/*================================< Import Modules >================================*/

const { MessageEmbed, MessageActionRow } = require('discord.js');
const { errorCmdLogs1 } = require(`${process.cwd()}/Functions/errorCmdLogs.js`);
const { author, version } = require(`${process.cwd()}/package.json`);
const Embed = require(`${process.cwd()}/Settings/Embed.json`);
const { Message } = require("../../Settings/Emojis.json");

/*=====================================| </> |=====================================*/

function getCommands(CommandsArray) {
    return CommandsArray.join("\n");
}

module.exports = {
    name: "help",
    aliases: ["assist", "aid"],
    cooldown: 10,
    category: "Info",
    devOnly: false,
    guildOnly: false,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    description: 'Show the bot\'s ping to the Discord API.',
    usage: "help",

    async execute(message, client, args, prefix) {
        try {
            const Msg = await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: `Help is Arriving, Please wait...`, iconURL: Embed.LoadingIcon1 })
                        .setColor(Embed.LightBlue)
                ]
            })
            setTimeout(() => {
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
                // console.log(message.author)
                const MsgEmbed = new MessageEmbed()
                    .setColor(Embed.ThemeColor)
                    .setAuthor({ name: `${message.author.tag}, Help has arrived!`, iconURL: message.author.displayAvatarURL() })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setDescription(`Hiya! Looks like you summoned me with **${prefix}help**, Here are all my commands! All of my commands are Slash Commands, I dont have any Message commands right now! Feel free to ping my Master if you find any bugs/issues ${Message.HEARTPINK}`)
                    .addFields(CatCommandList.map((Category) => {
                        return {
                            name: `${Category.CategoryName}`,
                            value: getCommands(Category.Commands),
                            inline: false
                        }
                    }))
                    .setFooter({ text: `</> By InfernOz#0047`, iconURL: Embed.AuthorIcon })
                    .setTimestamp()

                Msg.edit({ embeds: [MsgEmbed] });

            }, 2000);
        }
        catch (error) {
            console.log("Error ", error)
        }
    }
}

