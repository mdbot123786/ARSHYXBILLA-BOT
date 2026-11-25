'use strict';

const AUTO_WARN_TYPES = ['image','video','audio','sticker','document','link','word','contact','location','spam','emoji'];
const WARNING_LINES = [
    '☠️ Zubaan ko control mein rakho, warna jawab yaad rahega.',
    '🥶 Hum badtameezi nahi karte, lekin bardasht bhi nahi.',
    '🗿 Apna lehja theek rakho, saamne admin hai koi dost nahi.',
    '⚠️ Khamoshi ko kamzori samajhne ki ghalti mat karna.',
    '😂 Itna bhi mat uchlo, zameen sabko naseeb hoti hai.',
    '👑 Izzat doge toh izzat milegi, warna roast free hai.',
    '☠️ Tumhari harkatein aur hamara sabr, dono aakhri stage par hain.',
    '🥀 Alfaaz soch kar istemal karo, jawab soch se bahar milega.',
    '🥶 Yahan naam nahi, kirdar dekha jata hai.',
    '⚡ Warning halki hai, anjaam nahi.',
    '🗿 Apni had mein raho, har jagah hero banna zaroori nahi.',
    '☠️ Zyada bolne walon ka aksar jawab nahi, screenshot milta hai.',
    '👑 Lehja badlo, warna group admin action le sakta hai.',
    '🔥 Rules break hue toh group se action ho sakta hai.',
    '😂 Itna bhi special mat samjho khud ko.',
    '⚠️ Aakhri reminder hai, agli baar admin action le sakte hain.',
    '🥶 Hum waqt dete hain, baar baar mauqa nahi.',
    '🗿 Tameez mein raho, warna khamoshi bhi jawab dena jaanti hai.',
    '☠️ Roast ki tayari mukammal hai, bas tumhari harkat ka intezar hai.',
    '👑 Rules sab ke liye hain, chahe banda kitna hi khaas kyun na ho.',
    '🥀 Apni personality upgrade karo, warna roast hoti rahegi.',
    '⚡ Zyada attitude mat dikhao, yahan sabka hisaab hota hai.',
    '😂 Tumhari overacting ka season ab khatam hone wala hai.',
    '☠️ Samajhdar ke liye ishara kaafi hai.',
    '🗿 Yeh warning hai, invitation nahi.'
];
function randomWarningLine() { return WARNING_LINES[Math.floor(Math.random() * WARNING_LINES.length)]; }
function isSingleEmoji(text) {
    const value = String(text || '').trim();
    if (!value) return false;
    const clusters = [...new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(value)];
    return clusters.length === 1 && /\p{Extended_Pictographic}|\p{Regional_Indicator}|^[#*0-9]\uFE0F?\u20E3$/u.test(value);
}
function getTarget(msg) {
    const context = msg.message?.extendedTextMessage?.contextInfo || msg.message?.imageMessage?.contextInfo || msg.message?.videoMessage?.contextInfo;
    return context?.mentionedJid?.[0] || context?.participant || null;
}
function getSettings(data, group) {
    data.warningSettings ||= {};
    data.warningCounts ||= {};
    data.warningSettings[group] ||= { enabled: false, limit: 3, autoKick: false, autoWarn: {}, words: [] };
    const config = data.warningSettings[group];
    config.autoWarn ||= {};
    config.words ||= [];
    for (const type of AUTO_WARN_TYPES) if (typeof config.autoWarn[type] !== 'boolean') config.autoWarn[type] = false;
    data.warningCounts[group] ||= {};
    return { config, counts: data.warningCounts[group] };
}
function addWarning(data, group, jid) {
    const { counts } = getSettings(data, group);
    counts[jid] = (counts[jid] || 0) + 1;
    return counts[jid];
}
function autoWarningType(content = {}, text = '', config = {}, forcedType) {
    const enabled = config.autoWarn || {};
    if (forcedType) return enabled[forcedType] ? forcedType : null;
    const keys = Object.keys(content || {});
    const typeMap = {
        imageMessage: 'image', videoMessage: 'video', audioMessage: 'audio',
        stickerMessage: 'sticker', documentMessage: 'document', contactMessage: 'contact',
        contactsArrayMessage: 'contact', locationMessage: 'location', liveLocationMessage: 'location'
    };
    for (const [key, type] of Object.entries(typeMap)) if (keys.includes(key) && enabled[type]) return type;
    if (enabled.link && /(?:https?:\/\/|www\.|chat\.whatsapp\.com\/|\b[\w-]+\.[a-z]{2,}\b)/i.test(text)) return 'link';
    const lower = String(text || '').toLocaleLowerCase();
    if (enabled.word && (config.words || []).some(word => word && lower.includes(String(word).toLocaleLowerCase()))) return 'word';
    if (enabled.emoji && isSingleEmoji(text)) return 'emoji';
    return null;
}
async function applyAutoWarning(sock, group, msg, sender, content, text, isAdmin, data, save, forcedType) {
    if (!group.endsWith('@g.us') || isAdmin || !sender) return false;
    const { config, counts } = getSettings(data, group);
    const type = autoWarningType(content, text, config, forcedType);
    if (!type) return false;
    const count = addWarning(data, group, sender);
    save();
    await sock.sendMessage(group, { text: `⚠️ @${sender.split('@')[0]} ko auto-warning (${count}/${config.limit}) mili. Wajah: ${type}.\n${randomWarningLine()}`, mentions: [sender] }, { quoted: msg });
    if (count >= config.limit && config.autoKick) {
        try { await sock.groupParticipantsUpdate(group, [sender], 'remove'); delete counts[sender]; save(); }
        catch { await sock.sendMessage(group, { text: 'Member ko remove nahi kar saka; bot ko group admin banayein.' }, { quoted: msg }); }
    }
    return true;
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
    if (action === 'autowarn') {
        const kind = arg0;
        const mode = String(args[1] || '').toLowerCase();
        if (kind === 'status' || !kind) {
            const types = AUTO_WARN_TYPES.map(type => `${type}:${config.autoWarn[type] ? 'ON' : 'OFF'}`).join(' | ');
            return sock.sendMessage(chatId, { text: `Auto-warning: ${types}\nCustom words: ${config.words.join(', ') || 'none'}\nHar text par warning nahi hoti; word toggle sirf admin-added words par chalega.` }, { quoted: msg });
        }
        if (kind === 'word' && ['add','remove','del'].includes(mode)) {
            const word = args.slice(2).join(' ').trim().toLocaleLowerCase().slice(0, 40);
            if (!word) return sock.sendMessage(chatId, { text: 'Istemaal: .autowarn word add/remove <lafz>' }, { quoted: msg });
            if (mode === 'add') {
                if (!config.words.includes(word) && config.words.length >= 30) return sock.sendMessage(chatId, { text: 'Zyada se zyada 30 custom lafz rakhe ja sakte hain.' }, { quoted: msg });
                if (!config.words.includes(word)) config.words.push(word);
            } else config.words = config.words.filter(item => item !== word);
            save();
            return sock.sendMessage(chatId, { text: `Custom warning lafz ${mode === 'add' ? 'add' : 'remove'} ho gaya: ${word}` }, { quoted: msg });
        }
        if (!AUTO_WARN_TYPES.includes(kind) || !['on','off'].includes(mode)) return sock.sendMessage(chatId, { text: `Istemaal: .autowarn <${AUTO_WARN_TYPES.join('|')}> on/off | .autowarn word add/remove <lafz>` }, { quoted: msg });
        config.autoWarn[kind] = mode === 'on'; save();
        return sock.sendMessage(chatId, { text: `${kind} auto-warning ${mode.toUpperCase()} hai.` }, { quoted: msg });
    }
    if (action === 'warnstatus') return sock.sendMessage(chatId, { text: statusText() }, { quoted: msg });
    if (action === 'warnkick') {
        if (!['on','off'].includes(arg0)) return sock.sendMessage(chatId, { text: 'Istemaal: .warnkick on/off' }, { quoted: msg });
        config.autoKick = arg0 === 'on'; save();
        return sock.sendMessage(chatId, { text: `Limit par group se remove karna ${arg0.toUpperCase()} hai.` }, { quoted: msg });
    }
    if (action === 'warnlimit' || action === 'warnset') {
        const limit = Number(arg0);
        if (!Number.isInteger(limit) || limit < 2 || limit > 10) return sock.sendMessage(chatId, { text: `Istemaal: .${action} <2-10>` }, { quoted: msg });
        config.limit = limit; save();
        return sock.sendMessage(chatId, { text: `Warning limit ${limit} set ho gayi.` }, { quoted: msg });
    }
    if (action === 'warnclear') { data.warningCounts[chatId] = {}; save(); return sock.sendMessage(chatId, { text: 'Is group ke tamam warning counts clear kar diye.' }, { quoted: msg }); }
    if (action === 'warnlist') {
        const rows = Object.entries(counts).filter(([, count]) => count > 0).sort((a,b) => b[1]-a[1]);
        const text = rows.length ? rows.map(([jid,count],i) => `${i+1}. @${jid.split('@')[0]} — ${count}/${config.limit}`).join('\n') : 'Abhi kisi member ko warning nahi mili.';
        return sock.sendMessage(chatId, { text: `⚠️ *Group Warning List*\n${text}`, mentions: rows.map(([jid]) => jid) }, { quoted: msg });
    }
    if (action === 'warns') {
        if (!target) return sock.sendMessage(chatId, { text: 'Member ko mention karke .warns @user likhein.' }, { quoted: msg });
        return sock.sendMessage(chatId, { text: `@${target.split('@')[0]} ki warnings: ${counts[target] || 0}/${config.limit}`, mentions: [target] }, { quoted: msg });
    }
    if (action === 'warnreset' || action === 'unwarn') {
        if (!target) return sock.sendMessage(chatId, { text: `Member ko mention karein: .${action} @user` }, { quoted: msg });
        if (action === 'warnreset') delete counts[target]; else counts[target] = Math.max(0, (counts[target] || 0) - 1);
        if (!counts[target]) delete counts[target]; save();
        return sock.sendMessage(chatId, { text: action === 'warnreset' ? `@${target.split('@')[0]} ki warnings reset kar di.` : `@${target.split('@')[0]} ki ek warning hata di.`, mentions: [target] }, { quoted: msg });
    }
    if (action === 'warn') {
        if (!config.enabled) return sock.sendMessage(chatId, { text: 'Pehle .warn on se manual warning system enable karein.' }, { quoted: msg });
        if (!target) return sock.sendMessage(chatId, { text: 'Member ko mention karein: .warn @user [wajah]' }, { quoted: msg });
        const count = addWarning(data, chatId, target); save();
        const reason = args.slice(1).filter(x => !/^@/.test(x)).join(' ').trim();
        await sock.sendMessage(chatId, { text: `⚠️ @${target.split('@')[0]} ko warning mili (${count}/${config.limit}).${reason ? `\nWajah: ${reason}` : ''}\n${randomWarningLine()}`, mentions: [target] }, { quoted: msg });
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
warningsCommand.autoWarningType = autoWarningType;
warningsCommand.applyAutoWarning = applyAutoWarning;
warningsCommand.AUTO_WARN_TYPES = AUTO_WARN_TYPES;
warningsCommand.WARNING_LINES = WARNING_LINES;
warningsCommand.isSingleEmoji = isSingleEmoji;
module.exports = warningsCommand;
