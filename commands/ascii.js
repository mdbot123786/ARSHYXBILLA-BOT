'use strict';
module.exports = async function ascii(sock, chatId, msg, q) {
    if (!q) return sock.sendMessage(chatId, { text: '.ascii <text>' }, { quoted: msg });
    const text = String(q).normalize('NFKD').replace(/[^\x20-\x7E]/g, '').slice(0, 24).toUpperCase() || 'ARSHY';
    const border = `+${'-'.repeat(text.length + 2)}+`;
    const art = `${border}\n| ${text} |\n${border}`;
    return sock.sendMessage(chatId, { text: `*ASCII art*\n\n\`\`\`\n${art}\n\`\`\`` }, { quoted: msg });
};
