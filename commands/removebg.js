'use strict';

module.exports = async function(sock, chatId, msg) {
    return sock.sendMessage(chatId, {
        text: 'Background removal is unavailable because no real segmentation provider is configured. No image was changed.'
    }, { quoted: msg });
};
