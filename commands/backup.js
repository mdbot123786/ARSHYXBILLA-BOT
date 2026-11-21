'use strict';

module.exports = async function backupCommand(sock, chatId, msg, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: 'Owner/session owner only.' }, { quoted: msg });
    return sock.sendMessage(chatId, { text: 'Backup is unavailable: the current bot does not implement a secure, restorable session backup. No backup file was created.' }, { quoted: msg });
};
