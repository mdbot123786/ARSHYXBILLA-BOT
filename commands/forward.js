'use strict';

const { generateForwardMessageContent, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

module.exports = async function forwardCommand(sock, chatId, msg, isOwner, query) {
    if (!isOwner) return sock.sendMessage(chatId, { text: 'Owner/session owner only.' }, { quoted: msg });
    const digits = String(query || '').replace(/\D/g, '');
    if (!/^\d{7,15}$/.test(digits)) return sock.sendMessage(chatId, { text: 'Usage: reply to a message and run .forward <international number>.' }, { quoted: msg });
    const context = msg.message?.extendedTextMessage?.contextInfo;
    if (!context?.stanzaId || !context.quotedMessage) return sock.sendMessage(chatId, { text: 'Reply to the message you want to forward.' }, { quoted: msg });
    const target = `${digits}@s.whatsapp.net`;
    if (target === chatId) return sock.sendMessage(chatId, { text: 'Choose a different destination number.' }, { quoted: msg });
    try {
        const original = {
            key: { remoteJid: chatId, id: context.stanzaId, participant: context.participant, fromMe: Boolean(context.participant && String(context.participant).split('@')[0] === String(sock.user?.id || '').split(':')[0]) },
            message: context.quotedMessage
        };
        const content = generateForwardMessageContent(original, true);
        const outgoing = generateWAMessageFromContent(target, content, { userJid: sock.user.id });
        await sock.relayMessage(target, outgoing.message, { messageId: outgoing.key.id });
        return sock.sendMessage(chatId, { text: `Forwarded the quoted message to +${digits}.` }, { quoted: msg });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `Forward failed: ${error.message}` }, { quoted: msg });
    }
};
