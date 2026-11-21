'use strict';
const facts = [
  'Octopus ke teen dil hote hain.',
  'Shahad sahi tarah band ho to bohat arsay tak kharab nahi hota.',
  'Insani jism ki sab se bari haddi femur hoti hai.',
  'Chamgadarr ulta latak kar aaram karte hain.',
  'Botanical hisaab se kela berry hai, magar strawberry berry nahi.',
  'Dolphins ek dusre ko alag se pehchanne ke liye khaas seeti istemal karte hain.'
];
module.exports = async function(sock, chatId, msg) {
  const fact = facts[Math.floor(Math.random() * facts.length)];
  return sock.sendMessage(chatId, { text: `*Dilchasp maloomat*\n\n${fact}` }, { quoted: msg });
};
