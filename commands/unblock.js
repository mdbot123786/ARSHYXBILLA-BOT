'use strict';

module.exports = async function(sock, chatId, msg, isOwner, q) {
    if (!isOwner) return sock.sendMessage(chatId, { text: 'Owner only.' }, { quoted: msg });
    const raw = String(q || '').trim();
    if (!raw || !/^\+?[\d\s().-]+$/.test(raw)) {
        return sock.sendMessage(chatId, { text: 'Usage: .unblock <international phone number, 8–15 digits>' }, { quoted: msg });
    }
    const digits = raw.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15) {
        return sock.sendMessage(chatId, { text: 'Enter a valid international number containing 8–15 digits.' }, { quoted: msg });
    }
    try {
        await sock.updateBlockStatus(`${digits}@s.whatsapp.net`, 'unblock');
        return sock.sendMessage(chatId, { text: `Unblocked +${digits}.` }, { quoted: msg });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `Could not unblock that number: ${error.message}` }, { quoted: msg });
    }
};
