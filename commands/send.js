'use strict';

module.exports = async function sendCommand(sock, chatId, msg, isOwner, query) {
    if (!isOwner) return sock.sendMessage(chatId, { text: 'Owner/session owner only.' }, { quoted: msg });
    const parts = String(query || '').trim().split(/\s+/);
    const number = String(parts.shift() || '').replace(/\D/g, '');
    const text = parts.join(' ').trim();
    if (!/^\d{7,15}$/.test(number) || !text) return sock.sendMessage(chatId, { text: 'Usage: .send <international number> <message>' }, { quoted: msg });
    try {
        await sock.sendMessage(`${number}@s.whatsapp.net`, { text });
        return sock.sendMessage(chatId, { text: `Message sent to +${number}.` }, { quoted: msg });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `Message failed: ${error.message}` }, { quoted: msg });
    }
};
