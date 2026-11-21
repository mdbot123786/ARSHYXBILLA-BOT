'use strict';

async function handleStatusUpdate(sock, update, botData, userId) {
    try {
        const settings = botData.statusSettings?.[userId];
        if (!settings?.autoStatus) return;
        for (const msg of update?.messages || []) {
            if (msg?.key?.remoteJid !== 'status@broadcast') continue;
            const sender = msg.key.participant || msg.key.remoteJid;
            if (settings.autoSeen) await sock.readMessages([msg.key]);
            if (settings.autoLike) {
                const emojis = ['❤️', '👍', '🔥', '👏', '😮', '😂', '🙌', '✨', '⭐', '✅'];
                const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                await sock.sendMessage('status@broadcast', { react: { text: emoji, key: msg.key } }, { statusJidList: [sender] });
            }
        }
    } catch (error) {
        console.error('Error in handleStatusUpdate:', error);
    }
}

module.exports = { handleStatusUpdate };
