const { CommandInteraction, Client, interactionEmbed, MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const DB = require("../../Schema/Setup");
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json");

module.exports = {
    name: "setupmusic",
    description: "Sets up a music request channel!",
    category: "Music",
    userPerms: ['MANAGE_GUILD'],
    botPerms: ['EMBED_LINKS'],
    guildOnly: true,
    options: [
        {
            name: "create",
            description: "Create's a music request channel and a voice channel!",
            type: "SUB_COMMAND"

        },
        {
            name: "delete",
            description: "Delete's an existing request channel!",
            type: "SUB_COMMAND"
        }
    ],
    /**
    * 
    * @param {Client} client
    * @param {CommandInteraction} interaction
    */
    async execute(interaction, client) {
        // ====================< CHECK IF CHANNEL ALREADY EXISTS >==================== //
        await interaction.deferReply();
        let data = await DB.findOne({ Guild: interaction.guildId });
        if (interaction.options.getSubcommand() === "create") {
            if (data) return await interaction.editReply({ content: `Music setup already exists in your server!` });
            // =======================< CREATE IF NOT EXISTS >======================= //
            const Category = await interaction.guild.channels.create(`*✧･ﾟ ${client.user.username} MUSIC 🌸 *✧･ﾟ`, {
                type: "GUILD_CATEGORY",
                permissionOverwrites: [
                    {
                        type: "member",
                        id: client.user.id,
                        allow: ["CONNECT", "SPEAK", "VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"]
                    },
                    {
                        type: "role",
                        id: interaction.guild.roles.cache.find((x) => x.name === "@everyone").id,
                        allow: ["VIEW_CHANNEL"]
                    }
                ]
            });
            const textChannel = await interaction.guild.channels.create(`🌸 ${client.user.username}-song-requests`, {
                type: "GUILD_TEXT",
                parent: Category.id,
                permissionOverwrites: [
                    {
                        type: "member",
                        id: client.user.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS", "READ_MESSAGE_HISTORY"]
                    },
                    {
                        type: "role",
                        id: interaction.guild.roles.cache.find((x) => x.name === "@everyone").id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    }
                ]
            });
            const voiceChannel = await interaction.guild.channels.create(`🌸 Akemi-Music`, {
                type: "GUILD_VOICE",
                parent: Category.id,
                bitrate: 1000 * 96,  // ===< Quality(For Non Boosted Server-96000 Max) >=== //
                userLimit: 40,
                permissionOverwrites: [
                    {
                        type: "member",
                        id: client.user.id,
                        allow: ["CONNECT", "SPEAK", "VIEW_CHANNEL", "REQUEST_TO_SPEAK"]
                    },
                    {
                        type: "role",
                        id: interaction.guild.roles.cache.find((x) => x.name === "@everyone").id,
                        allow: ["CONNECT", "VIEW_CHANNEL"],
                        deny: ["SPEAK"]
                    }
                ]
            });

            let disabledBtn = true;
            let player = client.manager.players.get(interaction.guildId);
            if (player) disabledBtn = false;

            const Title = player && player.queue && player.current ? `${Emoji.Music.MIKUSING} Now playing` : `${Emoji.Music.MIKUCUTE} Nothing is playing right now`;
            const Desc = player && player.queue && player.current ? `[${player.current.title}](${player.current.uri})` : null;
            const Footer = {
                text: player && player.queue && player.current ? `Requested By ${player.current.requester.tag}` : "",
                iconURL: player && player.queue && player.current ? `${player.current.requester.displayAvatarURL({ dynamic: true })}` : `${client.user.displayAvatarURL({ dynamic: true })}`
            };
            const Image = "https://i.pinimg.com/236x/9b/3c/d1/9b3cd1a82d9d2303d69cd9b8fd914b69.jpg";

            let MsgEmbed = new MessageEmbed().setColor(Embed.ThemeColor).setTitle(Title).setFooter({ text: Footer.text, iconURL: Footer.iconURL }).setImage(Image).setTimestamp();

            if (player && player.queue && player.current) MsgEmbed.setDescription(Desc);
            const pauseBtn = new MessageButton().setCustomId(`${interaction.guildId}pause`).setEmoji(`${Emoji.Music.PLAYPAUSE}`).setStyle("SECONDARY").setDisabled(disabledBtn)
            const prevBtn = new MessageButton().setCustomId(`${interaction.guildId}previous`).setEmoji(`${Emoji.Music.PREVSONG}`).setStyle("SECONDARY").setDisabled(disabledBtn)
            const nextBtn = new MessageButton().setCustomId(`${interaction.guildId}skip`).setEmoji(`${Emoji.Music.NEXTSONG}`).setStyle("SECONDARY").setDisabled(disabledBtn)
            const volDownBtn = new MessageButton().setCustomId(`${interaction.guildId}voldown`).setEmoji(`${Emoji.Music.VOLUMEDOWN}`).setStyle("SECONDARY").setDisabled(disabledBtn)
            const volUpBtn = new MessageButton().setCustomId(`${interaction.guildId}volup`).setEmoji(`${Emoji.Music.VOLUMEUP}`).setStyle("SECONDARY").setDisabled(disabledBtn)

            const row = new MessageActionRow().addComponents(volDownBtn, prevBtn, pauseBtn, nextBtn, volUpBtn)

            const Msg = await textChannel.send({
                embeds: [MsgEmbed],
                components: [row]
            });
            // =======================< SAVE PLAYER TO DB >======================= //
            const newData = new DB({
                Guild: interaction.guildId,
                Channel: textChannel.id,
                Message: Msg.id,
                voiceChannel: voiceChannel.id,
            });
            await newData.save();

            return await interaction.editReply({
                embeds: [new MessageEmbed().setColor(Embed.SuccessColor).setTitle("Setup Finished").setDescription(`**Song request channel has been created - ${textChannel}\n**Please don't delete the Player created in the Channel ${textChannel}, as it may cause the music system to fail!*`).setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })]
            });
        } else if (interaction.options.getSubcommand() === "delete") {
            if (!data) return await interaction.editReply({ content: `This server doesnot have any song request channel to delete!` });
            await data.delete();
            return await interaction.editReply({ content: `Successfully deleted all the music setup channels!` });
        }
    }
};
