'use strict';

module.exports = async function(sock, chatId, msg) {
    return sock.sendMessage(chatId, {
        text: 'BIN lookup is unavailable because this bot has no verified BIN data provider configured. No issuer, card type, or country was guessed.'
    }, { quoted: msg });
};
