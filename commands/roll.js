'use strict';
module.exports = async function(sock, chatId, msg, q) {
    const raw = String(q || '6').trim();
    if (!/^\d+$/.test(raw)) return sock.sendMessage(chatId, { text: 'Istemaal: .roll [sides] — 2 se 1000000 tak poora number dein.' }, { quoted: msg });
    const sides = Number(raw);
    if (!Number.isSafeInteger(sides) || sides < 2 || sides > 1_000_000) return sock.sendMessage(chatId, { text: '2 se 1000000 tak poore sides ka number dein.' }, { quoted: msg });
    const result = Math.floor(Math.random() * sides) + 1;
    return sock.sendMessage(chatId, { text: `🎲 d${sides} phenk rahe hain\n\nNateeja: ${result}` }, { quoted: msg });
};
