'use strict';

module.exports = async function(sock, chatId, msg, isOwner, q) {
    if (!isOwner) return sock.sendMessage(chatId, { text: 'Owner only.' }, { quoted: msg });
    const raw = String(q || '').trim();
    if (!/^\d+$/.test(raw)) {
        return sock.sendMessage(chatId, { text: 'Usage: .deleteall <count 1–50>. Only bot-sent messages in this chat are considered.' }, { quoted: msg });
    }
    const count = Number(raw);
    if (!Number.isSafeInteger(count) || count < 1 || count > 50) {
        return sock.sendMessage(chatId, { text: 'Choose a whole-number count from 1 to 50.' }, { quoted: msg });
    }
    try {
        const messages = await sock.loadMessages(chatId, count);
        let deleted = 0;
        for (const item of messages?.messages || []) {
            if (item?.key?.fromMe) {
                try {
                    await sock.sendMessage(chatId, { delete: item.key });
                    deleted++;
                } catch (_) {}
            }
        }
        return sock.sendMessage(chatId, { text: `Deleted ${deleted} bot-sent message(s) from the fetched ${count}-message window.` }, { quoted: msg });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `Could not load messages for deletion: ${error.message}` }, { quoted: msg });
    }
};
