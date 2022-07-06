const { Client, Message, Permissions } = require("discord.js");
const { playerHandler } = require("../../Utils/Functions");
const Embed = require("../../Settings/Embed.json");

async function sendEmbed(channel, args) {
    try {
        let MsgEmbed = new MessageEmbed().setColor(Embed.WrongColor).setDescription(`${args}`);
        const Msg = await channel.send({
            embeds: [MsgEmbed]
        });

        setTimeout(async () => await Msg.delete().catch(() => { }), 12000);
    } catch (e) {
        return console.error(e)
    }
};

module.exports = {
    name: "setupSystem",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    async execute(client, message) {
        if (!message.member.voice.channel) {
            await sendEmbed(message.channel, `You are not connected to a voice channel to queue songs!`, client.embedColor);
            if (message) await message.delete().catch(() => { });
            return;
        };

        if (!message.member.voice.channel.permissionsFor(client.user).has([Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK])) {
            await sendEmbed(message.channel, `I don't have enough permission to connect/speak in ${message.member.voice.channel}!`);
            if (message) await message.delete().catch(() => { });
            return;
        };

        if (message.guild.me.voice.channel && message.guild.me.voice.channelId !== message.member.voice.channelId) {
            await sendEmbed(message.channel, `You are not connected to <#${message.guild.me.voice.channelId}> to queue songs!`);
            if (message) await message.delete().catch(() => { });
            return;
        };

        let player = client.manager.players.get(message.guildId);

        if (!player) player = await client.manager.createPlayer({
            guildId: message.guild.id,
            voiceId: message.member.voice.channel.id,
            textId: message.channel.id,
            deaf: true,
        });

        await playerHandler(message.content, player, message);
        if (message) await message.delete().catch(() => { });
    }
}