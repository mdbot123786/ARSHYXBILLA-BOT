'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const hack = require('../commands/hack');
const vv = require('../commands/vv');
const joke = require('../commands/joke');
const meme = require('../commands/meme');
const poetry = require('../commands/poetry');
const warnings = require('../commands/warnings');
const antispam = require('../commands/antispam');
const cards = require('../commands/cards');
function fakeSocket() { const sent=[]; return {sent, sendMessage: async (...args) => {sent.push(args); return {};}, groupParticipantsUpdate: async (...args)=>{sent.push(['groupParticipantsUpdate',...args]);}}; }
test('fun responses are local Roman Urdu and poetry uses Urdu script', async () => {
  assert.ok(joke.jokes.length >= 5 && joke.jokes.every(x => /hai|kyun|kya|mein|ka/i.test(x)));
  assert.ok(meme.memes.length >= 5 && meme.memes.every(x => /Jab|Main|Ammi|Bhai|Aaj|Parhai|Salary|Mehman|Raat/i.test(x)));
  const sock=fakeSocket(); await joke(sock,'chat',{}); assert.match(sock.sent[0][1].text,/Roman Urdu Joke/);
  const poetrySock=fakeSocket(); await poetry(poetrySock,'chat',{}); assert.match(poetrySock.sent[0][1].text,/[\u0600-\u06FF]/);
});
test('hack animation contains exactly twenty harmless local sequences', async () => {
  assert.equal(hack.animations.length,20);
  assert.ok(hack.animations.every(seq => seq.length >= 4));
  assert.doesNotMatch(hack.toString(), /axios|fetch\(|exec\(|child_process|request\(/i);
  const sock=fakeSocket(); await hack(sock,'chat',{}); assert.match(sock.sent[0][1].text,/FAKE HACK ANIMATION/); assert.match(sock.sent[0][1].text,/koi hacking nahi hui/);
});
test('view-once command declines bypass and does not attempt media extraction', async () => {
  const sock=fakeSocket(); await vv(sock,'chat',{message:{viewOnceMessage:{}}});
  assert.match(sock.sent[0][1].text,/bypass/); assert.equal(Object.hasOwn(sock.sent[0][1],'image'),false); assert.equal(Object.hasOwn(sock.sent[0][1],'video'),false);
});
test('warning controls require group admin and warning actions persist group counts', async () => {
  const data={}; let saves=0; const sock=fakeSocket(); const target='12345@s.whatsapp.net';
  await warnings(sock,'group@g.us',{},'warn',['on'],false,data,()=>saves++);
  assert.match(sock.sent.at(-1)[1].text,/admin/i);
  await warnings(sock,'group@g.us',{},'warn',['on'],true,data,()=>saves++);
  const msg={message:{extendedTextMessage:{contextInfo:{mentionedJid:[target]}}}};
  await warnings(sock,'group@g.us',msg,'warn',[target,'please','follow','rules'],true,data,()=>saves++);
  assert.equal(data.warningCounts['group@g.us'][target],1);
  assert.ok(saves >= 2);
  await warnings(sock,'group@g.us',msg,'warns',[],true,data,()=>saves++);
  assert.match(sock.sent.at(-1)[1].text,/1\/3/);
});
test('anti-spam only flags repeated bursts after configured threshold', async () => {
  const data={}; const config=antispam.getSettings(data,'group@g.us'); config.enabled=true;
  assert.equal(antispam.recordBurst(data,'group@g.us','user',1000),false);
  assert.equal(antispam.recordBurst(data,'group@g.us','user',1100),false);
  assert.equal(antispam.recordBurst(data,'group@g.us','user',1200),false);
  assert.equal(antispam.recordBurst(data,'group@g.us','user',1300),false);
  assert.equal(antispam.recordBurst(data,'group@g.us','user',1400),true);
  assert.equal(antispam.recordBurst(data,'group@g.us','user',10000),false);
});
test('cards render join/leave counts and place admin text inside the card', () => {
  const welcome=cards.render('welcome',{mention:'@Sara',count:7,members:15,time:'12:34'});
  assert.match(welcome,/User: @Sara/); assert.match(welcome,/User No: 7/); assert.match(welcome,/Total Members: 15/);
  const goodbye=cards.render('goodbye',{mention:'@Sara',count:7,members:14,time:'12:35'});
  assert.match(goodbye,/Member No: 7/); assert.match(goodbye,/Remaining Members: 14/);
  const admin=cards.render('admin',{mention:'@Admin',group:'Team',message:'Please read the new rules'});
  assert.ok(admin.indexOf('Please read the new rules') > admin.indexOf('𝐀𝐃𝐌𝐈𝐍 𝐌𝐄𝐒𝐒𝐀𝐆𝐄')); 
  assert.equal(cards.cleanText('a\u0000b'), 'a b');
});
