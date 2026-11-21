'use strict';
const memes = [
    '📱 *Meme*\nJab internet slow ho: “Bas ek video dekhni thi.”\nInternet: “Aaj nahi, boss.”',
    '☕ *Meme*\nMain: Aaj jaldi so jaunga.\nRaat ke 2 baje mera dimagh: Chalo zindagi ke faislay yaad karte hain.',
    '📚 *Meme*\nParhai shuru karne baitha tha.\nPehle table saaf ki, phir chai banayi, phir playlist chuni… kitab abhi bhi band hai.',
    '💸 *Meme*\nSalary aayi: “Ab to sab set hai.”\nBills ne kaha: “Hum bhi yahin hain.”',
    '⏰ *Meme*\nAlarm: Uth jao!\nMain: Bas 5 minute.\nAlarm: Yeh tumhara roz ka drama hai.',
    '🍕 *Meme*\nDiet kal se pakki.\nAaj ka pizza bas farewell party hai.',
    '🧹 *Meme*\nAmmi: Mehman aa rahe hain.\nMain: Ghar saaf karun?\nAmmi: Pehle apna kamra dhoondo.',
    '💬 *Meme*\n“Online ho kar reply kyun nahi kiya?”\nBhai, online hona aur social hona do alag cheezein hain.'
];
module.exports = async function memeCommand(sock, chatId, msg) {
    const text = memes[Math.floor(Math.random() * memes.length)];
    return sock.sendMessage(chatId, { text }, { quoted: msg });
};
module.exports.memes = memes;
