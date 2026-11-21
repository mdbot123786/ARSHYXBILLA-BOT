'use strict';
module.exports = async function emojimixDisabled(sock, chatId, msg) {
    return sock.sendMessage(chatId, { text: 'Emoji mix is disabled because its external API credential is not configured.' }, { quoted: msg });
};
