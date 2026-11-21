'use strict';

function getTarget(msg) {
    const context = msg.message?.extendedTextMessage?.contextInfo || msg.message?.imageMessage?.contextInfo || msg.message?.videoMessage?.contextInfo;
    return context?.mentionedJid?.[0] || context?.participant || null;
}
function getSettings(data, group) {
    data.warningSettings ||= {};
    data.warningCounts ||= {};
    data.warningSettings[group] ||= { enabled: false, limit: 3, autoKick: false };
    data.warningCounts[group] ||= {};
    return { config: data.warningSettings[group], counts: data.warningCounts[group] };
}
function addWarning(data, group, jid) {
    const { counts } = getSettings(data, group);
    counts[jid] = (counts[jid] || 0) + 1;
    return counts[jid];
}
async function warningsCommand(sock, chatId, msg, action, args = [], isAdmin, data, save) {
    if (!chatId.endsWith('@g.us')) return sock.sendMessage(chatId, { text: 'Yeh command sirf group mein chalegi.' }, { quoted: msg });
    if (!isAdmin) return sock.sendMessage(chatId, { text: 'Warning settings ke liye group admin hona zaroori hai.' }, { quoted: msg });
    const { config, counts } = getSettings(data, chatId);
    const target = getTarget(msg);
    const arg0 = String(args[0] || '').toLowerCase();
    const statusText = () => `Warnings: ${config.enabled ? 'ON' : 'OFF'} | Limit: ${config.limit} | Limit par remove: ${config.autoKick ? 'ON' : 'OFF'} | Members warned: ${Object.keys(counts).length}`;

    if (action === 'warn' && ['on', 'off'].includes(arg0)) {
        config.enabled = arg0 === 'on'; save();
        return sock.sendMessage(chatId, { text: `Group warnings ${arg0.toUpperCase()} hain.` }, { quoted: msg });
    }
    if (action === 'warnstatus') return sock.sendMessage(chatId, { text: statusText() }, { quoted: msg });
    if (action === 'warnkick') {
        if (!['on', 'off'].includes(arg0)) return sock.sendMessage(chatId, { text: 'Istemaal: .warnkick on/off' }, { quoted: msg });
        config.autoKick = arg0 === 'on'; save();
        return sock.sendMessage(chatId, { text: `Limit par group se remove karna ${arg0.toUpperCase()} hai.` }, { quoted: msg });
    }
    if (action === 'warnlimit') {
        const limit = Number(arg0);
        if (!Number.isInteger(limit) || limit < 2 || limit > 10) return sock.sendMessage(chatId, { text: 'Limit 2 se 10 ke darmiyan rakhein.' }, { quoted: msg });
        config.limit = limit; save();
        return sock.sendMessage(chatId, { text: `Warning limit ${limit} set ho gayi.` }, { quoted: msg });
    }
    if (action === 'warnclear') {
        data.warningCounts[chatId] = {}; save();
        return sock.sendMessage(chatId, { text: 'Is group ke tamam warning counts clear kar diye.' }, { quoted: msg });
    }
    if (action === 'warnlist') {
        const rows = Object.entries(counts).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1]);
        const text = rows.length ? rows.map(([jid, count], i) => `${i + 1}. @${jid.split('@')[0]} — ${count}/${config.limit}`).join('\n') : 'Abhi kisi member ko warning nahi mili.';
        return sock.sendMessage(chatId, { text: `⚠️ *Group Warning List*\n${text}`, mentions: rows.map(([jid]) => jid) }, { quoted: msg });
    }
    if (action === 'warns') {
        if (!target) return sock.sendMessage(chatId, { text: 'Member ko mention karke .warns @user likhein.' }, { quoted: msg });
        return sock.sendMessage(chatId, { text: `@${target.split('@')[0]} ki warnings: ${counts[target] || 0}/${config.limit}`, mentions: [target] }, { quoted: msg });
    }
    if (action === 'warnreset' || action === 'unwarn') {
        if (!target) return sock.sendMessage(chatId, { text: `Member ko mention karein: .${action} @user` }, { quoted: msg });
        if (action === 'warnreset') delete counts[target];
        else counts[target] = Math.max(0, (counts[target] || 0) - 1);
        if (!counts[target]) delete counts[target];
        save();
        return sock.sendMessage(chatId, { text: action === 'warnreset' ? `@${target.split('@')[0]} ki warnings reset kar di.` : `@${target.split('@')[0]} ki ek warning hata di.`, mentions: [target] }, { quoted: msg });
    }
    if (action === 'warn') {
        if (!config.enabled) return sock.sendMessage(chatId, { text: 'Pehle .warn on se warning system enable karein.' }, { quoted: msg });
        if (!target) return sock.sendMessage(chatId, { text: 'Member ko mention karein: .warn @user [wajah]' }, { quoted: msg });
        const count = addWarning(data, chatId, target); save();
        const reason = args.slice(1).filter(x => !/^@/.test(x)).join(' ').trim();
        await sock.sendMessage(chatId, { text: `⚠️ @${target.split('@')[0]} ko warning mili (${count}/${config.limit}).${reason ? `\nWajah: ${reason}` : ''}`, mentions: [target] }, { quoted: msg });
        if (count >= config.limit && config.autoKick) {
            try { await sock.groupParticipantsUpdate(chatId, [target], 'remove'); delete counts[target]; save(); }
            catch { await sock.sendMessage(chatId, { text: 'Member ko remove nahi kar saka; bot ko group admin banayein.' }, { quoted: msg }); }
        }
        return;
    }
    return sock.sendMessage(chatId, { text: `${statusText()}\nIstemaal: .warn on/off | .warn @user [wajah]` }, { quoted: msg });
}
warningsCommand.getTarget = getTarget;
warningsCommand.addWarning = addWarning;
warningsCommand.getSettings = getSettings;
module.exports = warningsCommand;
