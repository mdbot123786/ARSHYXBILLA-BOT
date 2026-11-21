'use strict';
const questions = [
  'Tum urhna pasand karoge ya ghaib hona?',
  'Duniya ke sab se ameer banna ya sab se zyada samajhdar?',
  'Social media chhorna ya TV dekhna?',
  'Time machine lena ya teleport hone ki taqat?',
  'Mashhoor banna ya kisi mashhoor shakhs ka sab se acha dost?',
  'Hamesha 10 minute late ya 20 minute jaldi?',
  'Be-hisaab paisa ya be-hisaab ilm?',
  'Har zaban bolna ya har saaz bajana?',
  'Space mein rehna ya pani ke neeche?',
  'Pasandeeda khana hamesha ke liye chhorna ya roz wahi khana?',
  'Super strength ya super speed?',
  'Logon ke khayalat parhna ya mustaqbil dekhna?',
  'Music ke baghair rehna ya films ke baghair?',
  'Sab se mazaahiya banna ya sab se purkashish?',
  'Zindagi mein rewind button ya pause button?'
];
module.exports = async function(sock, chatId, msg) {
  const question=questions[Math.floor(Math.random()*questions.length)];
  return sock.sendMessage(chatId,{text:`🤔 *Aik intikhab karo*\n\n${question}\n\nApna jawab bhejo!`},{quoted:msg});
};
module.exports.questions=questions;
