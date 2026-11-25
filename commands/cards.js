const crypto = require('crypto');
const variants = {
  "welcome": [
    "🗿 Khamoshi se aaya hai, lagta hai koi bara khiladi hai.",
    "👑 Badshahon ki mehfil mein ek aur badshah aa gaya.",
    "🥶 Naam yaad rakhna, pehchan khud ban jayegi.",
    "⚡ Entry choti hai, lekin kahani lambi hogi.",
    "☠️ Sheron ki mehfil mein ek aur sher ka istiqbal.",
    "🗿 Hum shor nahi karte, apni pehchan banate hain.",
    "👑 Aao janab, mehfil aap hi ka intezar kar rahi thi.",
    "🥀 Aukaat nahi, kirdar dekha jata hai.",
    "🔥 Lagta hai aaj mehfil mein koi khaas aaya hai.",
    "🥶 Andaz apna alag, pehchan apni alag.",
    "👑 Qadar karna seekho, har koi aam nahi hota.",
    "🗿 Akela chalne walon ka bhi apna rutba hota hai.",
    "☠️ Khamosh chehron ke peeche gehri kahaniyan hoti hain.",
    "⚔️ Mehfil mein aaye ho toh apna rutba bana ke jana.",
    "🔥 Naya chehra, naya andaaz — mehfil mein khush aamdeed.",
    "👑 Aaj ki entry se mehfil ka rang badal gaya.",
    "⚡ Aap aaye hain, ab baat kuch khaas hogi.",
    "🖤 Izzat aur apnayat ke saath aapka istiqbal hai.",
    "🥶 Mehfil mein khamosh sitara aa gaya.",
    "✨ Doston ki mehfil mein ek naya dost shamil hua.",
    "🗿 Apni jagah khud banao, yahan har andaaz khaas hai.",
    "👑 Jis ka kirdar buland ho, uska rutba khud banta hai.",
    "🔥 Aaj mehfil mein nayi roshni ka izafa hua.",
    "⚔️ Dosti ka naya safar yahin se shuru hota hai.",
    "🥀 Dil se welcome — apna khayal aur sab ka ehtram rakhein.",
    "⚡ Mehfil mukammal hui, ab raunaq aur barhegi.",
    "☠️ Naam se nahi, apne kaam se pehchan banao.",
    "🖤 Khush aamdeed, yahan sab ki apni ahmiyat hai.",
    "✨ Aapki amad se group ki ronak barh gayi.",
    "👑 Aao, izzat se milo aur dosti se raho."
  ],
  "goodbye": [
    "👋 Mehfil se rukhsat, magar yaadein yahin rahengi.",
    "🥀 Aapki kami mehsoos hogi, apna khayal rakhna.",
    "⚡ Safar yahin khatam nahi, phir mulaqat hogi.",
    "🖤 Khush raho, jahan raho — dil se dua hai.",
    "👑 Ja rahe ho, magar apna rutba chhor gaye.",
    "🗿 Khamoshi se aaye, yaadon ka shor chhor gaye.",
    "✨ Mehfil ki ronak ka ek sitara rukhsat hua.",
    "🥶 Yaad rakhna, doston ka darwaza khula hai.",
    "🔥 Aaj ki mehfil thori udaas ho gayi.",
    "⚔️ Rukhsat dost, agli mulaqat tak salam.",
    "☠️ Ek sher gaya, magar kahani baqi hai.",
    "👋 Allah hafiz, apni manzil ki taraf barhte raho.",
    "🖤 Dosti ka rishta faaslon se kam nahi hota.",
    "🥀 Aap gaye, magar aapki baatein yaad rahengi.",
    "⚡ Phir kabhi mehfil mein zaroor tashreef lana.",
    "👑 Jaate jaate apni pehchan yahin chhor gaye.",
    "✨ Aapka agla safar khushiyon se bhara ho.",
    "🗿 Kuch log kam waqt mein bhi apni jagah bana lete hain.",
    "🔥 Mehfil aapko yaad karegi, wapas zaroor aana.",
    "🥶 Rukhsat hue ho, bhoolay nahi jaoge.",
    "👋 Phir milenge kisi nayi guftagu ke saath.",
    "⚔️ Apna khayal rakhna, dost — safar mubarak.",
    "🥀 Aapke baghair mehfil ka rang kuch kam hai.",
    "🖤 Dosti rahegi, chahe raaste alag ho jayen.",
    "☠️ Mehfil ka ek aur khiladi apni manzil ko chala.",
    "✨ Khuda hafiz, aapke liye behtareen duaen.",
    "⚡ Jate ho toh jao, lekin yaad zaroor karna.",
    "👑 Aapki jagah khaali rahegi — phir tashreef lana.",
    "🗿 Alvida nahi kehte, bas agli mulaqat tak.",
    "🔥 Rukhsat dost, apni kahani roshan rakhna."
  ],
  "admin": [
    "Admin announcement: tawajjo farmayein",
    "Group update: sab members note karein",
    "Zaroori paigham, barah-e-karam parhein",
    "Admin ki taraf se aham maloomat",
    "Mehfil ke liye nayi hidayat",
    "Group discipline sab ki zimmedari",
    "Aaj ka zaroori elan",
    "Tamam members se guzarish",
    "Naye rules ko zaroor dekhein",
    "Ek chhoti si important update",
    "Sab ki tawajjo darkar hai",
    "Group notice: please read",
    "Ahem baat share ki ja rahi hai",
    "Admin ka paigham aap sab ke naam",
    "Meherbani karke is par amal karein",
    "Community update aa gayi",
    "Group ke liye ek zaroori baat",
    "Sab members is message ko note karein",
    "Aaj ki admin briefing",
    "Aap sab ka taawun darkar hai",
    "Naya elan, sab tak pohanchayein",
    "Please announcement ko miss na karein",
    "Group ki behtari ke liye update",
    "Admin ne nayi info share ki",
    "Is paigham ko ahmiyat dein",
    "Ahem update: nazar zaroor daalein",
    "Group notice board par naya paigham",
    "Sab ko ittila di jati hai",
    "Barah-e-karam rules ka lihaz karein",
    "Admin update: shukriya"
  ],
  "offline": [
    "JUTT abhi offline hai!",
    "Shayad internet band hai.",
    "Aapka message mil jayega jab JUTT wapas aayega.",
    "JUTT ki apni duniya hai!",
    "Har waqt available nahi hota!",
    "Sabar karo, boss wapas aayega!",
    "Aapka paigham mehfooz hai",
    "Filhal phone se door hoon",
    "Online hote hi jawab dunga",
    "Thori dair mein wapas aaunga",
    "Message chhor dein, dekh lunga",
    "Abhi offline, baad mein reply",
    "Network se filhal rabta nahi",
    "Aapka text receive ho gaya",
    "Wapas aa kar zaroor dekhta hoon",
    "Sabr ka phal meetha hota hai",
    "Filhal break par hoon",
    "Aapka paigham nazar aa jayega",
    "Boss abhi available nahi",
    "Message ka shukriya, baad mein reply",
    "Offline hoon, ghayab nahi",
    "Jald hi online milunga",
    "Aapka note save kar liya",
    "Thori masroofiyat hai",
    "Phone silent par hai",
    "Wapas aa kar baat hoti hai",
    "Aapka message mere paas hai",
    "Abhi jawab mumkin nahi",
    "Sabar karein, reply aayega",
    "Online aate hi rabta karunga"
  ],
  "busy": [
    "JUTT abhi kaam mein hai!",
    "Filhal reply nahi kar sakta.",
    "Boss apne mission par hai!",
    "Reply milega jab waqt hoga!",
    "Sabar bhi koi cheez hoti hai!",
    "Thora busy hoon, baad mein likhta hoon",
    "Aapka message dekh liya",
    "Kaam khatam kar ke jawab dunga",
    "Filhal meeting mein hoon",
    "Aapka paigham receive ho gaya",
    "Thori dair dein, reply karta hoon",
    "Abhi focus mode on hai",
    "Masroof hoon, magar message mil gaya",
    "Waqt milte hi rabta karunga",
    "Ek zaroori kaam mein laga hoon",
    "Reply late ho sakta hai",
    "Aapka note pending mein hai",
    "Thora intezar farmayein",
    "Abhi kaam ko priority de raha hoon",
    "Baad mein detail se baat hogi",
    "Busy status, message safe hai",
    "Jald hi jawab dene ki koshish",
    "Filhal phone check nahi kar paunga",
    "Aapka text receive hua, shukriya",
    "Kaam ke baad zaroor reply",
    "Thora waqt chahiye",
    "Abhi jawab dena mumkin nahi",
    "Paigham mil gaya, baad mein reply",
    "Sabar karein, wapas aata hoon",
    "Kaam mukammal kar ke likhunga"
  ],
  "online": [
    "JUTT online hai, farmayein!",
    "Boss hazir hai!",
    "Aapka paigham dekh raha hoon",
    "Online hoon, kya madad chahiye?",
    "Bolo, sun raha hoon",
    "Abhi available hoon",
    "JUTT wapas aa gaya",
    "Message bhejein, reply mil jayega",
    "Online presence active hai",
    "Aaj kis baat par guftagu ho?",
    "Aapka paigham receive karne ko hazir",
    "Bila takalluf baat karein",
    "Main yahin hoon",
    "Reply ke liye available",
    "Kya haal hai, farmayein?",
    "Online aur ready",
    "Aapka message dekh liya",
    "Ji, batayein",
    "Aaj ki guftagu shuru karein",
    "Aap se rabta karke khushi hui",
    "Active hoon, paigham karein",
    "JUTT sunne ke liye hazir",
    "Aapki baat ka intezar hai",
    "Chaliye baat karte hain",
    "Kuch poochna ho toh likhein",
    "Abhi chat ke liye available",
    "Message karein, main dekh raha hoon",
    "Online hoon, apna paigham bhejein",
    "Boss is back online",
    "Farmayein, kya kaam hai?"
  ]
};
function pick(type) {
  const list = variants[type] || variants.welcome;
  return list[crypto.randomInt(list.length)];
}
function cleanText(value, max = 1200) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}
function render(type, values = {}) {
  const phrase = pick(type);
  const v = { mention: values.mention || 'Member', count: values.count ?? '?', time: values.time || new Date().toLocaleString(), members: values.members ?? '?', group: values.group || 'Group', message: cleanText(values.message) || '(empty message)', phrase };
  const blocks = {
    welcome: `╭━━━━━━━〔 🖤 〕━━━━━━━╮\n\n      ✦ 𝐖𝐄𝐋𝐂𝐎𝐌𝐄 ✦\n\n╰━━━━━━━━━━━━━━━━━━━╯\n\n👤 User: {mention}\n🔢 User No: {count}\n🕒 Joined: {time}\n👥 Total Members: {members}\n\n   〽️ ━━━━━━━━━━━ 〽️\n   ⚡ {phrase} ⚡\n   🖤 Apni pehchan khud banao 🖤\n   👑 Izzat kamao, naam nahi 👑\n\n━━━━━━━━━━━━━━━━━━━━\n\n📌 Read the group rules.\n🤝 Respect all members.\n💬 Stay active & enjoy!\n\n╰━━━━━━〔 ✨ 〕━━━━━━╯`,
    goodbye: `╭━━━━━━━〔 🖤 〕━━━━━━━╮\n\n       ✦ 𝐆𝐎𝐎𝐃𝐁𝐘𝐄 ✦\n\n╰━━━━━━━━━━━━━━━━━━━╯\n\n👤 User: {mention}\n🔢 Member No: {count}\n🕒 Left At: {time}\n👥 Remaining Members: {members}\n\n   〽️ ━━━━━━━━━━━ 〽️\n   😂 {phrase}\n   ⚡ Mehfil aapko yaad karegi!\n   🥀 Khush raho, jahan bhi raho!\n   😎 Yaad toh aaoge... shayad!\n   〽️ ━━━━━━━━━━━ 〽️\n\n📌 Group ki رونق kam ho gayi.\n💔 Lekin drama thora kam ho gaya!\n\n╰━━━━━━〔 👋 〕━━━━━━╯`,
    admin: `╭━━━━━━━〔 👑 〕━━━━━━━╮\n\n      ✦ 𝐀𝐃𝐌𝐈𝐍 𝐀𝐋𝐄𝐑𝐓 ✦\n\n╰━━━━━━━━━━━━━━━━━━━╯\n\n👑 Admin: {mention}\n🕒 Time: {time}\n👥 Group: {group}\n\n   〽️ ━━━━━━━━━━━ 〽️\n   📢 𝐀𝐃𝐌𝐈𝐍 𝐌𝐄𝐒𝐒𝐀𝐆𝐄\n   {message}\n   〽️ ━━━━━━━━━━━ 〽️\n\n⚜️ {phrase}\n🖤 Please pay attention!\n\n╰━━━━━━〔 🔥 〕━━━━━━╯`,
    offline: `╭━━━━━━━〔 🖤 〕━━━━━━━╮\n\n      ✦ 𝐉𝐔𝐓𝐓 𝐎𝐅𝐅𝐋𝐈𝐍𝐄 ✦\n\n╰━━━━━━━━━━━━━━━━━━━╯\n\n🥀 {phrase}\n🕒 Time: {time}\n📵 Shayad internet band hai.\n⏳ Aapka message mil jayega jab JUTT wapas aayega.\n\n   〽️ ━━━━━━━━━━━ 〽️\n   😎 JUTT ki apni duniya hai!\n   ⚡ Har waqt available nahi hota!\n   👑 Sabar karo, boss wapas aayega!\n   〽️ ━━━━━━━━━━━ 〽️\n\n💬 Aap apna message chhor dein.\n\n╰━━━━━━〔 📴 〕━━━━━━╯`,
    busy: `╭━━━━━━━〔 👑 〕━━━━━━━╮\n\n      ✦ 𝐉𝐔𝐓𝐓 𝐁𝐔𝐒𝐘 ✦\n\n╰━━━━━━━━━━━━━━━━━━━╯\n\n👑 {phrase}\n🕒 Time: {time}\n⏳ Filhal reply nahi kar sakta.\n\n   〽️ ━━━━━━━━━━━ 〽️\n   🔥 Boss apne mission par hai!\n   😎 Reply milega jab waqt hoga!\n   🖤 Sabar bhi koi cheez hoti hai!\n   〽️ ━━━━━━━━━━━ 〽️\n\n💬 Apna message chhor dein.\n\n╰━━━━━━〔 🟢 〕━━━━━━╯`,
    online: `╭━━━━━━━〔 🟢 〕━━━━━━━╮\n\n      ✦ 𝐉𝐔𝐓𝐓 𝐎𝐍𝐋𝐈𝐍𝐄 ✦\n\n╰━━━━━━━━━━━━━━━━━━━╯\n\n👑 {phrase}\n🕒 Time: {time}\n💬 Apna paigham bhejein, main dekh raha hoon.\n\n╰━━━━━━〔 ⚡ 〕━━━━━━╯`
  };
  return (blocks[type] || blocks.welcome).replace(/\{(mention|count|time|members|group|message|phrase)\}/g, (_, key) => String(v[key]));
}
function participantJid(value) {
  if (typeof value === 'string') return value;
  const raw = value?.phoneNumber || value?.id || value?.jid || value?.lid || null;
  if (typeof raw !== 'string' || !raw) return null;
  return raw.includes('@') ? raw : `${raw}@s.whatsapp.net`;
}
async function sendCardMessage(sock, chatId, text, participant) {
  const jid = participantJid(participant);
  const mentions = jid ? [jid] : [];
  if (jid && typeof sock.profilePictureUrl === 'function') {
    try {
      const imageUrl = await sock.profilePictureUrl(jid, 'image');
      if (imageUrl) return sock.sendMessage(chatId, { image: { url: imageUrl }, caption: text, mentions });
    } catch {}
  }
  return sock.sendMessage(chatId, { text, mentions });
}
async function handleParticipantUpdate(sock, event, groupCards, groupMemberCounts) {
  groupCards ||= {};
  groupMemberCounts ||= {};
  const group = event?.id;
  if (!group || !group.endsWith('@g.us')) return 0;
  const settings = groupCards?.[group] || {};
  if (!settings.welcome && !settings.goodbye) return 0;
  const kind = event.action === 'add' ? 'welcome' : event.action === 'remove' ? 'goodbye' : null;
  if (!kind || !settings[kind]) return 0;
  const metadata = await sock.groupMetadata(group);
  const participants = Array.isArray(event.participants) ? event.participants : [];
  const memberRows = Array.isArray(metadata.participants) ? metadata.participants : [];
  let memberCount = memberRows.length;
  let sent = 0;
  for (const participant of participants) {
    const jid = participantJid(participant);
    if (!jid) continue;
    const inMetadata = memberRows.some(row => participantJid(row) === jid);
    if (kind === 'welcome' && memberRows.length && !inMetadata) memberCount++;
    if (kind === 'goodbye' && inMetadata) memberCount = Math.max(0, memberCount - 1);
    const counts = groupMemberCounts[group] || (groupMemberCounts[group] = { joined: 0, left: 0 });
    const countKey = kind === 'welcome' ? 'joined' : 'left';
    counts[countKey] = (counts[countKey] || 0) + 1;
    const text = render(kind, {
      mention: '@' + jid.split('@')[0],
      count: counts[countKey],
      time: new Date().toLocaleString(),
      members: memberCount,
      group: metadata.subject
    });
    await sendCardMessage(sock, group, text, jid);
    sent++;
  }
  return sent;
}
module.exports = { variants, pick, render, cleanText, participantJid, sendCardMessage, handleParticipantUpdate };
