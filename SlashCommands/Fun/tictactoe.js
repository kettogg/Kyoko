const TicTacToe = require("discord-tictactoe");
const Game = new TicTacToe({ language: "en", commandOptionName: "rival" });

/*==================================| </> |==================================*/

module.exports = {
    name: "tictactoe",
    description: "Play TIC-TAC-TOE, Yayy!",
    type: "CHAT_INPUT",
    cooldown: 10,
    category: 'Fun',
    guildOnly: true,
    nsfwOnly: false,
    botPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'USE_EXTERNAL_EMOJIS', 'USE_APPLICATION_COMMAND', 'USE_EXTERNAL_STICKERS', 'SEND_MESSAGES_IN_THREADS'],
    userPerms: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
    options: [
        {
            name: "rival",
            description: "Select your Opponet, if not selected play with AI",
            type: "USER",
            required: false
        }
    ],
    async execute(interaction) {
        Game.handleInteraction(interaction);
    }
}   