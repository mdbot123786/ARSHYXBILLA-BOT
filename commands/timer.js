'use strict';

module.exports = async function(sock, chatId, msg, q) {
    const raw = String(q || '').trim();
    if (!/^\d+$/.test(raw)) {
        return sock.sendMessage(chatId, { text: 'Usage: .timer <whole minutes, 1–1440>' }, { quoted: msg });
    }
    const minutes = Number(raw);
    if (!Number.isSafeInteger(minutes) || minutes < 1 || minutes > 1440) {
        return sock.sendMessage(chatId, { text: 'Choose a whole duration from 1 to 1440 minutes.' }, { quoted: msg });
    }
    await sock.sendMessage(chatId, { text: `Timer set for ${minutes} minute(s).` }, { quoted: msg });
    setTimeout(async () => {
        try { await sock.sendMessage(chatId, { text: `⏰ Time is up — ${minutes} minute(s) have passed.` }); } catch (_) {}
    }, minutes * 60 * 1000);
};
