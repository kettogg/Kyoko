//=================================< IMPORT MODULES >=================================//

const { MessageEmbed, InteractionCreate } = require('discord.js');
const { errorCmdLogs2 } = require(`${process.cwd()}/Functions/errorCmdLogs.js`);
const { onCoolDown2 } = require(`${process.cwd()}/Functions/onCoolDown.js`);
const { author, version } = require(`${process.cwd()}/package.json`);
const Settings = require(`${process.cwd()}/Settings/Settings.json`);
const Config = require(`${process.cwd()}/Settings/Config.json`);
const Emoji = require(`${process.cwd()}/Settings/Emojis.json`);
const Embed = require(`${process.cwd()}/Settings/Embed.json`);

//======================================| </> |======================================//

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {Client} client 
     * @param {InteractionCreate} interaction 
     */
    async execute(interaction, client) {

        try {
            //================================< Command Handling >================================//
            if (interaction.isCommand()) {
                const command = client.slashCommands.get(interaction.commandName);
                if (!command) return interaction.reply({
                    ephemeral: true,
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setDescription(`${Emoji.Message.ERROR} The command \`${interaction.commandName}\` doesn't exist!`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: client.user.displayAvatarURL() })
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

                // ==============================< Guild Only Check >============================== //
                if (command.guildOnly && interaction.channel.type === "DM") {
                    return interaction.reply({
                        content: "I can't execute that command inside DMs!",
                    });
                }

                // ==========< When we DM, we don't need to look for Guild Permissions! >========== //
                if (!command.guildOnly && interaction.channel.type === "DM") {
                    return command.execute(interaction, client, args, '/');
                }

                interaction.member = interaction.guild.members.cache.get(interaction.user.id) || await interaction.guild.members.fetch(interaction.user.id).catch(() => null);

                /*==============================< Other List Handler >==============================*/
                // ========================< MUSIC SYSTEM >======================== //
                const player = interaction.client.manager.players.get(interaction.guildId);
                if (command.player && !player) {
                    return await interaction.reply({
                        content: `There is no player for this guild.`,
                        ephemeral: true,
                    })
                        .catch(() => { });
                }

                // ====================< Developers Only Check >=================== //
                const Staff = Config.DEVELOPER.OWNER.concat(
                    Config.DEVELOPER.CO_OWNER
                );
                if (command.devOnly && !Staff.includes(interaction.user.id)) {
                    return interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.WrongColor)
                                .setTitle(`${Emoji.Message.ERROR} ${interaction.user.tag} Error!`)
                                .setDescription(`The command \`${interaction.commandName}\` is Developer Only command.\nPlease use /help to see all the commands that you can use ${Emoji.Message.GHOSTHEART}`)
                                .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: client.user.displayAvatarURL() })
                        ]
                    });
                }

                // ======================< NSFW Only Check >====================== //
                if (command.nsfwOnly && !interaction.channel.nsfw) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.WrongColor)
                                .setDescription(`${Emoji.Message.ERROR} This command can only be used in NSFW channels!`)
                                .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }

                // ===================< Bot's Permission Check >=================== //
                if (command.botPerms && !interaction.channel.permissionsFor(client.user).has(command.botPerms)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.WrongColor)
                                .setDescription(`${Emoji.Message.ERROR} I don't have the required permissions to use this command\n \`${command.botPerms.join(`, `)}\``)
                                .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }

                // ===================< User's Permission Check >=================== //
                if (command.userPerms && !interaction.member.permissions.has(command.userPerms)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.WrongColor)
                                .setDescription(`${Emoji.Message.ERROR} You don't have the required permissions to use this command\n \`${command.userPerms.join(`, `)}\``)
                                .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }
                // ========================< MUSIC SYSTEM >======================== //
                if (command.inVoiceChannel && !interaction.member.voice.channel) {
                    return await interaction
                        .reply({
                            content: `You must be in a voice channel!`,
                            ephemeral: true,
                        })
                        .catch(() => { });
                }
                if (command.sameVoiceChannel) {
                    if (interaction.guild.me.voice.channel) {
                        if (interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) {
                            return await interaction
                                .reply({
                                    content: `I'm already playing in <#${interaction.guild.me.voice}> voice channel, Trying to kidnap me?`,
                                    ephemeral: true,
                                })
                                .catch(() => { });
                        }
                    }
                }

                // =======================< Cooldown Check >======================= //
                if (command.cooldown && onCoolDown2(interaction, command)) {
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.WrongColor)
                                .setTitle(`${Emoji.Message.ERROR} You are on a cooldown for \`${command.cooldown}\` seconds!`)
                                .setDescription(`Please wait \`${onCoolDown2(interaction, command).toFixed(1)}s\`, Before using the \`${command.name}\` command again! ${Emoji.Message.GHOSTHEART}`)
                                .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp()
                        ]
                    })
                }

                // =======================< Start Command >======================= //
                try {
                    command.execute(interaction, client, args, '/');
                } catch (error) {
                    console.log(error);
                    return interaction.reply({
                        ephemeral: true,
                        embeds: [
                            new MessageEmbed()
                                .setColor(Embed.WrongColor)
                                .setDescription(`${Emoji.Message.ERROR} There was an error trying to execute that command!`)
                                .addField('Error', `\`\`\`${error}\`\`\``)
                                .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: client.user.displayAvatarURL() })
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