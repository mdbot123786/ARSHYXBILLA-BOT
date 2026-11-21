'use strict';
module.exports = async function(sock, chatId, msg) {
    const result = Math.random() < 0.5 ? 'Chit' : 'Patt';
    const emoji = result === 'Chit' ? '🪙' : '🪙';
    return sock.sendMessage(chatId, { text: `*${emoji} Sikka uchhalo*\n\nSikka ghoom raha hai...\n\n*Nateeja: ${result}!*` }, { quoted: msg });
};
