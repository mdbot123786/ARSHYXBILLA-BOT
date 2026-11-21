'use strict';

module.exports = async function kickOfflineCommand(sock, from, msg, isAdmin) {
    if (!from.endsWith('@g.us')) {
        return sock.sendMessage(from, { text: 'Use this command inside a WhatsApp group.' }, { quoted: msg });
    }
    if (!isAdmin) {
        return sock.sendMessage(from, { text: 'Only a group admin can use this command.' }, { quoted: msg });
    }
    return sock.sendMessage(from, {
        text: 'This feature is disabled: WhatsApp does not provide reliable historical last-seen data for group members. No members were removed.'
    }, { quoted: msg });
};
