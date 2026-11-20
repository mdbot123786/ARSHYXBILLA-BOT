const settings = require('../settings'); // اگر settings نہیں تو اس لائن کو ہٹا دو

module.exports = async function(sock, chatId, msg, args) {
    // ── Helper: Branded send (newsletter forward) ──
    const sendMsg = async (text) => {
        return await sock.sendMessage(chatId, {
            text: text,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363207208218980@newsletter",
                    newsletterName: "𝐀𝐑𝐒𝐇𝐘𝐗𝐁𝐈𝐋𝐋𝐀",
                    serverMessageId: 200
                }
            }
        }, { quoted: msg });
    };

    try {
        // ── Reaction ──
        await sock.sendMessage(chatId, { react: { text: "🔗", key: msg.key } });

        // ── Heavy Box Response ──
        const response = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💀  *𝘼𝙍𝙎𝙃𝙔𝙓𝘽𝙄𝙇𝙇𝘼 — LINKS*  💀  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  🔗 *WhatsApp Channel / Groups*                   ┃
┃  ➤ https://whatsapp.com/channel/0029VbEGNP8E50UcipvtjH0m ┃
┃  ➤ https://chat.whatsapp.com/Jz2gSCcJKlbFdRvf4QObCD?s=cl&p=i&mlu=4&ilr=4&iam=2 ┃
┃  ➤ https://chat.whatsapp.com/Lcw97fQ9ttTHyo1AsbbaRq?s=cl&p=i&mlu=4&ilr=4&iam=2 ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  📱 *Pairing Guide*                      ┃
┃  ➤ Type .pair 92XXXXXXXXXX              ┃
┃  ➤ Scan QR or enter code in WhatsApp    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  🚀 *Quick Connect*                      ┃
┃  ✨ .pair 923XXXXXXXXX                   ┃
┃  ⚡ Scan • Pair • Enjoy        ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  👑 *Version*   : ${settings?.version || '3.0'}  ┃
┃  🔐 *Security*  : Premium Encrypted      ┃
┃  ☠️ *Powered by* : ARSHY TEAM          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        `;

        await sendMsg(response);

    } catch (error) {
        console.error("❌ Repo command error:", error);
        await sendMsg("⚠️ کچھ غلط ہو گیا، براہِ کرم دوبارہ کوشش کریں۔");
    }
};