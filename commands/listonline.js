'use strict';

module.exports = async function(sock, chatId, msg) {
    if (!chatId.endsWith('@g.us')) {
        return sock.sendMessage(chatId, { text: 'Use .listonline inside a group.' }, { quoted: msg });
    }
    try {
        const group = await sock.groupMetadata(chatId);
        const participants = Array.isArray(group.participants) ? group.participants : [];
        const lines = participants.map((participant, index) => {
            const role = participant.admin === 'superadmin' ? ' (owner)' : participant.admin === 'admin' ? ' (admin)' : '';
            return `${index + 1}. @${participant.id.split('@')[0]}${role}`;
        });
        const text = `╭━━〔 GROUP PARTICIPANTS 〕━━╮\n` +
            `Total: ${participants.length}\n\n` +
            `${lines.join('\n') || 'No participants found.'}\n\n` +
            `Note: WhatsApp group metadata does not identify who is currently online.`;
        return sock.sendMessage(chatId, { text, mentions: participants.map(p => p.id) }, { quoted: msg });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `Could not read group participants: ${error.message}` }, { quoted: msg });
    }
};
