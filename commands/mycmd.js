'use strict';

module.exports = async function(sock, chatId, msg) {
    return sock.sendMessage(chatId, {
        text: 'Per-command usage statistics are not stored by this bot. No personal command totals or favourites are available.'
    }, { quoted: msg });
};
