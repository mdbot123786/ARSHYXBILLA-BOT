'use strict';

module.exports = async function restoreCommand(sock, chatId, msg, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: 'Owner/session owner only.' }, { quoted: msg });
    return sock.sendMessage(chatId, { text: 'Restore is unavailable: this project has no validated restore workflow. No session or settings were changed.' }, { quoted: msg });
};
