'use strict';
const riddles = [
  { q:'Mere paas shehr, pahaar aur darya hain, magar ghar, darakht aur machhli nahi. Main kya hoon?', a:'Naqsha' },
  { q:'Mere paas keys hain magar taale nahi. Main kya hoon?', a:'Keyboard' },
  { q:'Mera sar aur dum hai magar jism nahi. Main kya hoon?', a:'Sikka' },
  { q:'Khud geela ho kar doosron ko sukhaata hoon. Main kya hoon?', a:'Toliya' },
  { q:'Duniya ka chakkar lagata hoon magar kone mein rehta hoon. Main kya hoon?', a:'Ticket' },
  { q:'Meri aankh hai magar main dekh nahi sakti. Main kya hoon?', a:'Sui' },
  { q:'Mere haath hain magar taali nahi baja sakta. Main kya hoon?', a:'Ghadi' },
  { q:'Jitne qadam uthao, utne nishan peechay chhor jao. Woh kya hain?', a:'Qadam ke nishan' },
  { q:'Meri gardan hai magar sar nahi. Main kya hoon?', a:'Bottle' },
  { q:'Woh tumhara hai magar doosre tum se zyada istemal karte hain. Kya?', a:'Tumhara naam' }
];
module.exports = async function(sock, chatId, msg) {
  const r=riddles[Math.floor(Math.random()*riddles.length)];
  return sock.sendMessage(chatId,{text:`🧩 *Paheli*\n\n${r.q}\n\n*Jawab:* ||${r.a}||`},{quoted:msg});
};
module.exports.riddles=riddles;
