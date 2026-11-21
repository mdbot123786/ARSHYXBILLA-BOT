'use strict';

const settings = require('../settings');
const fs = require('node:fs');
const path = require('node:path');

async function prefixCommand(sock, from, msg) {
    const ownerNumber = String(settings.ownerNumber || '').replace(/[^\d]/g, '');
    const ownerDisplay = ownerNumber ? `+${ownerNumber}` : 'Not configured';
    const text = `╭━━━━━━━━━━━━━━━━━━━━━━╮\n` +
        `⚡ 𝐀𝐑𝐒𝐇𝐘 𝐁𝐎𝐓\n` +
        `╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n` +
        `◈ Bot: ${settings.botName}\n` +
        `◈ Owner: ${settings.ownerName || 'JUTT'}\n` +
        `◈ Owner number: ${ownerDisplay}\n` +
        `◈ Prefix: ${settings.prefix}\n` +
        `◈ Version: ${settings.version}\n` +
        `◈ Status: Online\n\n` +
        `📢 Channel: ${settings.whatsappChannel}\n\n` +
        `⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐑𝐒𝐇𝐘`;

    const localImage = path.join(__dirname, '..', 'public', 'assets', 'prefix-image.jpg');
    try {
        await sock.sendMessage(from, { image: { url: fs.existsSync(localImage) ? localImage : settings.dpImage }, caption: text }, { quoted: msg });
    } catch (error) {
        try { await sock.sendMessage(from, { image: { url: settings.dpImage }, caption: text }, { quoted: msg }); }
        catch { await sock.sendMessage(from, { text }, { quoted: msg }); }
    }
}

module.exports = prefixCommand;
