'use strict';

module.exports = async function clearCommand(sock, chatId, msg) {
    return sock.sendMessage(chatId, { text: 'Chat clearing is not implemented. No messages were deleted.' }, { quoted: msg });
};
