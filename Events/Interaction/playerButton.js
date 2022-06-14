const { MessageEmbed, Client, ButtonInteraction, Permissions } = require("discord.js");
const { convertTime } = require("../../Utils/Convert");
const { buttonReply } = require("../../Utils/Functions");
// const DB = require("../../Schema/");
const Embed = require("../../Settings/Embed.json");
const Emoji = require("../../Settings/Emojis.json");

module.exports = {
    name: "playerButton",
    description: "Manages Button Interactions",
    /**
     * 
     * @param {Client} client 
     * @param {ButtonInteraction} interaction 
     * @param {*} data 
     */
    async execute(interaction, data, client) {
        if (!interaction.replied) await interaction.deferReply().catch(() => { });
        const Color = Embed.ThemeColor;
        const pauseEmoji = Emoji.Music.PAUSE;
        const resumeEmoji = Emoji.Music.RESUME;
        const nextEmoji = Emoji.Music.SKIP;
        const volumeEmoji = Emoji.Music.VOLUMEUP;
        const prevEmoji = Emoji.Music.PREVSONG;
        // =======================< CHECKING FOR DJ ROLE > ======================= //
        // let data2 = await DB.findOne({ Guild: interaction.guildId })
        // let pass = false;
        // if (data2) {
        //     if (data2.Mode) {
        //         if (data2.Roles.length > 0) {
        //             interaction.member.roles.cache.forEach((x) => {
        //                 let role = data2.Roles.find((r) => r === x.id);
        //                 if (role) pass = true;
        //             });
        //         };
        //         if (!pass && !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return await buttonReply(interaction, `You don't have dj role to use this command!`, Color)
        //     };
        // };
        if (!interaction.member.voice.channel) return await buttonReply(interaction, `You are not connected to a voice channel to use this button!`, Color);
        if (interaction.guild.me.voice.channel && interaction.guild.me.voice.channelId !== interaction.member.voice.channelId) return await buttonReply(interaction, `You are not connected to ${interaction.guild.me.voice.channel} to use this buttons!`, Color);

        const player = client.manager.players.get(interaction.guildId);
        if (!player) return await buttonReply(interaction, `Nothing is playing right now!`, Color);
        if (!player.queue) return await buttonReply(interaction, `Nothing is playing right now!`, Color);
        if (!player.current) return await buttonReply(interaction, `Nothing is playing right now!`, Color);

        let message;
        try {

            message = await interaction.channel.messages.fetch(data.Message, { cache: true });

        } catch (error) { };

        let Icon = `${player.current.thumbnail ? player.current.thumbnail : `https://img.youtube.com/vi/${player.current.identifier}/hqdefault.jpg`}` || client.config.links.bg;

        let nowPlaying = new MessageEmbed().setColor(Color).setDescription(`**[${player.current.title}](${player.current.uri})** - \`${player.current.isStream ? '[**◉ LIVE**]' : convertTime(player.current.length)}\``).setImage(Icon).setTimestamp().setFooter({ text: `Requested By ${player.current.requester.tag}`, iconURL: player.current.requester.displayAvatarURL({ dynamic: true }) });

        // =======================< HANDLING BTN INTERACTIONS > ======================= //
        if (interaction.customId === `${interaction.guildId}pause`) {
            if (player.player.paused) {
                await player.setPaused(false);
                await buttonReply(interaction, `${resumeEmoji} [${player.current.title}](${player.current.uri}) is now unpaused/resumed.`, Color);
                if (message) await message.edit({
                    embeds: [nowPlaying]
                }).catch(() => { });
            } else {
                await player.setPaused(true);
                await buttonReply(interaction, `${pauseEmoji} [${player.current.title}](${player.current.uri}) is now paused.`, Color);
                if (message) await message.edit({
                    embeds: [nowPlaying]
                }).catch(() => { });
            };
        } else if (interaction.customId === `${interaction.guildId}skip`) {
            if (player.queue.length === 0) return await buttonReply(interaction, `No more songs left in the queue to skip.`, Color);
            await player.player.stopTrack();
            if (message) await message.edit({
                embeds: [nowPlaying]
            }).catch(() => { });
            return await buttonReply(interaction, `${nextEmoji} Skipped - [${player.current.title}](${player.current.uri})`, Color)

        } else if (interaction.customId === `${interaction.guildId}previous`) {
            if (!player.previous) {
                return await buttonReply(interaction, `No previous song found`, Color);
            }
            if (player.previous) {
                player.queue.unshift(player.previous);
                await player.player.stopTrack();
            }
            await buttonReply(interaction, `${prevEmoji} Previous - [${player.previous.title}](${player.previous.uri})`, Color);
            if (message) await message.edit({
                embeds: [nowPlaying]
            }).catch(() => { });
        } else if (interaction.customId === `${interaction.guildId}voldown`) {
            let amount = Number(player.player.filters.volume * 100 - 10);
            if (amount <= 10) return await buttonReply(interaction, `Volume Cannot be Decreased below \`10%\`.`, Color);
            if (message) await message.edit({
                embeds: [nowPlaying]
            }).catch(() => { });
            await player.setVolume(amount / 1);
            await buttonReply(interaction, `${volumeEmoji} Volume set to - \`${player.player.filters.volume * 100}%\``, Color);
            if (message) await message.edit({
                embeds: [nowPlaying]
            }).catch(() => { });

        } else if (interaction.customId === `${interaction.guildId}volup`) {
            let amount = Number(player.player.filters.volume * 100 + 10);
            if (amount >= 100) return await buttonReply(interaction, `Volume Cannot Exceed \`100%\``, Color);
            await player.setVolume(amount / 1);
            await buttonReply(interaction, `${volumeEmoji} Volume set to - \`${player.player.filters.volume * 100}%\``, Color);
            if (message) await message.edit({
                embeds: [nowPlaying]
            }).catch(() => { });
        } else {
            if (message) await message.edit({
                embeds: [nowPlaying]
            }).catch(() => { });

            return await buttonReply(interaction, `You've choosen an invalid button!`, Color);
        };
    }
}
