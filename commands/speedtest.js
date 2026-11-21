'use strict';

module.exports = async function(sock, chatId, msg) {
    return sock.sendMessage(chatId, {
        text: 'A real network speed test is not implemented in this bot. No latency, download, or upload measurement was performed.'
    }, { quoted: msg });
};
