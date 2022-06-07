//=====================================| Import the Module |=====================================\

const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, MessageAttachment, CommandInteraction } = require("discord.js");
const { errorCmdLogs2 } = require(`${process.cwd()}/Functions/errorCmdLogs.js`);
const { author, version } = require(`${process.cwd()}/package.json`);
const Settings = require(`${process.cwd()}/Settings/Settings.json`);
const Config = require(`${process.cwd()}/Settings/Config.json`);
const Emoji = require(`${process.cwd()}/Settings/Emojis.json`);
const Embed = require(`${process.cwd()}/Settings/Embed.json`);

//=====================================| Code |=====================================\
/**
 * 
 * @param {CommandInteraction} interaction
 */
module.exports = {
    name: 'ping',
    description: '🏓 Show the bot\'s Latency to the Discord API.',
    cooldown: 15,
    category: 'Info',
    guildOnly: true,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],

    async execute(interaction, client) {
        try {
            // Function Uptime
            let days = Math.floor(client.uptime / 86400000)
            let hours = Math.floor(client.uptime / 3600000) % 24
            let minutes = Math.floor(client.uptime / 60000) % 60
            let seconds = Math.floor(client.uptime / 1000) % 60

            // Latency Check
            let webLatency = new Date() - interaction.createdAt
            let apiLatency = client.ws.ping
            let totalLatency = webLatency + apiLatency

            await interaction.deferReply();
            return interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor("#FFC0CB")
                        .setTitle(`🏓  Pong!!`)
                        .setFields([
                            {
                                name: `Websocket Latency`,
                                value: `\`${webLatency}\`ms`,
                                inline: true
                            },
                            {
                                name: `API Latency`,
                                value: ` \`${apiLatency}\`ms`,
                                inline: true
                            },
                            {
                                name: `Uptime`,
                                value: `\`${days}Days\` : \`${hours}Hrs\` : \`${minutes}Mins\` : \`${seconds}Secs\``,
                                inline: true
                            }
                        ])
                        .setFooter({ iconURL: interaction.user.displayAvatarURL(), text: `Requested By ${interaction.user.tag}` })
                        .setTimestamp()
                ],
                ephemeral: true
            })

        } catch (error) {
            errorCmdLogs2(client, interaction, error);
        }
    },
};

