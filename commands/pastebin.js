'use strict';

module.exports = async function pastebinCommand(sock, chatId, msg) {
    return sock.sendMessage(chatId, { text: 'Paste upload is disabled because it would send your text to a public third-party service. No text was uploaded.' }, { quoted: msg });
};
