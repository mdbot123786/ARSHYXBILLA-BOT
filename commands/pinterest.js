'use strict';

module.exports = async function(sock, chatId, msg) {
    return sock.sendMessage(chatId, {
        text: 'Pinterest search/download is currently unavailable. No unrelated image was returned; try again after a supported Pinterest media provider is configured.'
    }, { quoted: msg });
};
