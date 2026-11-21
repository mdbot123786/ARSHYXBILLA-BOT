'use strict';
module.exports = async function apkCommand(sock, chatId, msg) { return sock.sendMessage(chatId, { text: 'Yeh APK command disable hai; iska API-key provider hata diya gaya hai.' }, { quoted: msg }); };
