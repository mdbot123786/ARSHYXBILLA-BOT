'use strict';

const { sendAllMenu } = require('./menuCatalog');

module.exports = async function allMenu(sock, from, msg) {
    return sendAllMenu(sock, from, msg);
};
