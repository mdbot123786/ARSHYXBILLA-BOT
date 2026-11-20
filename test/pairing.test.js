'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { requestPairingCodeWhenReady } = require('../lib/pairing');

function makeSocket() {
    const ev = new EventEmitter();
    const calls = [];
    return {
        ev,
        calls,
        requestPairingCode: async number => {
            calls.push(number);
            return '12345678';
        }
    };
}

test('requests the pairing code only after the QR readiness update', async () => {
    const sock = makeSocket();
    const pending = requestPairingCodeWhenReady(sock, '+1 (555) 123-4567', { timeoutMs: 500 });
    assert.deepEqual(sock.calls, []);
    sock.ev.emit('connection.update', { qr: 'readiness-signal' });
    assert.equal(await pending, '12345678');
    assert.deepEqual(sock.calls, ['15551234567']);
    assert.equal(sock.ev.listenerCount('connection.update'), 0);
});

test('rejects invalid phone numbers before requesting a code', async () => {
    const sock = makeSocket();
    await assert.rejects(requestPairingCodeWhenReady(sock, '555-1234'), /country code/);
    assert.deepEqual(sock.calls, []);
});

test('rejects if the connection closes before readiness', async () => {
    const sock = makeSocket();
    const pending = requestPairingCodeWhenReady(sock, '15551234567', { timeoutMs: 500 });
    sock.ev.emit('connection.update', { connection: 'close', lastDisconnect: { error: new Error('closed') } });
    await assert.rejects(pending, /closed/);
});

test('times out and removes the readiness listener', async () => {
    const sock = makeSocket();
    await assert.rejects(requestPairingCodeWhenReady(sock, '15551234567', { timeoutMs: 5 }), /Timed out/);
    assert.equal(sock.ev.listenerCount('connection.update'), 0);
});
