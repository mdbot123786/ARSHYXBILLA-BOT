'use strict';
const lines=['Tumhara plan itna zabardast hai ke abhi tak shuru hi nahi hua.','Tum late nahi hote, waqt tum se pehle pohanch jata hai.','Tumhara phone tum se zyada active hai.','Tum itne chilled ho ke fridge bhi tum se mashwara leta hai.','Tumhari neend ka schedule dekh kar alarm ne resign kar diya.','Tumhara confidence full hai, bas charger dhoond raha hai.','Tumhari speed dekh kar loading screen bhi tez lagti hai.'];
module.exports=async(sock,chat,msg)=>sock.sendMessage(chat,{text:`😎 *Halka phulka roast*\n\n${lines[Math.floor(Math.random()*lines.length)]}`},{quoted:msg});
