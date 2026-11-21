'use strict';
const quotes = [
  'Mehnat khamoshi se karo, kamyabi shor macha degi.',
  'Har naya din apni kahani behtar likhne ka mauqa hai.',
  'Apni raftaar se chalo; manzil tak pohanchna zaroori hai.',
  'Izzat alfaaz se nahi, kirdar se milti hai.',
  'Mushkil waqt guzarta hai, himmat saath rehti hai.',
  'Apne kal se behtar banna hi asal jeet hai.',
  'Sabr aur lagan se band darwaze bhi khul jate hain.',
  'Khud par yaqeen rakho, pehla qadam tumhara intezar kar raha hai.'
];
module.exports = async function(sock, chatId, msg) {
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  return sock.sendMessage(chatId, { text: `*Soch ki baat*\n\n“${quote}”` }, { quoted: msg });
};
