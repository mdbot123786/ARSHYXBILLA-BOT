'use strict';
const items=['Group mein sab se funny member ko salam bhejo.','Apni recent selfie par ek funny caption lagao.','Agle paanch minute sirf Roman Urdu mein baat karo.','Kisi dost ki achhi aadat ki tareef karo.','Apni favourite chai ya snack ka naam batao.','Ek purana funny waqia sunao.','Group ke liye ek naya nickname socho.','Aaj kisi ek ka shukriya ada karo.'];
module.exports=async(sock,chat,msg)=>sock.sendMessage(chat,{text:`🎯 *Dare*\n\n${items[Math.floor(Math.random()*items.length)]}`},{quoted:msg});
