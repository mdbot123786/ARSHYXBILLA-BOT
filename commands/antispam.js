'use strict';

function getSettings(data, group) {
    data.spamGroups ||= {};
    return data.spamGroups[group] ||= { enabled: false, limit: 5, windowMs: 7000 };
}
async function antispamCommand(sock, chatId, msg, action, args = [], isAdmin, data, save) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: 'Anti-spam setting sirf group mein badal sakte hain.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: 'Anti-spam setting ke liye group admin hona zaroori hai.' }, { quoted: msg });
    const config = getSettings(data, chatId);
    const value = String(args[0] || '').toLowerCase();
    if (action === 'status' || !value) return sock.sendMessage(chatId, { text: `Anti-spam: ${config.enabled ? 'ON' : 'OFF'} | Burst limit: ${config.limit} messages / ${Math.round(config.windowMs / 1000)} sec` }, { quoted: msg });
    if (!['on', 'off'].includes(value)) return sock.sendMessage(chatId, { text: 'Istemaal: .antispam on/off' }, { quoted: msg });
    config.enabled = value === 'on'; save();
    return sock.sendMessage(chatId, { text: `Anti-spam ${value.toUpperCase()} hai.` }, { quoted: msg });
}
function recordBurst(data, group, jid, now = Date.now()) {
    const config = data.spamGroups?.[group];
    if (!config?.enabled) return false;
    data.spamBursts ||= {};
    const key = `${group}:${jid}`;
    const current = (data.spamBursts[key] || []).filter(time => now - time <= config.windowMs);
    current.push(now);
    data.spamBursts[key] = current;
    for (const k of Object.keys(data.spamBursts)) if (data.spamBursts[k].length === 0) delete data.spamBursts[k];
    if (Object.keys(data.spamBursts).length > 2500) delete data.spamBursts[Object.keys(data.spamBursts)[0]];
    return current.length >= config.limit;
}
antispamCommand.getSettings = getSettings;
antispamCommand.recordBurst = recordBurst;
module.exports = antispamCommand;
