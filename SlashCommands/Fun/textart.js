const figlet = require("figlet");
const { Client, Message, MessageEmbed } = require("discord.js");
const { Fonts } = require("../../Settings/FigletFonts");

let Choices = []
for (let font of Fonts) {
    let Obj = {
        name: font,
        value: font
    }
    Choices.push(Obj);
}

module.exports = {
    name: "textart",
    description: "Converts the Text into Ascii Art!",
    cooldown: 5,
    category: 'Fun',
    guildOnly: false,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_APPLICATION_COMMAND', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    options: [
        {
            name: "text",
            description: "Text you wanna Asciify!",
            type: "STRING",
            required: true,
        },
        {
            name: "font",
            description: `Select's a Font, If not selected shows the Art in Default Font.`,
            type: "STRING",
            required: false,

            choices: Choices
        }
    ],
    /**
    * 
    * @param {Client} client
    * @param {CommandInteraction} interaction 
    */
    async execute(interaction, client) {
        await interaction.deferReply();
        let inputText = interaction.options.get("text").value;
        if (!interaction.options.get("font")) inputFont = "Standard";
        else inputFont = interaction.options.get("font").value;
        figlet.text(inputText, {
            font: `${inputFont}`,
            horizontalLayout: "default",
            verticalLayout: "default",
        }, (err, outputText) => {
            if (err) {
                interaction.editReply(`Something went wrong, Please try again :(`)
            }
            interaction.editReply(`\`\`\`${outputText}\`\`\``);
        })
    }
}

