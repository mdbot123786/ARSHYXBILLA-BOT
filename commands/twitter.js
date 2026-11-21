'use strict';

module.exports = async function(sock, chatId, msg) {
    return sock.sendMessage(chatId, {
        text: 'Twitter/X media downloading is not implemented in this bot. This command is not listed as a downloader and did not fetch any media.'
    }, { quoted: msg });
};
