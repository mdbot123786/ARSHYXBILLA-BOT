'use strict';

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');

async function collect(stream) {
    const chunks = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks);
}

module.exports = async function stickerCommand(sock, chatId, msg) {
    try {
        const current = msg.message?.ephemeralMessage?.message || msg.message?.viewOnceMessage?.message || msg.message?.viewOnceMessageV2?.message || msg.message || {};
        const context = current.extendedTextMessage?.contextInfo || msg.message?.extendedTextMessage?.contextInfo;
        const quoted = context?.quotedMessage?.ephemeralMessage?.message || context?.quotedMessage?.viewOnceMessage?.message || context?.quotedMessage?.viewOnceMessageV2?.message || context?.quotedMessage || {};
        const image = current.imageMessage || quoted.imageMessage;
        if (!image) return sock.sendMessage(chatId, { text: 'Reply to a still image with .sticker. Video-to-sticker conversion is not supported by this command.' }, { quoted: msg });
        const input = await collect(await downloadContentFromMessage(image, 'image'));
        if (!input.length) throw new Error('The image download was empty.');
        const sticker = await sharp(input).rotate().resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 80 }).toBuffer();
        return sock.sendMessage(chatId, { sticker }, { quoted: msg });
    } catch (error) {
        console.error('Sticker error:', error);
        return sock.sendMessage(chatId, { text: `Could not create a sticker: ${error.message}` }, { quoted: msg });
    }
};
