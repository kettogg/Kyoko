const { MessageEmbed, CommandInteraction, Client } = require("discord.js")
//=====================================| Code |=====================================//
/**
 * 
 * @param {Client} client
 * @param {CommandInteraction} interaction 
 */
module.exports = {
    name: "userinfo",
    description: "Display's the user information of a server member.",
    cooldown: 10,
    category: 'Info',
    guildOnly: true,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_APPLICATION_COMMAND', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    options: [
        {
            name: "member",
            description: "The member whose details you want.",
            type: "USER",
            required: true
        }
    ],
    async execute(interaction, client) {
        await interaction.deferReply();
        const member = interaction.options.getMember("member") || interaction.member
        const activities = member.presence?.activities || []
        // console.log(member.roles.cache.size-1); Number of Roles of that Member!
        const rolesCount = member.roles.cache.size - 1; //Excluding the @everyone Role
        const focusActivity = activities.find(x => x.assets)
        const MsgEmbed = new MessageEmbed()
            .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL() })
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
            .setThumbnail(focusActivity ? `https://cdn.discordapp.com/app-assets/${focusActivity.applicationId}/${focusActivity.assets.largeImage}` : member.user.displayAvatarURL())
            .setDescription(activities.map((x, i) => `**${x.type}**: \`${x.name || "None"} : ${x.details || "None"} : ${x.state || "None"}\``).join("\n"))
            .addField("Joined Server On", member.joinedAt.toLocaleString(), true)
            .addField("Account Created On", member.user.createdAt.toLocaleString(), true)
            .addField(`Roles [${rolesCount}]`, `${rolesCount ? member.roles.cache.map(r => r).join(" ").replace("@everyone", " ") : `None`}`)
            .addField("Common Information", [
                `Display Name: \`${member.displayName}\``,
                `Pending Member: \`${member.pending ? 'Yes' : 'No'}\``,
                `Booster: \`${member.premiumSince ? 'Boosting Since ' + member.premiumSince.toLocaleString() : 'Nope'}\``
            ].join("\n"))
            .setTimestamp()
            .setFooter({ text: `ID: ${member.user.id} ` })
        return interaction.editReply({ embeds: [MsgEmbed] })
    },
};