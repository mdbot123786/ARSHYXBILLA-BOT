'use strict';

const fs = require('fs');
const path = require('path');
const settings = require('../settings');

const sections = [
    {
        key: 'automation', label: '⚙️ 𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍', title: 'AUTOMATION',
        entries: [
            ['.autoread on/off', 'Enable or disable automatic read receipts. Owner/session owner only.'],
            ['.status on/off', 'Enable or disable status processing and auto-viewing. Owner/session owner only.'],
            ['.status seen on/off', 'Toggle automatic status viewing while status processing is enabled.'],
            ['.status like on/off', 'Toggle automatic emoji reactions to statuses while processing is enabled.'],
            ['.autoreacts on/off', 'Enable or disable automatic emoji reactions. Owner/session owner only.'],
            ['.presencecard offline|busy|online|off', 'Private-chat availability auto-replies; one reply per chat per 20 minutes.'],
            ['.groupcard welcome on/off', 'Toggle group join cards. Group admin only; bot needs sufficient group permissions.'],
            ['.groupcard goodbye on/off', 'Toggle group leave cards. Group admin only; bot needs sufficient group permissions.'],
            ['.groupcard admin on/off', 'Toggle automatic cards for group-admin messages. Group admin only.'],
            ['.adminmsg <text>', 'Send one admin announcement card in the current group. Group admin only.'],
            ['.groupcard status', 'Show the current group-card settings. Run inside a group.'],
            ['.antilink on/off', 'Toggle group link protection. Group admin only.'],
            ['.antistatus on/off', 'Toggle anti-status/forwarded-status protection in a group. Group admin only.'],
            ['.anticall on/off', 'Toggle call handling protection. Requires bot owner/session owner.'],
            ['.antidelete on/off', 'Toggle deleted-message reports. Owner/session owner only; reports are sent privately to the bot account.']
        ],
        note: '⚠️ For reliable welcome/goodbye delivery, make the bot a group admin; group permissions can restrict non-admins. Presence cards reply only in private chats and have a 20-minute per-chat cooldown.'
    },
    {
        key: 'downloadmenu', label: '📥 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃', title: 'DOWNLOAD',
        entries: [
            ['.song <name/link>', 'Find a song and request its audio download.'],
            ['.video <name/link>', 'Find a YouTube video and request its MP4 download.'],
            ['.insta <link>', 'Download supported public Instagram media.'],
            ['.tiktok <link>', 'Download supported TikTok media.'],
            ['.facebook <link>', 'Download supported public Facebook media.'],
            ['.youtube <link>', 'Fetch supported YouTube media information/downloads.'],
            ['.spotify <name/link>', 'Look up a Spotify track and use the available download provider.'],
            ['.gdrive <link>', 'Download a publicly accessible Google Drive file.'],
            ['.mediafire <link>', 'Download a publicly accessible MediaFire file.'],
            ['.apk <app name/link>', 'Search for an Android application package.'],
            ['.reddit <subreddit/post>', 'Fetch supported public Reddit content.']
        ], note: 'Download providers may be unavailable or restrict some links; the bot reports provider failures rather than guaranteeing every download.'
    },
    {
        key: 'stickermenu', label: '🎨 𝐒𝐓𝐈𝐂𝐊𝐄𝐑', title: 'STICKER & MEDIA',
        entries: [
            ['.sticker', 'Reply to a still image to create a sticker. Video-to-sticker is not supported here.'],
            ['.toimg', 'Reply to a sticker to convert it to an image.'],
            ['.tomp3', 'Reply to audio or video to extract/convert its sound to MP3.'],
            ['.tts <text>', 'Create spoken audio from text.'],
            ['.vv', 'Retrieve supported view-once media from a quoted message.'],
            ['.blur', 'Apply a blur effect to a replied-to image.'],
            ['.invert', 'Invert the colours of a replied-to image.'],
            ['.crop', 'Crop a replied-to image to a square.'],
            ['.flip', 'Flip a replied-to image.'],
            ['.grayscale', 'Convert a replied-to image to grayscale.'],
            ['.enlarge', 'Resize/enlarge a replied-to image.']
        ], note: 'Media commands generally require a reply to the image, sticker, audio, or video they should process.'
    },
    {
        key: 'groupmenu', label: '👥 𝐆𝐑𝐎𝐔𝐏', title: 'GROUP',
        entries: [
            ['.kick @user', 'Remove a participant. Group admin and bot admin required.'],
            ['.add <number>', 'Add a participant where WhatsApp permits it. Group admin and bot admin required.'],
            ['.promote @user', 'Promote a participant. Group admin and bot admin required.'],
            ['.demote @user', 'Demote a participant. Group admin and bot admin required.'],
            ['.mute', 'Change the group to announcement-only mode. Group admin and bot admin required.'],
            ['.unmute', 'Allow all participants to send messages. Group admin and bot admin required.'],
            ['.tagall [text]', 'Mention all group participants. Group admin only.'],
            ['.hidetag [text]', 'Send a message mentioning all participants without listing names. Group admin only.'],
            ['.tagadmin [text]', 'Mention group admins. Run inside a group.'],
            ['.grouplink', 'Show the group invite link. Group admin only.'],
            ['.groupinfo', 'Show basic group information.'],
            ['.invite', 'Show the current group invite link. Group admin only.'],
            ['.revoke', 'Revoke and rotate the current group invite link. Group admin only.'],
            ['.leave', 'Make the bot leave this group. Group admin only.'],
            ['.join <WhatsApp group link>', 'Join a group using its invite link; owner/session owner only.'],
            ['.setdesc <text>', 'Update the group description. Group admin and bot admin required.'],
            ['.setppgc', 'Set the group photo using a replied-to image. Group admin and bot admin required.'],
            ['.getbio [@user]', 'Show the selected participant’s WhatsApp bio when available.'],
            ['.getdp [@user]', 'Show the selected participant’s profile picture when available.'],
            ['.listonline', 'Show the current group participant roster; WhatsApp does not expose reliable live online presence here.'],
            ['.poll <question>', 'Create a poll in the current chat.'],
            ['.mention @user', 'Mention a selected participant.'],
            ['.tagme', 'Mention your own WhatsApp account.'],
            ['.accept', 'Accept a pending group invite where available.']
        ], note: 'Administrative actions require the correct group permissions. The bot must also be a group admin for actions that WhatsApp restricts to admins.'
    },
    {
        key: 'ownermenu', label: '👑 𝐎𝐖𝐍𝐄𝐑', title: 'OWNER',
        entries: [
            ['.owner', 'Show the configured bot owner contact.'],
            ['.prefix', 'Show bot details, owner name/number, and the bot profile image.'],
            ['.public', 'Set whether the bot responds publicly. Owner/session owner only.'],
            ['.private', 'Restrict bot responses to authorized users. Owner/session owner only.'],
            ['.mode <public|private>', 'Set bot response mode. Owner/session owner only.'],
            ['.setname <name>', 'Set the bot’s WhatsApp profile name. Owner/session owner only.'],
            ['.block <number>', 'Block a WhatsApp number. Owner/session owner only.'],
            ['.unblock <number>', 'Unblock a WhatsApp number. Owner/session owner only.'],
            ['.restart', 'Restart the bot process. Owner/session owner only.'],
            ['.shutdown', 'Stop the bot process. Owner/session owner only.'],
            ['.deleteall <count>', 'Delete a specified number of eligible bot messages. Owner/session owner only.'],
            ['.clone <number>', 'Request a separate pairing/session for a clone. Owner/session owner only.'],
            ['.snipe', 'Show the latest captured deleted message after anti-delete is enabled. Owner/session owner only.'],
            ['.forward <number>', 'Forward a replied-to message to a number. Owner/session owner only.'],
            ['.send <number> <text>', 'Send one text message to a number. Owner/session owner only.']
        ], note: 'Owner/session-owner commands are sensitive. Backup/restore are not listed because this project does not currently provide a working secure restore flow.'
    },
    {
        key: 'toolsmenu', label: '🛠️ 𝐓𝐎𝐎𝐋𝐒', title: 'TOOLS',
        entries: [
            ['.ping', 'Measure a quick bot response round-trip (not a network speed test).'],
            ['.dp [@user]', 'Show a WhatsApp profile picture when the account permits it.'],
            ['.translate <text> <language>', 'Translate text; you can also reply to a message with .translate <language>.'],
            ['.calc <expression>', 'Evaluate a basic arithmetic expression.'],
            ['.qr <text>', 'Create a QR code from text or a link.'],
            ['.shorturl <url>', 'Create a short link using the configured public shortener.'],
            ['.weather <city>', 'Look up current weather for a city.'],
            ['.github <username>', 'Show public GitHub profile information.'],
            ['.ipinfo <public IP>', 'Look up public IP geolocation information.'],
            ['.whois <domain>', 'Look up public domain registration information.'],
            ['.dnslookup <domain>', 'Look up public DNS records.'],
            ['.define <word>', 'Look up an English word definition.'],
            ['.tempmail', 'Create/check a temporary inbox in a private chat only; do not use it for sensitive accounts.'],
            ['.fakeinfo', 'Generate fictional sample details; this is not identity verification or real personal data.'],
            ['.screenshot <url>', 'Request a webpage screenshot from the configured screenshot provider.'],
            ['.react <emoji>', 'React to the command message or a replied-to message.'],
            ['.editmsg <text>', 'Reply to a message sent by this bot to request an edit; WhatsApp may restrict edits.'],
            ['.portscan <host>', 'Owner-only port check; scan only systems you own or are authorized to test.']
        ], note: 'Public lookup tools depend on third-party providers and may return incomplete or unavailable results.'
    },
    {
        key: 'searchmenu', label: '🔎 𝐒𝐄𝐀𝐑𝐂𝐇', title: 'SEARCH',
        entries: [
            ['.google <query>', 'Search the web for a query.'],
            ['.gsearch <query>', 'Alias for Google web search.'],
            ['.wiki <query>', 'Search Wikipedia for a topic.'],
            ['.yts <query>', 'Search YouTube for videos.'],
            ['.playstore <query>', 'Search Google Play for apps.'],
            ['.npm <package>', 'Look up an npm package.'],
            ['.news [topic]', 'Fetch a recent news digest.'],
            ['.movie <title>', 'Look up a film title.'],
            ['.lyrics <song>', 'Search for song lyrics.'],
            ['.reddit <subreddit/post>', 'Fetch supported public Reddit content.']
        ], note: 'Search results come from external services and may change or become unavailable.'
    },
    {
        key: 'aimenu', label: '🤖 𝐀𝐈', title: 'AI',
        entries: [
            ['.ai <question>', 'Ask the configured AI model a question.'],
            ['.chatbot on/off', 'Toggle AI auto-replies in private chats for this session; owner/session owner only.']
        ], note: 'AI responses can be inaccurate; verify important information independently.'
    },
    {
        key: 'funmenu', label: '🎭 𝐅𝐔𝐍', title: 'FUN',
        entries: [
            ['.joke', 'Get a joke.'], ['.meme', 'Fetch a meme from the configured source.'],
            ['.dare', 'Get a dare prompt.'], ['.truth', 'Get a truth prompt.'],
            ['.gali <name/@user>', 'Generate explicit insult/banter text; use only with consenting friends.'], ['.ascii <text>', 'Render text as ASCII art.'],
            ['.roast', 'Get a playful roast.'], ['.compliment', 'Get a compliment.'],
            ['.ship @user', 'Generate a playful compatibility result; it is only for fun.'],
            ['.emojimix', 'Create a supported emoji mix.'], ['.character', 'Get a random character result.'],
            ['.quote', 'Get a quote from the configured source.'], ['.fact', 'Get a random fact from the configured source.']
        ], note: 'Entertainment outputs are generated for fun and should not be treated as factual personal assessments.'
    },
    {
        key: 'gamemenu', label: '🎮 𝐆𝐀𝐌𝐄', title: 'GAME',
        entries: [
            ['.coinflip', 'Flip a coin.'], ['.roll [NdM]', 'Roll a validated dice expression.'],
            ['.riddle', 'Get a riddle.'], ['.trivia', 'Get a trivia question.'],
            ['.wouldyourather', 'Get a “would you rather” prompt.'],
            ['.wyr', 'Alias for a “would you rather” prompt.']
        ], note: 'Game results are for entertainment only.'
    },
    {
        key: 'convertmenu', label: '🔄 𝐂𝐎𝐍𝐕𝐄𝐑𝐓', title: 'CONVERT',
        entries: [
            ['.base64 <text>', 'Encode/decode supported Base64 text.'],
            ['.binary <text>', 'Encode text as binary.'], ['.hex <text>', 'Encode text as hexadecimal.'],
            ['.morse <text>', 'Encode text as Morse code.'], ['.toimg', 'Convert a replied-to sticker to an image.'],
            ['.tomp3', 'Convert replied-to audio/video sound into an MP3 file.'],
            ['.translate <text> <language>', 'Translate text into a target language.'],
            ['.tts <text>', 'Convert text to spoken audio.']
        ], note: 'Encoding commands convert the input text only; they do not encrypt it.'
    },
    {
        key: 'logomenu', label: '✨ 𝐋𝐎𝐆𝐎', title: 'LOGO',
        entries: [], note: 'No working logo-generation command is configured in this project; no logo commands are advertised.'
    },
    {
        key: 'animemenu', label: '🎌 𝐀𝐍𝐈𝐌𝐄', title: 'ANIME',
        entries: [
            ['.anime <title>', 'Search for anime information.'], ['.manga <title>', 'Search for manga information.'],
            ['.character', 'Get a random character result.']
        ], note: 'Anime and manga results depend on external catalog providers.'
    },
    {
        key: 'utilitymenu', label: '📌 𝐔𝐓𝐈𝐋𝐈𝐓𝐘', title: 'UTILITY',
        entries: [
            ['.uptime', 'Show how long this bot process has been running.'],
            ['.runtime', 'Alias for uptime.'],
            ['.serverinfo', 'Show basic server operating-system and hardware information.'],
            ['.device', 'Show basic bot/device information.'],
            ['.timer <duration> [text]', 'Set a validated timer reminder.'],
            ['.remind <duration> <text>', 'Set a validated reminder in the current chat.'],
            ['.password [length]', 'Generate a random password; use privately and store it securely.'],
            ['.pass [length]', 'Alias for random password generation.'],
            ['.crypto [coin]', 'Look up the current USD quote for a cryptocurrency.'],
            ['.quran <number>', 'Fetch a validated Quran verse/reference.'],
            ['.hadith <query>', 'Fetch a hadith from the configured source.'],
            ['.prayer <city>', 'Look up prayer times for a location.'],
            ['.qibla <location>', 'Look up Qibla direction information.'],
            ['.asmaulhusna [number]', 'Fetch a name from the configured Asmaul Husna source.']
        ], note: 'Religious references and location-based results depend on their data providers; verify important details.'
    },
    {
        key: 'settingsmenu', label: '⚙️ 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒', title: 'SETTINGS & PROTECTION',
        entries: [
            ['.autoread on/off', 'Automatic read receipts; owner/session owner only.'],
            ['.status on/off', 'Status handling/auto-view; owner/session owner only.'],
            ['.status seen on/off / .status like on/off', 'Control status views and emoji reactions while status processing is enabled.'],
            ['.autoreacts on/off', 'Automatic reactions; owner/session owner only.'],
            ['.presencecard offline|busy|online|off', 'Private-chat auto-replies with a 20-minute per-chat cooldown.'],
            ['.groupcard <welcome|goodbye|admin> <on|off>', 'Group card settings; group admin only.'],
            ['.groupcard status', 'Show current group card settings.'],
            ['.antilink on/off', 'Group link protection; group admin only.'],
            ['.antistatus on/off', 'Group anti-status protection; group admin only.'],
            ['.anticall on/off', 'Call protection setting; owner/session owner only.'],
            ['.antidelete on/off', 'Deleted-message reports; owner/session owner only.'],
            ['.public / .private', 'Set bot response mode; owner/session owner only.']
        ], note: 'Only commands wired to active handlers are listed. Permission checks still apply when you run them.'
    }
];

function getSection(key) {
    return sections.find(section => section.key === key);
}

function renderMainMenu() {
    let text = `╭━━━━━━━━━━━━━━━━━━━━━━╮\n⚡ 𝐀𝐑𝐒𝐇𝐘 𝐁𝐎𝐓\n╰━━━━━━━━━━━━━━━━━━━━━━╯\n\n`;
    sections.forEach((section, index) => {
        const connector = index === 0 ? '┏━━' : (index === sections.length - 1 ? '┗━━' : '┣━━');
        text += `${connector}「 ${section.label} 」 — .${section.key}\n`;
    });
    text += `\n📢 𝐂𝐇𝐀𝐍𝐍𝐄𝐋 𝐋𝐈𝐍𝐊\n${settings.whatsappChannel}\n\n`;
    text += `👥 𝐆𝐑𝐎𝐔𝐏 𝟏\n${settings.whatsappGroups[0] || 'Not configured'}\n\n`;
    text += `👥 𝐆𝐑𝐎𝐔𝐏 𝟐\n${settings.whatsappGroups[1] || 'Not configured'}\n\n`;
    text += `╭━━━━━━━━━━━━━━━━━━━━━━╮\nᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐀𝐑𝐒𝐇𝐘\n╰━━━━━━━━━━━━━━━━━━━━━━╯`;
    return text;
}

function renderSectionMenu(key) {
    const section = getSection(key);
    if (!section) return `Unknown menu: ${key}`;
    let text = `╭━━━━━━━━〔 ${section.label} 〕━━━━━━━━╮\n\n`;
    if (section.entries.length) {
        for (const [command, description] of section.entries) text += `│ ◈ ${command}\n│   ${description}\n`;
    } else {
        text += `│ ${section.note}\n`;
    }
    text += `\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯`;
    if (section.note && section.entries.length) text += `\n\n${section.note}`;
    text += `\n\n⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐑𝐒𝐇𝐘`;
    return text;
}

function renderAllMenu() {
    let text = `╭━━━━━━━━〔 𝐀𝐑𝐒𝐇𝐘 𝐁𝐎𝐓 — COMMAND INDEX 〕━━━━━━━━╮\n`;
    for (const section of sections) {
        text += `\n┏━━「 ${section.label} 」━━┓\n`;
        if (section.entries.length) {
            for (const [command, description] of section.entries) text += `│ ◈ ${command} — ${description}\n`;
        } else {
            text += `│ ${section.note}\n`;
        }
    }
    text += `\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐀𝐑𝐒𝐇𝐘`;
    return text;
}

async function sendMainMenu(sock, from, msg) {
    const caption = renderMainMenu();
    const imagePath = path.join(__dirname, '..', 'public', 'assets', 'start-image.jpg');
    try {
        if (fs.existsSync(imagePath)) return await sock.sendMessage(from, { image: { url: imagePath }, caption }, { quoted: msg });
        return await sock.sendMessage(from, { image: { url: settings.startimage }, caption }, { quoted: msg });
    } catch {
        return sock.sendMessage(from, { text: caption }, { quoted: msg });
    }
}

async function sendSectionMenu(sock, from, msg, key) {
    return sock.sendMessage(from, { text: renderSectionMenu(key) }, { quoted: msg });
}

async function sendAllMenu(sock, from, msg) {
    return sock.sendMessage(from, { text: renderAllMenu() }, { quoted: msg });
}

module.exports = { sections, getSection, renderMainMenu, renderSectionMenu, renderAllMenu, sendMainMenu, sendSectionMenu, sendAllMenu };
