//=================================< IMPORT MODULES >=================================//
const { MessageEmbed } = require('discord.js');
const { errorCmdLogs1 } = require(`${process.cwd()}/Functions/errorCmdLogs.js`);
const { onCoolDown1 } = require(`${process.cwd()}/Functions/onCoolDown.js`);
const { author, version } = require(`${process.cwd()}/package.json`);
const Config = require(`${process.cwd()}/Settings/Config.json`);
const Emoji = require(`${process.cwd()}/Settings/Emojis.json`);
const Embed = require(`${process.cwd()}/Settings/Embed.json`);

const prefix = Config.SETTINGS.PREFIX;

//======================================| </> |======================================//

module.exports = {
    name: "messageCreate",

    async execute(message, client) {
        try {
            //================================< Command Handling >================================//
            if (!message.content.startsWith(prefix) || message.author.bot) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName)
                || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
                || client.commands.find(cmd => cmd.cooldowns && cmd.cooldowns.includes(commandName))
                || client.commands.find(cmd => cmd.category && cmd.category.includes(commandName))
                || client.commands.find(cmd => cmd.descriptions && cmd.descriptions.includes(commandName))
                || client.commands.find(cmd => cmd.usage && cmd.usage.includes(commandName))
                ;

            // ====================< If the command doesn't exist, return >==================== //
            if (!command) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setTitle(`${Emoji.Message.ERROR} ${message.author.username} You have entered an invalid command!`)
                            .setDescription(`The command \`${commandName}\` does not exist.\nPlease use \`${prefix}help\` to see all the commands ${Emoji.Message.GHOSTHEART}`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), 6000));
            }

            // ====================< Mention Prefix >=================== //
            if (message.content.startsWith(`<@${client.user.id}>`)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.SuccesColor)
                            .setTitle(`${Emoji.Message.SUCCESS} ${message.author.username} Heya!, I am here!`)
                            .setDescription(`You can use \`${prefix}help\` to see all the Message Commands. or, you can use \`/help\` to see all the Slash Commands ${Emoji.Message.GHOSTHEART}`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), 6000));
            }

            // ===============================< Other List Handler >=============================== //

            // ================< Developers Only Check >================ //
            const Staff = Config.DEVELOPER.OWNER.concat(
                Config.DEVELOPER.CO_OWNER
            );
            if (command.devOnly && !Staff.includes(message.author.id)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setTitle(`${Emoji.Message.ERROR} ${message.author.username} You have entered an invalid command!`)
                            .setDescription(`The command \`${commandName}\` does not exist.\nPlease use \`${prefix}help\` to see all the commands ${Emoji.Message.GHOSTHEART}`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), 6000));
            }

            // =========< Official/Private Guilds only Check >========= //
            const private = Config.SERVER_ID.OFFICIAL.Guild_ID_1.concat(
                Config.SERVER_ID.OFFICIAL.Guild_ID_2,
                Config.SERVER_ID.TEST.Guild_ID_1,
                Config.SERVER_ID.TEST.Guild_ID_2
            );
            if (command.guildOnly && !private.includes(message.guild.id)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setTitle(`${Emoji.Message.ERROR} ${message.author.username} You have entered an invalid command!`)
                            .setDescription(`The command \`${commandName}\` can only be used in the official server ${Emoji.Message.GHOSTHEART}`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), 6000));
            }

            // ===================< NSFW Only Check >=================== //
            if (command.nsfwOnly && !message.channel.nsfw) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setTitle(`${Emoji.Message.ERROR} ${message.author.username} This command only works in NSFW channels!`)
                            .setDescription(`Please go to the NSFW channel to use this command!`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), 6000));
            }

            // ================< Bot's Permission Check >================ //
            if (command.botPerms && !message.channel.permissionsFor(client.user).has(command.botPerms)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setTitle(`${Emoji.Message.ERROR} I do not have the required permissions to execute this command!`)
                            .setDescription(`I need the following permissions: \`${command.botPerms}\` ${Emoji.Message.GHOSTHEART}`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), 6000));
            }

            // ===============< User's Permissions Check >=============== //
            let userPerms = message.channel.permissionsFor(message.author);
            if (command.userPerms && !userPerms.has(command.userPerms)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setTitle(`${Emoji.Message.ERROR} ${message.author.username} You do not have the required permissions to execute this command!`)
                            .setDescription(`You need the following permissions: \`${command.userPerms}\` ${Emoji.Message.GHOSTHEART}`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), 6000));
            }

            // ====================< Cooldown Check >==================== //
            if (onCoolDown1(message, command)) {
                return message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setTitle(`${Emoji.Message.ERROR} ${message.author.username}, You are on a cooldown for \`${command.cooldown}\` seconds!`)
                            .setDescription(`Please wait \`${onCoolDown1(message, command).toFixed(1)}\` Before using the \`${command.name}\` command again! ${Emoji.Message.GHOSTHEART}`)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), onCoolDown1(message, command) * 1000));
            }

            // ====================< Start Command >==================== //
            try {
                command.execute(message, client, args, prefix);
            } catch (error) {
                console.error(error);
                message.reply({
                    embeds: [
                        new MessageEmbed()
                            .setColor(Embed.WrongColor)
                            .setTitle(`${Emoji.Message.ERROR} ${message.author.username} There was an error trying to execute that command!`)
                            .setDescription(`There was an error trying to execute that command ${Emoji.Message.GHOSTHEART}`)
                            .addField('Error', `\`\`\`${error}\`\`\``)
                            .setFooter({ text: `${Embed.FooterText} · v${version}`, iconURL: message.client.user.displayAvatarURL() })
                    ]
                }).then(m => setTimeout(() => m.delete(), 6000));
            }

            // =====================< Error Logs >===================== //
        } catch (error) {
            errorCmdLogs1(error, message, client);
        }
    }
}