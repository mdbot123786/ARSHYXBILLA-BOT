'use strict';

module.exports = async function vvCommand(sock, chatId, msg) {
    return sock.sendMessage(chatId, {
        text: 'View-once media ko bypass ya save karne mein madad nahi kar sakta. Sender se ijazat le kar woh media normal photo/video ke taur par dobara bhejne ko kahen.'
    }, { quoted: msg });
};
