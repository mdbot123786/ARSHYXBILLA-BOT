'use strict';

module.exports = async function joinCommand(sock, chatId, msg, query, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: 'Only the bot owner/session owner can add this bot to another group.' }, { quoted: msg });
    const match = String(query || '').trim().match(/^https:\/\/chat\.whatsapp\.com\/([A-Za-z0-9_-]{8,})(?:[/?#].*)?$/i);
    if (!match) return sock.sendMessage(chatId, { text: 'Usage: .join <valid https://chat.whatsapp.com invite link>' }, { quoted: msg });
    try {
        const response = await sock.groupAcceptInvite(match[1]);
        return sock.sendMessage(chatId, { text: `Joined group successfully. Group ID: ${response}` }, { quoted: msg });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `Could not join the group: ${error.message}` }, { quoted: msg });
    }
};
