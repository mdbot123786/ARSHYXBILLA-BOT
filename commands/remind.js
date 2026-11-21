'use strict';

const reminders = new Map();

module.exports = async function(sock, chatId, msg, q) {
    const parts = String(q || '').trim().split(/\s+/);
    const raw = parts.shift() || '';
    const reminderText = parts.join(' ').trim();
    if (!/^\d+$/.test(raw) || !reminderText) {
        return sock.sendMessage(chatId, { text: 'Usage: .remind <whole minutes 1–43200> <message>' }, { quoted: msg });
    }
    const minutes = Number(raw);
    if (!Number.isSafeInteger(minutes) || minutes < 1 || minutes > 43200) {
        return sock.sendMessage(chatId, { text: 'Choose a whole duration from 1 to 43200 minutes (30 days).' }, { quoted: msg });
    }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await sock.sendMessage(chatId, { text: `Reminder set for ${minutes} minute(s): ${reminderText}` }, { quoted: msg });
    const timeout = setTimeout(async () => {
        try { await sock.sendMessage(chatId, { text: `⏰ Reminder: ${reminderText}` }); } catch (_) {}
        reminders.delete(id);
    }, minutes * 60 * 1000);
    reminders.set(id, { timeout, text: reminderText });
};
