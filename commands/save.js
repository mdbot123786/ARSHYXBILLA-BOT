'use strict';

module.exports = async function saveCommand(sock, chatId, msg) {
    return sock.sendMessage(chatId, { text: 'Message bookmarks are not implemented, so this message was not saved.' }, { quoted: msg });
};
