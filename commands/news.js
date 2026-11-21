'use strict';
module.exports = async function newsCommand(sock, chatId, msg) {
    return sock.sendMessage(chatId, { text: 'News command temporarily disabled; is project mein is ka reliable provider configured nahi hai.' }, { quoted: msg });
};
