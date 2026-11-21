'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] || '';
const functionLines = script.split('\n');
const formatFunction = functionLines.find(line => line.startsWith('function formatPairingCode('));
const setFunction = functionLines.find(line => line.startsWith('function setPairCode('));
const copyFunction = functionLines.find(line => line.startsWith('async function copyPairingCode('));

test('pairing copy button begins disabled and is enabled only for an eight-character code', () => {
    assert.match(html, /id="copyPairCode"[^>]*disabled/);
    assert.ok(formatFunction && setFunction && copyFunction);
    const elements = {
        pairCode: { textContent: '•••• ••••' },
        copyPairCode: { disabled: true },
        pairStatus: { textContent: '' }
    };
    const context = { document: { getElementById: id => elements[id] } };
    vm.runInNewContext([formatFunction, setFunction].join('\n'), context);
    context.setPairCode('REQUESTING');
    assert.equal(elements.copyPairCode.disabled, true);
    context.setPairCode('12345678');
    assert.equal(elements.pairCode.textContent, '1234-5678');
    assert.equal(elements.copyPairCode.disabled, false);
});

test('copy action uses the clipboard API and reports success', async () => {
    const elements = {
        pairCode: { textContent: 'ABCD-EF12' },
        pairStatus: { textContent: '' },
        copyPairCode: { disabled: false }
    };
    const copied = [];
    const context = {
        document: { getElementById: id => elements[id] },
        navigator: { clipboard: { writeText: async value => copied.push(value) } },
        window: { isSecureContext: true }
    };
    vm.runInNewContext([formatFunction, copyFunction].join('\n'), context);
    await context.copyPairingCode();
    assert.deepEqual(copied, ['ABCD-EF12']);
    assert.match(elements.pairStatus.textContent, /Pairing code copied/);
    assert.match(copyFunction, /execCommand\('copy'\)/);
});

test('web instructions explain Linked Devices and do not promise WhatsApp notifications', () => {
    assert.match(html, /Settings → Linked Devices → Link a Device → Link with phone number instead/);
    assert.match(html, /cannot force a WhatsApp push notification/);
});
