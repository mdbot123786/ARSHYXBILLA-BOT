'use strict';

const fs = require('fs');
const path = require('path');
const settings = require('../settings');

const sections = [
    { key: 'automation', label: '⚙️ 𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍', entries: [
        '.autoread on/off', '.status on/off', '.status seen on/off', '.status like on/off', '.autoreacts on/off',
        '.presencecard offline|busy|online|off', '.groupcard status'
    ], note: 'Presence cards work in private chats while the bot session is connected; configured offline/busy modes are manual auto-replies.' },
    { key: 'downloadmenu', label: '📥 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃', entries: [
        '.video <name/link>', '.insta <link>', '.tiktok <link>', '.facebook <link>', '.youtube <link>',
        '.spotify <name/link>', '.gdrive <link>', '.mediafire <link>', '.reddit <subreddit/post>'
    ] },
    { key: 'stickermenu', label: '🎨 𝐒𝐓𝐈𝐂𝐊𝐄𝐑', entries: [
        '.sticker', '.toimg', '.tomp3', '.tts <text>', '.blur', '.invert', '.crop', '.flip', '.grayscale', '.enlarge'
    ] },
    { key: 'groupmenu', label: '👥 𝐆𝐑𝐎𝐔𝐏', entries: [
        '.kick @user', '.add <number>', '.promote @user', '.demote @user', '.mute', '.unmute', '.tagall [text]',
        '.hidetag [text]', '.tagadmin [text]', '.grouplink', '.groupinfo', '.invite', '.revoke', '.leave',
        '.join <group link>', '.setdesc <text>', '.setppgc', '.getbio [@user]', '.getdp [@user]', '.listonline',
        '.poll <question>', '.mention @user', '.tagme', '.accept'
    ] },
    { key: 'cardmenu', label: '🖤 𝐂𝐀𝐑𝐃𝐒', entries: [
        '.groupcard welcome on/off', '.groupcard goodbye on/off', '.groupcard admin on/off', '.groupcard status', '.adminmsg <text>',
        '.presencecard offline|busy|online|off'
    ], note: 'Welcome/goodbye/admin cards work in groups only. WhatsApp Channel subscriber join/leave events are not exposed through this bot interface.' },
    { key: 'warningsmenu', label: '⚠️ 𝐖𝐀𝐑𝐍𝐈𝐍𝐆𝐒', entries: [
        '.warn on/off', '.warn @user [reason]', '.warnlist', '.warns @user', '.unwarn @user', '.warnreset @user',
        '.warnclear', '.warnlimit <2-10>', '.warnkick on/off', '.warnstatus'
    ] },
    { key: 'spammenu', label: '📨 𝐒𝐏𝐀𝐌', entries: [
        '.antispam on/off', '.antiflood on/off', '.spam status'
    ], note: 'Anti-spam deletes detected bursts of repeated messages; the bot needs permission to delete messages.' },
    { key: 'antimenu', label: '🛡️ 𝐀𝐍𝐓𝐈', entries: [
        '.antilink on/off', '.antistatus on/off', '.anticall on/off', '.antidelete on/off', '.antibug on/off'
    ] },
    { key: 'ownermenu', label: '👑 𝐎𝐖𝐍𝐄𝐑', entries: [
        '.owner', '.prefix', '.public', '.private', '.mode <public|private>', '.setname <name>', '.block <number>',
        '.unblock <number>', '.restart', '.shutdown', '.deleteall <count>', '.clone <number>', '.snipe', '.forward <number>', '.send <number> <text>'
    ] },
    { key: 'toolsmenu', label: '🛠️ 𝐓𝐎𝐎𝐋𝐒', entries: [
        '.ping', '.dp [@user]', '.translate <text> <language>', '.calc <expression>', '.qr <text>', '.shorturl <url>',
        '.weather <city>', '.github <username>', '.ipinfo <public IP>', '.whois <domain>', '.dnslookup <domain>',
        '.define <word>', '.fakeinfo', '.screenshot <url>', '.react <emoji>', '.editmsg <text>', '.portscan <host>'
    ] },
    { key: 'searchmenu', label: '🔎 𝐒𝐄𝐀𝐑𝐂𝐇', entries: [
        '.google <query>', '.gsearch <query>', '.wiki <query>', '.yts <query>', '.playstore <query>', '.npm <package>', '.lyrics <song>', '.reddit <subreddit/post>'
    ] },
    { key: 'funmenu', label: '🎭 𝐅𝐔𝐍', entries: [
        '.joke', '.meme', '.poetry', '.shayari', '.quote', '.fact', '.dare', '.truth', '.ascii <text>', '.roast', '.compliment'
    ] },
    { key: 'gamemenu', label: '🎮 𝐆𝐀𝐌𝐄', entries: [
        '.coinflip', '.roll [sides]', '.riddle', '.trivia', '.wouldyourather'
    ] },
    { key: 'hackmenu', label: '💻 𝐇𝐀𝐂𝐊 𝐀𝐍𝐈𝐌𝐀𝐓𝐈𝐎𝐍', entries: ['.hack'], note: 'Text-only pretend terminal animation for fun; it does not access or hack any system.' },
    { key: 'convertmenu', label: '🔄 𝐂𝐎𝐍𝐕𝐄𝐑𝐓', entries: [
        '.base64 <text>', '.binary <text>', '.hex <text>', '.morse <text>', '.toimg', '.tomp3', '.translate <text> <language>', '.tts <text>'
    ] },
    { key: 'logomenu', label: '✨ 𝐋𝐎𝐆𝐎', entries: [] },
    { key: 'animemenu', label: '🎌 𝐀𝐍𝐈𝐌𝐄', entries: ['.anime <title>', '.manga <title>'] },
    { key: 'utilitymenu', label: '📌 𝐔𝐓𝐈𝐋𝐈𝐓𝐘', entries: [
        '.uptime', '.runtime', '.serverinfo', '.device', '.timer <duration> [text]', '.remind <duration> <text>',
        '.password [length]', '.crypto [coin]', '.quran <number>', '.hadith <query>', '.prayer <city>', '.qibla <location>', '.asmaulhusna [number]'
    ] },
    { key: 'settingsmenu', label: '⚙️ 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒', entries: [
        '.autoread on/off', '.status on/off', '.status seen on/off', '.status like on/off', '.autoreacts on/off',
        '.presencecard offline|busy|online|off', '.groupcard welcome on/off', '.groupcard goodbye on/off',
        '.groupcard admin on/off', '.groupcard status', '.antispam on/off', '.antilink on/off', '.antistatus on/off',
        '.anticall on/off', '.antidelete on/off', '.antibug on/off'
    ] },
];

function getSection(key) { return sections.find(section => section.key === key); }
function renderMainMenu() {
    let text = `╭━━━━━━━━━━━━━━━━━━━━━━╮\n⚡ 𝐀𝐑𝐒𝐇𝐘 𝐁𝐎𝐓\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    sections.forEach((section, index) => {
        const connector = index === 0 ? '┏━━' : index === sections.length - 1 ? '┗━━' : '┣━━';
        text += `${connector}「 ${section.label} 」 — .${section.key}\n`;
    });
    text += `\n📢 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 𝐋𝐈𝐍𝐊\n${settings.whatsappChannel}\n\n`;
    text += `👥 𝐆𝐑𝐎𝐔𝐏 𝟏\n${settings.whatsappGroups[0] || 'Not configured'}\n\n`;
    text += `👥 𝐆𝐑𝐎𝐔𝐏 𝟐\n${settings.whatsappGroups[1] || 'Not configured'}\n\n`;
    return text + `╭━━━━━━━━━━━━━━━━━━━━━━╮\nᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐀𝐑𝐒𝐇𝐘\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;
}
function renderSectionMenu(key) {
    const section = getSection(key);
    if (!section) return `Unknown menu: ${key}`;
    let text = `╭━━━━━━━━〔 ${section.label} 〕━━━━━━━━╮\n\n`;
    for (const command of section.entries) text += `│ ◈ ${command}\n`;
    if (!section.entries.length) text += `│ No active commands.\n`;
    text += `\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
    if (section.note) text += `\n\n${section.note}`;
    return `${text}\n\n⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐑𝐒𝐇𝐘`;
}
function renderAllMenu() {
    let text = `╭━━━━━━━━〔 𝐀𝐑𝐒𝐇𝐘 𝐁𝐎𝐓 — COMMAND INDEX 〕━━━━━━━━╮\n`;
    for (const section of sections) {
        text += `\n┏━━「 ${section.label} 」━━┓\n`;
        for (const command of section.entries) text += `│ ◈ ${command}\n`;
        if (!section.entries.length) text += `│ No active commands.\n`;
    }
    return `${text}\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐑𝐒𝐇𝐘`;
}
async function sendMainMenu(sock, from, msg) {
    const caption = renderMainMenu();
    const imagePath = path.join(__dirname, '..', 'public', 'assets', 'start-image.jpg');
    try {
        if (fs.existsSync(imagePath)) return await sock.sendMessage(from, { image: { url: imagePath }, caption }, { quoted: msg });
        return await sock.sendMessage(from, { image: { url: settings.startimage }, caption }, { quoted: msg });
    } catch { return sock.sendMessage(from, { text: caption }, { quoted: msg }); }
}
async function sendSectionMenu(sock, from, msg, key) { return sock.sendMessage(from, { text: renderSectionMenu(key) }, { quoted: msg }); }
async function sendAllMenu(sock, from, msg) { return sock.sendMessage(from, { text: renderAllMenu() }, { quoted: msg }); }
module.exports = { sections, getSection, renderMainMenu, renderSectionMenu, renderAllMenu, sendMainMenu, sendSectionMenu, sendAllMenu };
