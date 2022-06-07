//=====================================| Import the Module |=====================================\\
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, MessageAttachment } = require('discord.js');
const { errorCmdLogs1 } = require(`${process.cwd()}/Functions/errorCmdLogs.js`);
const { author, version } = require(`${process.cwd()}/package.json`);
// const Settings = require(`${process.cwd()}/Settings/settings.json`);
// const Config = require(`${process.cwd()}/Settings/config.json`);
// const Emoji = require(`${process.cwd()}/Settings/emojis.json`);
const Embed = require(`${process.cwd()}/Settings/Embed.json`);
// const os = require('os');
// require('ms');

//=====================================| Code |=====================================\\
/**
 * 
 * @param {MessageEmbed} 
 */
module.exports = {
    name: 'ping',
    aliases: ['ping', 'latency', 'pong'],
    cooldown: 15,
    category: 'Info',
    ownerOnly: false,
    guildOnly: false,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    description: 'Show the bot\'s ping to the Discord API.',
    usage: 'ping',

    async execute(message, client, args, prefix) {
        try {
            // First
            const Msg = await message.reply({
                embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: `Pinging... Please wait.`, iconURL: Embed.loadingIcon1 })
                        .setColor("#FFC0CB")
                ]
            })
            setTimeout(() => {
                // Function Uptime
                let days = Math.floor(client.uptime / 86400000)
                let hours = Math.floor(client.uptime / 3600000) % 24
                let minutes = Math.floor(client.uptime / 60000) % 60
                let seconds = Math.floor(client.uptime / 1000) % 60

                // Latency Check
                let webLatency = new Date() - message.createdAt
                let apiLatency = client.ws.ping
                let totalLatency = webLatency + apiLatency

                // Second
                Msg.edit({
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
                                    value: `\`${apiLatency}\`ms`,
                                    inline: true
                                },
                                {
                                    name: `Uptime`,
                                    value: `\`${days}Days\` : \`${hours}Hrs\` : \`${minutes}Mins\` : \`${seconds}Secs\``,
                                    inline: true
                                }
                            ])
                            .setFooter({ iconURL: message.author.displayAvatarURL(), text: `Requested By ${message.author.tag}` })
                            .setTimestamp()
                        // .setFooter(`${Embed.footertext} · v${version}`, message.client.user.displayAvatarURL())
                    ]
                })
            }, 1500)

        } catch (error) {
            errorCmdLogs1(client, message, error);
        }
    }
}
