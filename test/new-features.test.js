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
  const sock=fakeSocket(); await hack(sock,'chat',{}); assert.match(sock.sent[0][1].text,/HACK ANIMATION/); assert.match(sock.sent[0][1].text,/koi system access ya hacking nahi hui/);
  const indexed=fakeSocket(); await hack(indexed,'chat',{},'5'); assert.match(indexed.sent[0][1].text,/HACK ANIMATION 5\/20/);
  const invalid=fakeSocket(); await hack(invalid,'chat',{},'21'); assert.match(invalid.sent[0][1].text,/1 se 20/);
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

test('auto-warning exposes ten admin-controlled triggers and only flags configured content', async () => {
  const data={}; let saves=0; const sock=fakeSocket(); const group='group@g.us'; const jid='111@s.whatsapp.net';
  const {config}=warnings.getSettings(data,group);
  assert.equal(warnings.AUTO_WARN_TYPES.length,10);
  await warnings(sock,group,{},'autowarn',['image','on'],true,data,()=>saves++);
  assert.equal(config.autoWarn.image,true);
  config.autoWarn.word=true; config.words.push('badword');
  assert.equal(warnings.autoWarningType({imageMessage:{}},'',config),'image');
  assert.equal(warnings.autoWarningType({conversation:'badword here'},'badword here',config),'word');
  assert.equal(warnings.autoWarningType({conversation:'ordinary hello'},'ordinary hello',config),null);
  assert.equal(await warnings.applyAutoWarning(sock,group,{},jid,{imageMessage:{}},'',false,data,()=>saves++),true);
  assert.equal(data.warningCounts[group][jid],1);
  const prior=data.warningCounts[group][jid];
  assert.equal(await warnings.applyAutoWarning(sock,group,{},jid,{imageMessage:{}},'',true,data,()=>saves++),false);
  assert.equal(data.warningCounts[group][jid],prior);
  assert.ok(saves>=2);
});

test('group join/leave events send DP cards with member number, group count and mention', async () => {
  const sock=fakeSocket(); sock.profilePictureUrl=async jid=>`https://cdn.example/${jid}.jpg`;
  sock.groupMetadata=async()=>({subject:'Test group',participants:[{id:'42@s.whatsapp.net'},{id:'99@s.whatsapp.net'}]});
  const jid='42@s.whatsapp.net', group='test@g.us', settings={[group]:{welcome:true,goodbye:true}}, counts={};
  assert.equal(await cards.handleParticipantUpdate(sock,{id:group,action:'add',participants:[jid]},settings,counts),1);
  const welcome=sock.sent.at(-1)[1]; assert.ok(welcome.image); assert.match(welcome.caption,/User No: 1/); assert.match(welcome.caption,/Total Members: 2/); assert.deepEqual(welcome.mentions,[jid]);
  assert.equal(await cards.handleParticipantUpdate(sock,{id:group,action:'remove',participants:[jid]},settings,counts),1);
  const goodbye=sock.sent.at(-1)[1]; assert.ok(goodbye.image); assert.match(goodbye.caption,/Remaining Members: 1/); assert.deepEqual(goodbye.mentions,[jid]);
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
