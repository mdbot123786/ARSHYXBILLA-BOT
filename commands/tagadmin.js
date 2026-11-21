'use strict';

module.exports = async function(sock, chatId, msg) {
    if (!chatId.endsWith('@g.us')) {
        return sock.sendMessage(chatId, { text: 'Use .tagadmin inside a WhatsApp group.' }, { quoted: msg });
    }
    try {
        const group = await sock.groupMetadata(chatId);
        const admins = (group.participants || []).filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        if (!admins.length) return sock.sendMessage(chatId, { text: 'No group admins found.' }, { quoted: msg });
        const text = `*Group admins:*\n${admins.map(p => `@${p.id.split('@')[0]}`).join('\n')}`;
        return sock.sendMessage(chatId, { text, mentions: admins.map(p => p.id) }, { quoted: msg });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `Could not read group admins: ${error.message}` }, { quoted: msg });
    }
};
