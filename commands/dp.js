'use strict';

module.exports = async function dpCommand(sock, from, msg) {
    try {
        const context = msg.message?.extendedTextMessage?.contextInfo;
        const target = context?.mentionedJid?.[0] || context?.participant || msg.key.participant || from;
        await sock.sendMessage(from, { react: { text: '⏳', key: msg.key } }).catch(() => {});
        let ppUrl;
        try { ppUrl = await sock.profilePictureUrl(target, 'image'); }
        catch {
            try { ppUrl = await sock.profilePictureUrl(target, 'preview'); }
            catch {
                return sock.sendMessage(from, { text: 'That WhatsApp profile picture is unavailable. The person’s privacy settings may hide it.' }, { quoted: msg });
            }
        }
        return sock.sendMessage(from, { image: { url: ppUrl }, caption: `✅ *Profile Picture*\n👤 *User:* @${target.split('@')[0]}`, mentions: [target] }, { quoted: msg });
    } catch (error) {
        console.error('DP command error:', error);
        return sock.sendMessage(from, { text: 'Could not retrieve that profile picture.' }, { quoted: msg });
    }
};
