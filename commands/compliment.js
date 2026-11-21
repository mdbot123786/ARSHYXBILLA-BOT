'use strict';
const lines=['Tumhari baat mein apnapan hai.','Tum mushkil waqt mein bhi umeed rakhte ho.','Tumhari muskurahat mehfil roshan kar deti hai.','Tum achhe dost ho aur logon ka khayal rakhte ho.','Tumhari mehnat waqai qabil-e-tareef hai.','Tum apne andaaz mein bilkul khaas ho.','Tumhari positivity doosron ka din behtar bana deti hai.'];
module.exports=async(sock,chat,msg)=>sock.sendMessage(chat,{text:`✨ *Tareef*\n\n${lines[Math.floor(Math.random()*lines.length)]}`},{quoted:msg});
