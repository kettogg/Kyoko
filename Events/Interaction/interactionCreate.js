//=====================================| Import the Module |=====================================\

const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu, MessageAttachment, InteractionCreate } = require('discord.js');
const { errorCmdLogs2 } = require(`${process.cwd()}/Functions/errorCmdLogs.js`);
const { onCoolDown2 } = require(`${process.cwd()}/Functions/onCoolDown.js`);
const { author, version } = require(`${process.cwd()}/package.json`);
const Settings = require(`${process.cwd()}/Settings/Settings.json`);
const Config = require(`${process.cwd()}/Settings/Config.json`);
const Emoji = require(`${process.cwd()}/Settings/Emojis.json`);
const Embed = require(`${process.cwd()}/Settings/Embed.json`);

//=====================================| Code |=====================================\

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Client} client 
     * @param {InteractionCreate} interaction 
     */
    async execute(interaction, client) {
        // console.log(client.slashCommands)
        // console.log("interaction.commandName")
        try {
            //=====================================| Command Handling |=====================================\\
            if (interaction.isCommand()) {
                const command = client.slashCommands.get(interaction.commandName);
                if (!command) return interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.wrongcolor)
                            .setDescription(`${Emoji.Message.ERROR} The command \`${interaction.commandName}\` doesn't exist!`)
                            .setFooter({ text: `${Embed.footertext} · v${version}`, iconURL: client.user.displayAvatarURL() })
                            .setTimestamp()
                    ]
                }).catch(() => null);

                const args = [];

                for (let option of interaction.options.data) {
                    if (option.type === 'SUB_COMMAND') {
                        if (option.name) args.push(option.name);
                        option.options?.forEach((x) => {
                            if (x.value) args.push(x.value);
                        });
                    } else if (option.value) args.push(option.value);
                }
                interaction.member = interaction.guild.members.cache.get(interaction.user.id) || await interaction.guild.members.fetch(interaction.user.id).catch(() => null);

                // ========================================| Other list Handler |======================================= \\

                // ====================< NSFW only Check >=================== \\
                if (command.nsfwOnly && !interaction.channel.nsfw) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.wrongcolor)
                                .setDescription(`${Emoji.Message.ERROR} This command can only be used in NSFW channels!`)
                                .setFooter({ text: `${Embed.footertext} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }
                // ====================< Guild only Check >=================== \\
                if (command.guildOnly && interaction.channel.type === "DM") {
                    return message.reply({
                        content: "I can't execute that command inside DMs!",
                    });
                }

                // ====================< When we DM, we don't need to look for Guild Permissions! >=================== \\
                if (!command.guildOnly && interaction.channel.type === "DM") {
                    return command.execute(interaction, args, client);
                }


                // ====================< Bots Permissions Check >=================== \\
                if (command.botPerms && !interaction.channel.permissionsFor(client.user).has(command.botPerms)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.wrongcolor)
                                .setDescription(`${Emoji.Message.ERROR} I don't have the required permissions to use this command\n \`${command.botPerms.join(`, `)}\``)
                                .setFooter({ text: `${Embed.footertext} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }

                // ====================< Members Permissions Check >=================== \\
                if (command.userPerms && !interaction.member.permissions.has(command.userPerms)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.wrongcolor)
                                .setDescription(`${Emoji.Message.ERROR} You don't have the required permissions to use this command\n \`${command.userPerms.join(`, `)}\``)
                                .setFooter({ text: `${Embed.footertext} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }

                // ====================< Cooldown Check >=================== \\
                if (command.cooldown && onCoolDown2(interaction, command)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.wrongcolor)
                                .setTitle(`${Emoji.Message.ERROR} You are on a cooldown for \`${command.cooldown}\` seconds!`)
                                .setDescription(`Please wait \`${onCoolDown2(interaction, command).toFixed(1)}s\`, Before using the \`${command.name}\` command again!`)
                                .setFooter({ text: `${Embed.footertext} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }

                // ====================< Start Command >=================== \\
                try {
                    command.execute(interaction, client);
                } catch (error) {
                    console.log(error);
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.wrongcolor)
                                .setDescription(`${Emoji.Message.ERROR} There was an error trying to execute that command!`)
                                .setDescription(`There was an error trying to execute that command.`)
                                .addField('Error', `\`\`\`${error}\`\`\``)
                                .setFooter({ text: `${Embed.footertext} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }
            }

        } catch (error) {
            errorCmdLogs2(error, interaction, client);
        }
    }
}