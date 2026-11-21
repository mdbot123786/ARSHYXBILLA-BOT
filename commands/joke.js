'use strict';
const jokes = [
    'Ustad: Bijli kahan se aati hai? Shagird: Abbu ke bill se! Ustad: Wah, science mein kamal kar diya.',
    'Dost: Gym ja kar kya mila? Main: Wazan kam hua. Dost: Kitna? Main: Wallet ka!',
    'Ammi: Parhai kaisi chal rahi hai? Beta: Wi-Fi jaisi. Ammi: Matlab? Beta: Kabhi connect hoti hai, kabhi nahi.',
    'Doctor: Roz walk kiya karo. Mareez: Main roz fridge tak jata hoon. Doctor: Wapas bhi? Mareez: Khana le kar, bilkul!',
    'Dost: Tum itne khamosh kyun ho? Main: Soch raha hoon. Dost: Kya? Main: Yeh ke chai pehle piyun ya sochna band karun.',
    'Teacher: Homework kahan hai? Student: Sir, ghar par. Teacher: Kyun? Student: Aap ne kaha tha kaam ghar le jana!',
    'Abbu: Result kaisa aya? Beta: Number kam hain, lekin confidence full hai. Abbu: Woh kaise? Beta: Agli dafa bhi yahi subject lunga.',
    'Dost: Phone kyun nahi uthaya? Main: Phone silent par tha. Dost: Tumhara? Main: Nahi, mera mood.',
    'Ammi: Mehman aa rahe hain, kamra saaf karo. Beta: Ammi, kamra saaf kar diya. Ammi: Yeh kapray? Beta: Woh mehmanon ke liye decoration hai.',
    'Dost: Tumhara plan kya hai? Main: Pehle chai, phir dekhenge. Dost: Aur uske baad? Main: Ek aur chai.'
];
module.exports = async function jokeCommand(sock, chatId, msg) {
    const text = jokes[Math.floor(Math.random() * jokes.length)];
    return sock.sendMessage(chatId, { text: `😄 *Roman Urdu Joke*\n\n${text}` }, { quoted: msg });
};
module.exports.jokes = jokes;
