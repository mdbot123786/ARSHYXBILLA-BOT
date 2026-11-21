'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const settings = require('../settings');
const menu = require('../commands/menuCatalog');
const prefixCommand = require('../commands/prefix');

function fakeSocket() {
    const sent = [];
    return { sent, sendMessage: async (...args) => { sent.push(args); return {}; } };
}

test('main menu follows the requested ARSHY sections and includes the supplied social links', () => {
    const text = menu.renderMainMenu();
    for (const label of ['𝐀𝐑𝐒𝐇𝐘 𝐁𝐎𝐓', '𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍', '𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃', '𝐒𝐓𝐈𝐂𝐊𝐄𝐑', '𝐆𝐑𝐎𝐔𝐏', '𝐎𝐖𝐍𝐄𝐑', '𝐓𝐎𝐎𝐋𝐒', '𝐒𝐄𝐀𝐑𝐂𝐇', '𝐀𝐈', '𝐅𝐔𝐍', '𝐆𝐀𝐌𝐄', '𝐂𝐎𝐍𝐕𝐄𝐑𝐓', '𝐋𝐎𝐆𝐎', '𝐀𝐍𝐈𝐌𝐄', '𝐔𝐓𝐈𝐋𝐈𝐓𝐘', '𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒']) assert.ok(text.includes(label), `missing ${label}`);
    assert.ok(text.includes(settings.whatsappChannel));
    for (const url of settings.whatsappGroups) assert.ok(text.includes(url));
});

test('automation menu contains the requested toggles, descriptions, and cooldown note', () => {
    const text = menu.renderSectionMenu('automation');
    for (const command of ['.autoread on/off', '.status on/off', '.autoreacts on/off', '.presencecard offline|busy|online|off', '.groupcard welcome on/off', '.groupcard goodbye on/off', '.groupcard admin on/off', '.adminmsg <text>', '.groupcard status', '.antidelete on/off']) assert.ok(text.includes(command), `missing ${command}`);
    assert.match(text, /private chats/i);
    assert.match(text, /20-minute per-chat cooldown/i);
    assert.match(text, /group admin/i);
});

test('all menu omits disabled/stub handlers and logo section explains no generator is configured', () => {
    const text = menu.renderAllMenu();
    for (const command of ['.pinterest', '.twitter', '.binlookup', '.removebg', '.backup', '.restore', '.clear', '.save']) assert.doesNotMatch(text, new RegExp(`\\| ◈ \\${command.replace('.', '\\.')}\\b`));
    assert.match(menu.renderSectionMenu('logomenu'), /No working logo-generation command is configured/);
});

test('main menu sends the supplied local start image', async () => {
    const sock = fakeSocket();
    const imagePath = path.join(__dirname, '..', 'public', 'assets', 'start-image.jpg');
    assert.ok(fs.existsSync(imagePath));
    await menu.sendMainMenu(sock, 'chat@s.whatsapp.net', {});
    assert.equal(sock.sent.length, 1);
    assert.equal(sock.sent[0][1].image.url, imagePath);
});

test('prefix command shows JUTT, owner number, and the supplied local prefix image', async () => {
    const previous = settings.ownerNumber;
    settings.ownerNumber = '+92 300 1234567';
    const sock = fakeSocket();
    try {
        await prefixCommand(sock, 'chat@s.whatsapp.net', {});
        const sent = sock.sent[0][1];
        assert.equal(path.basename(sent.image.url), 'prefix-image.jpg');
        assert.match(sent.caption, /Owner: JUTT/);
        assert.match(sent.caption, /\+923001234567/);
        assert.match(sent.caption, /Prefix: \./);
    } finally {
        settings.ownerNumber = previous;
    }
});
