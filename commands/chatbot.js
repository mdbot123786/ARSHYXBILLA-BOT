'use strict';
module.exports = async function chatbotDisabled(sock, chatId, msg) {
    return sock.sendMessage(chatId, { text: 'Chatbot auto-replies are disabled; no AI response service is configured.' }, { quoted: msg });
};
