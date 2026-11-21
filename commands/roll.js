'use strict';

module.exports = async function(sock, chatId, msg, q) {
    const raw = String(q || '6').trim();
    if (!/^\d+$/.test(raw)) {
        return sock.sendMessage(chatId, { text: 'Usage: .roll [sides]. Choose a whole number from 2 to 1000000.' }, { quoted: msg });
    }
    const sides = Number(raw);
    if (!Number.isSafeInteger(sides) || sides < 2 || sides > 1_000_000) {
        return sock.sendMessage(chatId, { text: 'Choose a whole number of sides from 2 to 1000000.' }, { quoted: msg });
    }
    const result = Math.floor(Math.random() * sides) + 1;
    return sock.sendMessage(chatId, {
        text: `🎲 Rolling d${sides}\n\nResult: ${result}`
    }, { quoted: msg });
};
