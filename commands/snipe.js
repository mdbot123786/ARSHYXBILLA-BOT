'use strict';

const { getSnipedMessages } = require('./antidelete');

module.exports = async function snipeCommand(sock, chatId, msg, isOwner) {
    if (!isOwner) return sock.sendMessage(chatId, { text: 'Only the bot owner/session owner can retrieve deleted-message history.' }, { quoted: msg });
    const recent = getSnipedMessages(chatId)[0];
    if (!recent) return sock.sendMessage(chatId, { text: 'No recently deleted message is available. Enable .antidelete on first.' }, { quoted: msg });
    const sender = recent.sender || chatId;
    const text = `🔎 *SNIPE — LAST DELETED MESSAGE*\n\nFrom: @${sender.split('@')[0]}\nTime: ${new Date(recent.time).toLocaleTimeString()}\nContent: ${recent.text}`;
    return sock.sendMessage(chatId, { text, mentions: [sender] }, { quoted: msg });
};
