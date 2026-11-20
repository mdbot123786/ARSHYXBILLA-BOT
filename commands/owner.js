const settings = require('../settings');

async function ownerCommand(sock, from, msg) {
    const ownerText = `👤 *BOT OWNER:* ${settings.ownerName}\n` +
                    `📱 *NUMBER:* +${settings.ownerNumber}\n` +
                    `🔗 *OFFICIAL WHATSAPP CHANNEL:*
> ${settings.whatsappChannel}

👥 *OFFICIAL GROUPS:*
> https://chat.whatsapp.com/Jz2gSCcJKlbFdRvf4QObCD?s=cl&p=i&mlu=4&ilr=4&iam=2
> https://chat.whatsapp.com/Lcw97fQ9ttTHyo1AsbbaRq?s=cl&p=i&mlu=4&ilr=4&iam=2`;
    await sock.sendMessage(from, { text: ownerText }, { quoted: msg });
}

module.exports = ownerCommand;
