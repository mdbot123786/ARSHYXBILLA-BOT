'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const settings = require('../settings');
const menu = require('../commands/menuCatalog');
const prefixCommand = require('../commands/prefix');
function fakeSocket() { const sent = []; return { sent, sendMessage: async (...args) => { sent.push(args); return {}; } }; }
test('main menu contains requested useful sections and configured links', () => {
  const text = menu.renderMainMenu();
  for (const label of ['𝐀𝐑𝐒𝐇𝐘 𝐁𝐎𝐓','𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐎𝐍','𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃','𝐒𝐓𝐈𝐂𝐊𝐄𝐑','𝐆𝐑𝐎𝐔𝐏','𝐎𝐖𝐍𝐄𝐑','𝐓𝐎𝐎𝐋𝐒','𝐒𝐄𝐀𝐑𝐂𝐇','𝐅𝐔𝐍','𝐆𝐀𝐌𝐄','𝐂𝐎𝐍𝐕𝐄𝐑𝐓','𝐀𝐍𝐈𝐌𝐄','𝐔𝐓𝐈𝐋𝐈𝐓𝐘','𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒','𝐂𝐀𝐑𝐃𝐒','𝐖𝐀𝐑𝐍𝐈𝐍𝐆𝐒','𝐒𝐏𝐀𝐌','𝐀𝐍𝐓𝐈','𝐇𝐀𝐂𝐊']) assert.ok(text.includes(label), `missing ${label}`);
  assert.ok(text.includes(settings.whatsappChannel));
  for (const url of settings.whatsappGroups) assert.ok(text.includes(url));
});
test('command menus show commands without prose appended to command names', () => {
  const all = menu.renderAllMenu();
  for (const c of ['.groupcard welcome on/off','.warn @user [reason]','.autowarn image on/off','.autowarn video on/off','.autowarn word on/off','.antispam on/off','.antilink on/off','.hack [1-20]','.joke','.meme','.poetry','.vv']) assert.doesNotMatch(all, new RegExp(`\\| ◈ \\${c.replace('.', '\\.')}\\b`));
  for (const line of all.split('\n').filter(l => l.includes('│ ◈ .'))) assert.equal(line.trim().split(/\s+—\s+/).length, 1, line);
  assert.doesNotMatch(all, /\.news\b|\.song\b|\.movie\b|\.apk\b|\.emojimix\b|\.vv\b/);
});
test('automation/card menus contain expected toggles and honest limits', () => {
  const automation = menu.renderSectionMenu('automation');
  for (const c of ['.autoread on/off','.status on/off','.autoreacts on/off','.presencecard offline|busy|online|off','.groupcard status']) assert.ok(automation.includes(c));
  assert.match(automation, /private chats/i); assert.match(automation,/manual away toggle/i); assert.match(automation,/no cooldown/i);
  const cards = menu.renderSectionMenu('cardmenu');
  for (const c of ['.groupcard welcome on/off','.groupcard goodbye on/off','.groupcard admin on/off']) assert.ok(cards.includes(c));
  assert.doesNotMatch(cards,/\.adminmsg\b|\.admin\s*</i);
  assert.doesNotMatch(menu.renderAllMenu(),/api.?key|\.ai\b|openai|gemini/i);
  assert.match(cards, /Channel subscriber join\/leave events are not exposed/i);
  const warnings=menu.renderSectionMenu('warningsmenu'); for(const t of ['image','video','audio','sticker','document','link','word','contact','location','spam','emoji']) assert.ok(warnings.includes(`.autowarn ${t} on/off`));
  for (const c of ['.warnreset @user','.warnclear','.warnset <2-10>']) assert.ok(warnings.includes(c));
});
test('main menu sends local start image', async () => {
  const sock=fakeSocket(), imagePath=path.join(__dirname,'..','public','assets','start-image.jpg');
  assert.ok(fs.existsSync(imagePath)); await menu.sendMainMenu(sock,'chat@s.whatsapp.net',{}); assert.equal(sock.sent[0][1].image.url,imagePath);
});
test('prefix command shows owner name, number and local image', async () => {
  const previous=settings.ownerNumber; settings.ownerNumber='+92 300 1234567'; const sock=fakeSocket();
  try { await prefixCommand(sock,'chat@s.whatsapp.net',{}); const sent=sock.sent[0][1]; assert.equal(path.basename(sent.image.url),'prefix-image.jpg'); assert.match(sent.caption,/Owner: JUTT/); assert.match(sent.caption,/\+923001234567/); assert.match(sent.caption,/Prefix: \./); }
  finally { settings.ownerNumber=previous; }
});
