const { Client, CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const { convertTime } = require('../../Utils/Convert');
const lodash = require("lodash");
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json")

module.exports = {
    name: "queue",
    description: "Display's the songs in the server queue...",
    userPerms: [],
    botPerms: ['EMBED_LINKS'],
    guildOnly: true,
    player: true,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     */
    async execute(interaction, client) {
        await interaction.deferReply().catch(() => { });
        const player = client.manager.players.get(interaction.guildId);
        // ============================< CHECKS >============================ //
        if (!player.queue)
            return await interaction.editReply({ content: `Nothing is playing right now, add some songs using \`/play\`!`, }).catch(() => { });

        if (player.queue.length === '0' || !player.queue.length) {
            await interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor(Embed.ThemeColor)
                    .setTitle(`${Emoji.Music.MUSIC_QUEUE} ${interaction.guild.name}'s Queue`)
                    .setDescription(
                        `**Now playing** \`[${player.current.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)
                        }]\` **[${player.current.title}](${player.current.uri})** - ${player.current.requester}`,
                    )
                    .setFooter({ text: `No songs further`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()]

            });
        } else {
            // ==================< MAPPING TRACK WITH INDEX >================== //
            const mapping = player.queue.map(
                (track, i) =>
                    `\`${++i})\` \`[${track.isStream ? '[**◉ LIVE**]' : convertTime(track.length)}]\` **[${track.title}](${track.uri})** - ${track.requester}`,
            );
            // =========< Divide Mapping in Chunks of 10 & Paginate >========= //
            const chunk = lodash.chunk(mapping, 10);
            const pages = chunk.map((s) => s.join('\n'));
            let page = 0;

            if (player.queue.length <= 10) {
                await interaction.editReply({
                    embeds: [new MessageEmbed()
                        .setColor(Embed.ThemeColor)
                        .setTitle(`${Emoji.Music.MUSIC_QUEUE} ${interaction.guild.name}'s Queue`)
                        .setDescription(
                            `${Emoji.Music.MUSIC_CD} **Now playing**\n\`[${player.current.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)
                            }]\` **[${player.current.title}](${player.current.uri})** - ${player.current.requester}\n\n${Emoji.Music.COMINGNEXT} **Coming Next**\n${pages[page]}`)
                        .setFooter({
                            text: `Page ${page + 1}/${pages.length}`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                        })
                        .setThumbnail(
                            `${player.current.thumbnail
                                ? player.current.thumbnail
                                : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`
                            }`,
                        )
                        .setTimestamp()],
                })
                    .catch(() => { });
            } else {
                const MsgEmbed = new MessageEmbed()
                    .setColor(Embed.ThemeColor)
                    .setTitle(`${Emoji.Music.MUSIC_QUEUE} ${interaction.guild.name}'s Queue`)
                    .setDescription(
                        `${Emoji.Music.MUSIC_CD} **Now playing**\n\`[${player.current.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)
                        }]\` **[${player.current.title}](${player.current.uri})** - ${player.current.requester}\n\n${Emoji.Music.COMINGNEXT} **Coming Next**\n${pages[page]}`)
                    .setFooter({
                        text: `Page ${page + 1}/${pages.length}`,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setThumbnail(
                        `${player.current.thumbnail
                            ? player.current.thumbnail
                            : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`
                        }`,
                    )
                    .setTimestamp()

                const nextBtn = new MessageButton()
                    .setCustomId("queue_nextBtn")
                    .setLabel("Next Page")
                    .setEmoji(Emoji.Music.NEXTPAGE)
                    .setStyle("SECONDARY");

                const disabledNextBtn = new MessageButton()
                    .setDisabled(true)
                    .setCustomId("queue_nextBtn_disabled")
                    .setLabel("Next Page")
                    .setEmoji(Emoji.Music.NEXTPAGE)
                    .setStyle("SECONDARY");

                const prevBtn = new MessageButton()
                    .setCustomId("queue_prevBtn")
                    .setLabel("Prev Page")
                    .setEmoji(Emoji.Music.PREVPAGE)
                    .setStyle("SECONDARY");

                const disabledPrevBtn = new MessageButton()
                    .setDisabled(true)
                    .setCustomId("queue_prevBtn_disabled")
                    .setLabel("Prev Page")
                    .setEmoji(Emoji.Music.PREVPAGE)
                    .setStyle("SECONDARY");

                const closeBtn = new MessageButton()
                    .setCustomId("queue_closeBtn")
                    .setLabel("Close Page")
                    .setEmoji(Emoji.Music.CLOSEPAGE)
                    .setStyle("SECONDARY");

                const disabledCloseBtn = new MessageButton()
                    .setDisabled(true)
                    .setCustomId("queue_closeBtn_disabled")
                    .setLabel("Close Page")
                    .setEmoji(Emoji.Music.CLOSEPAGE)
                    .setStyle("SECONDARY");

                await interaction
                    .editReply({
                        embeds: [MsgEmbed],
                        components: [new MessageActionRow().addComponents([prevBtn, closeBtn, nextBtn])],
                    })
                    .catch(() => { });

                const collector = interaction.channel.createMessageComponentCollector({
                    filter: (Btn) => {
                        if (Btn.user.id === interaction.user.id) return true;
                        else
                            return Btn
                                .reply({
                                    content: `Only **${interaction.user.tag}** can use this button, use \`/queue\` to get the queue and use the buttons!`,
                                })
                                .catch(() => { });
                    },
                    time: 1000 * 60 * 5,
                    idle: 45e3,
                });

                collector.on('collect', async (button) => {
                    if (button.customId === 'queue_nextBtn') {
                        await button.deferUpdate().catch(() => { });
                        page = page + 1 < pages.length ? ++page : 0;

                        const nextPageEmbed = new MessageEmbed()
                            .setColor(Embed.ThemeColor)
                            .setTitle(`${Emoji.Music.MUSIC_QUEUE} ${interaction.guild.name}'s Queue`)
                            .setDescription(
                                `${Emoji.Music.MUSIC_CD} **Now playing**\n\`[${player.current.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)
                                }]\` **[${player.current.title}](${player.current.uri})** - ${player.current.requester}\n\n${Emoji.Music.COMINGNEXT} **Coming Next**\n${pages[page]}`)
                            .setFooter({
                                text: `Page ${page + 1}/${pages.length}`,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setThumbnail(
                                `${player.current.thumbnail
                                    ? player.current.thumbnail
                                    : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`
                                }`,
                            )
                            .setTimestamp()

                        await interaction.editReply({
                            embeds: [nextPageEmbed],
                            components: [new MessageActionRow().addComponents([prevBtn, closeBtn, nextBtn])],
                        });
                    } else if (button.customId === 'queue_prevBtn') {
                        await button.deferUpdate().catch(() => { });
                        page = page > 0 ? --page : pages.length - 1;

                        const prevPageEmbed = new MessageEmbed()
                            .setColor(Embed.ThemeColor)
                            .setTitle(`${Emoji.Music.MUSIC_QUEUE} ${interaction.guild.name}'s Queue`)
                            .setDescription(
                                `${Emoji.Music.MUSIC_CD} **Now playing**\n\`[${player.current.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)
                                }]\` **[${player.current.title}](${player.current.uri})** - ${player.current.requester}\n\n${Emoji.Music.COMINGNEXT} **Coming Next**\n${pages[page]}`)
                            .setFooter({
                                text: `Page ${page + 1}/${pages.length}`,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setThumbnail(
                                `${player.current.thumbnail
                                    ? player.current.thumbnail
                                    : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`
                                }`,
                            )
                            .setTimestamp()

                        await interaction
                            .editReply({
                                embeds: [prevPageEmbed],
                                components: [new MessageActionRow().addComponents([prevBtn, closeBtn, nextBtn])],
                            })
                            .catch(() => { });

                    } else if (button.customId === 'queue_closeBtn') {
                        await button.deferUpdate().catch(() => { });
                        await collector.stop();
                    } else return;
                });

                collector.on('end', async () => {
                    await interaction.editReply({
                        embeds: [MsgEmbed],
                        components: [new MessageActionRow().addComponents([disabledPrevBtn, disabledCloseBtn, disabledNextBtn])],
                    });
                });
            }
        }
    },
};