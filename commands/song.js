'use strict';
module.exports = async function songCommand(sock, chatId, msg) { return sock.sendMessage(chatId, { text: 'Song download command disable hai; is ka hard-coded third-party credential aur API provider hata diya gaya hai.' }, { quoted: msg }); };
