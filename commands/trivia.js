'use strict';
const trivia = [
  {q:'Hamare solar system ka sab se bara sayyara kaunsa hai?',a:'Jupiter'},
  {q:'Sona ka chemical symbol kya hai?',a:'Au'},
  {q:'Duniya mein kitne continents hain?',a:'7'},
  {q:'Duniya ka sab se uncha pahaar kaunsa hai?',a:'Mount Everest'},
  {q:'Mona Lisa ki painting kis ne banayi?',a:'Leonardo da Vinci'},
  {q:'Duniya ka sab se chhota mulk kaunsa hai?',a:'Vatican City'},
  {q:'Laal sayyara kis planet ko kehte hain?',a:'Mars'},
  {q:'Baligh insan ke jism mein taqreeban kitni haddiyan hoti hain?',a:'206'},
  {q:'CPU ka poora naam kya hai?',a:'Central Processing Unit'},
  {q:'Makri ki kitni taangein hoti hain?',a:'8'},
  {q:'Zameen ke atmosphere mein sab se zyada kaunsi gas hai?',a:'Nitrogen'},
  {q:'Pehla iPhone kis saal release hua?',a:'2007'}
];
module.exports = async function(sock, chatId, msg) {
  const item=trivia[Math.floor(Math.random()*trivia.length)];
  return sock.sendMessage(chatId,{text:`🎯 *Maloomati Sawal*\n\n${item.q}\n\n_Jawab: ${item.a}_`},{quoted:msg});
};
module.exports.trivia=trivia;
