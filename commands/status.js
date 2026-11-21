'use strict';

async function statusCommand(sock, from, msg, isOwner, botData, saveBotData, userId, args) {
    if (!isOwner) return sock.sendMessage(from, { text: 'Only the bot owner can change status automation.' }, { quoted: msg });
    botData.statusSettings[userId] ||= { autoStatus: false, autoSeen: false, autoLike: false, isPublic: true };
    const state = botData.statusSettings[userId];
    const action = String(args[0] || '').toLowerCase();
    const value = String(args[1] || '').toLowerCase();

    if (!action) {
        return sock.sendMessage(from, {
            text: `╭━━〔 STATUS AUTOMATION 〕━━╮\n` +
                `Processing: ${state.autoStatus ? 'ON' : 'OFF'}\n` +
                `Auto-view: ${state.autoSeen ? 'ON' : 'OFF'}\n` +
                `Auto-like: ${state.autoLike ? 'ON' : 'OFF'}\n\n` +
                `.status on/off — master status handling\n` +
                `.status seen on/off — mark statuses as viewed\n` +
                `.status like on/off — react to statuses\n` +
                `╰━━━━━━━━━━━━━━━━━━━━━━╯`
        }, { quoted: msg });
    }

    if (action === 'on' || action === 'off') {
        const enabled = action === 'on';
        state.autoStatus = enabled;
        state.autoSeen = enabled;
        if (!enabled) state.autoLike = false;
        delete state.autoDownload;
        saveBotData();
        return sock.sendMessage(from, { text: `Status processing ${enabled ? 'enabled' : 'disabled'}${enabled ? ' (auto-view on)' : ''}.` }, { quoted: msg });
    }

    if (action === 'seen' || action === 'like') {
        if (!['on', 'off'].includes(value)) {
            return sock.sendMessage(from, { text: `Usage: .status ${action} <on|off>` }, { quoted: msg });
        }
        state.autoStatus = value === 'on' ? true : state.autoStatus;
        state[action === 'seen' ? 'autoSeen' : 'autoLike'] = value === 'on';
        delete state.autoDownload;
        saveBotData();
        return sock.sendMessage(from, { text: `Auto-${action} ${value}.` }, { quoted: msg });
    }

    if (action === 'download' || action === 'system') {
        return sock.sendMessage(from, { text: 'That option is not implemented, so it cannot be enabled.' }, { quoted: msg });
    }
    return sock.sendMessage(from, { text: 'Usage: .status on/off | .status seen on/off | .status like on/off' }, { quoted: msg });
}

module.exports = statusCommand;
