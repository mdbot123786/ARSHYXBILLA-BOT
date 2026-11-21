'use strict';

const axios = require('axios');

module.exports = async function(sock, chatId, msg, q) {
    const raw = String(q || '').trim();
    let surah;
    if (raw) {
        if (!/^\d+$/.test(raw)) {
            return sock.sendMessage(chatId, { text: 'Usage: .quran <surah number 1–114>' }, { quoted: msg });
        }
        surah = Number(raw);
        if (!Number.isSafeInteger(surah) || surah < 1 || surah > 114) {
            return sock.sendMessage(chatId, { text: 'Surah number must be a whole number from 1 to 114.' }, { quoted: msg });
        }
    } else {
        surah = Math.floor(Math.random() * 114) + 1;
    }
    try {
        const response = await axios.get(`https://api.alquran.cloud/v1/surah/${surah}`, { timeout: 10000 });
        const data = response.data?.data;
        if (!data) throw new Error('The Quran service returned no surah data.');
        let text = `📖 Surah ${data.englishName} (${data.name})\n\n` +
            `Number: ${data.number}\nMeaning: ${data.englishNameTranslation}\n` +
            `Verses: ${data.numberOfAyahs}\nRevelation: ${data.revelationType}\n\n`;
        text += data.ayahs.slice(0, 5).map(ayah => `${ayah.numberInSurah}. ${ayah.text}`).join('\n');
        if (data.numberOfAyahs > 5) text += `\n\n… and ${data.numberOfAyahs - 5} more verses.`;
        text += `\n\nFull surah: https://quran.com/${surah}`;
        return sock.sendMessage(chatId, { text }, { quoted: msg });
    } catch (error) {
        return sock.sendMessage(chatId, { text: `Could not fetch the surah: ${error.message}` }, { quoted: msg });
    }
};
