'use strict';
module.exports = async function movieCommand(sock, chatId, msg) { return sock.sendMessage(chatId, { text: 'Movie lookup command disable hai; API-key provider hata diya gaya hai.' }, { quoted: msg }); };
