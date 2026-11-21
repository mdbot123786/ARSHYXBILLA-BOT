'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const statusCommand = require('../commands/status');
const { autoreadCommand } = require('../commands/autoread');
const antiDeleteCommand = require('../commands/antidelete');
const chatbotCommand = require('../commands/chatbot');
const snipeCommand = require('../commands/snipe');
const backupCommand = require('../commands/backup');
const restoreCommand = require('../commands/restore');
const joinCommand = require('../commands/join');
const sendCommand = require('../commands/send');
const pastebinCommand = require('../commands/pastebin');

function fakeSocket() {
    const sent = [];
    return { sent, sendMessage: async (...args) => { sent.push(args); return {}; } };
}

test('status settings reject non-owners and do not persist changes', async () => {
    const sock = fakeSocket();
    let saves = 0;
    await statusCommand(sock, 'chat', {}, false, { statusSettings: {} }, () => saves++, 'user', ['on']);
    assert.match(sock.sent[0][1].text, /Only the bot owner/);
    assert.equal(saves, 0);
});

test('autoread rejects non-owners before changing its persisted setting', async () => {
    const sock = fakeSocket();
    await autoreadCommand(sock, 'chat', { message: { conversation: '.autoread on' } }, false, ['on']);
    assert.match(sock.sent[0][1].text, /Only the bot owner/);
});

test('anti-delete is owner-only', async () => {
    const sock = fakeSocket();
    await antiDeleteCommand(sock, 'chat', {}, false, {}, () => {}, 'user', ['on']);
    assert.match(sock.sent[0][1].text, /Only the bot owner/);
});

test('removed chatbot feature stays disabled and does not alter session state', async () => {
    const sock = fakeSocket();
    const session = { aiEnabled: false };
    await chatbotCommand(sock, 'chat', {}, session, ['on'], true);
    assert.equal(session.aiEnabled, false);
    assert.match(sock.sent[0][1].text, /disabled/);
});

test('snipe history is private to the bot owner', async () => {
    const sock = fakeSocket();
    await snipeCommand(sock, 'chat', {}, false);
    assert.match(sock.sent[0][1].text, /Only the bot owner/);
});

test('backup and restore do not claim to create or apply nonexistent snapshots', async () => {
    const sock = fakeSocket();
    await backupCommand(sock, 'chat', {}, true);
    await restoreCommand(sock, 'chat', {}, true);
    assert.match(sock.sent[0][1].text, /No backup file was created/);
    assert.match(sock.sent[1][1].text, /No session or settings were changed/);
});

test('group joining rejects non-owners without accepting the invite', async () => {
    const sock = fakeSocket();
    let joins = 0;
    sock.groupAcceptInvite = async () => { joins++; };
    await joinCommand(sock, 'chat', {}, 'https://chat.whatsapp.com/ABCDEFGH', false);
    assert.equal(joins, 0);
    assert.match(sock.sent[0][1].text, /Only the bot owner/);
});

test('direct send rejects invalid phone numbers and blank messages', async () => {
    const sock = fakeSocket();
    await sendCommand(sock, 'chat', {}, true, '123 invalid number');
    assert.equal(sock.sent.length, 1);
    assert.match(sock.sent[0][1].text, /Usage:/);
});

test('paste upload reports disabled without echoing or publishing supplied text', async () => {
    const sock = fakeSocket();
    await pastebinCommand(sock, 'chat', {});
    assert.match(sock.sent[0][1].text, /disabled/);
    assert.doesNotMatch(sock.sent[0][1].text, /secret example text/);
});
