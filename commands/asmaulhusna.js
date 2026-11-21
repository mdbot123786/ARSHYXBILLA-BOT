'use strict';

const axios = require('axios');
const asma = [
    { no: 1, name: 'Ar-Rahman', meaning: 'The Beneficent' },
    { no: 2, name: 'Ar-Rahim', meaning: 'The Merciful' },
    { no: 3, name: 'Al-Malik', meaning: 'The King' },
    { no: 4, name: 'Al-Quddus', meaning: 'The Holy' },
    { no: 5, name: 'As-Salam', meaning: 'The Peace' },
    { no: 6, name: "Al-Mu'min", meaning: 'The Guardian of Faith' },
    { no: 7, name: 'Al-Muhaymin', meaning: 'The Protector' },
    { no: 8, name: 'Al-Aziz', meaning: 'The Mighty' },
    { no: 9, name: 'Al-Jabbar', meaning: 'The Compeller' },
    { no: 10, name: 'Al-Mutakabbir', meaning: 'The Majestic' }
];

module.exports = async function(sock, chatId, msg, q) {
    const raw = String(q || '').trim();
    if (raw) {
        if (!/^\d+$/.test(raw) || Number(raw) < 1 || Number(raw) > 99) {
            return sock.sendMessage(chatId, { text: 'Usage: .asmaulhusna <whole number 1–99>' }, { quoted: msg });
        }
        try {
            const response = await axios.get(`https://api.aladhan.com/v1/asmaAlHusna/${Number(raw)}`, { timeout: 10000 });
            const result = response.data?.data?.[0];
            if (!result) throw new Error('No name was returned for that number.');
            return sock.sendMessage(chatId, {
                text: `✨ Asmaul Husna #${result.number}\n\nName: ${result.name}\nTransliteration: ${result.transliteration}\nMeaning: ${result.en?.meaning || 'Not provided'}\n\n${result.en?.desc || ''}`
            }, { quoted: msg });
        } catch (error) {
            return sock.sendMessage(chatId, { text: `Could not fetch that name right now: ${error.message}` }, { quoted: msg });
        }
    }
    const list = asma.map(item => `${item.no}. *${item.name}* — ${item.meaning}`).join('\n');
    return sock.sendMessage(chatId, {
        text: `✨ Asmaul Husna — selected preview (10 names)\n\n${list}\n\nUse .asmaulhusna <number 1–99> for an individual lookup.`
    }, { quoted: msg });
};
