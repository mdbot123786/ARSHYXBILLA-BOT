'use strict';
const items=['Tumhari sab se funny aadat kya hai?','Aakhri baar kis baat par dil khol kar hase?','Tumhari favourite chai ya khana kya hai?','Kis dost par sab se zyada bharosa hai?','Bachpan ki koi yaad jo ab bhi hansati ho?','Tumhara chhupa hua talent kya hai?','Aaj kis cheez ke liye shukar guzar ho?','Koi aisa gaana jo baar baar sunte ho?'];
module.exports=async(sock,chat,msg)=>sock.sendMessage(chat,{text:`💬 *Sach ka sawal*\n\n${items[Math.floor(Math.random()*items.length)]}`},{quoted:msg});
