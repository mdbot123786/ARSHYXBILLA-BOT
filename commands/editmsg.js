'use strict';

module.exports = async function editMessageCommand(sock, chatId, msg, newText) {
    if (!newText) return sock.sendMessage(chatId, { text: 'Reply to a message sent by this bot and use .editmsg <new text>.' }, { quoted: msg });
    const context = msg.message?.extendedTextMessage?.contextInfo;
    if (!context?.stanzaId || !context.quotedMessage) return sock.sendMessage(chatId, { text: 'Reply to a message sent by this bot; only bot-authored messages can be edited.' }, { quoted: msg });
    const botNumber = String(sock.user?.id || '').split(':')[0].split('@')[0];
    const quotedAuthor = String(context.participant || '').split(':')[0].split('@')[0];
    if (chatId.endsWith('@g.us') && (!quotedAuthor || quotedAuthor !== botNumber)) {
        return sock.sendMessage(chatId, { text: 'The quoted message was not sent by this bot, so it cannot be edited.' }, { quoted: msg });
    }
    const key = { remoteJid: chatId, id: context.stanzaId };
    if (context.participant) key.participant = context.participant;
    try {
        return await sock.sendMessage(chatId, { text: newText, edit: key });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `WhatsApp could not edit that message: ${error.message}` }, { quoted: msg });
    }
};
