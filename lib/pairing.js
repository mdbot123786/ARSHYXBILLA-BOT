'use strict';

/**
 * Ask Baileys for a phone-number pairing code only after it emits the initial QR
 * readiness event. This keeps requestPairingCode from running against a socket
 * whose WebSocket transport is not ready yet.
 */
function requestPairingCodeWhenReady(sock, phoneNumber, { timeoutMs = 30_000 } = {}) {
    const number = String(phoneNumber || '').replace(/\D/g, '');
    if (number.length < 10 || number.length > 15) {
        return Promise.reject(new Error('Enter a phone number with country code using digits only.'));
    }
    if (!sock || !sock.ev || typeof sock.ev.on !== 'function' || typeof sock.requestPairingCode !== 'function') {
        return Promise.reject(new Error('WhatsApp pairing socket is not ready.'));
    }

    return new Promise((resolve, reject) => {
        let settled = false;
        let requested = false;
        let timer;

        const cleanup = () => {
            clearTimeout(timer);
            if (typeof sock.ev.off === 'function') sock.ev.off('connection.update', onUpdate);
            else if (typeof sock.ev.removeListener === 'function') sock.ev.removeListener('connection.update', onUpdate);
        };
        const finish = (error, code) => {
            if (settled) return;
            settled = true;
            cleanup();
            if (error) reject(error);
            else resolve(code);
        };
        const onUpdate = async (update = {}) => {
            if (update.connection === 'close') {
                const detail = update.lastDisconnect?.error?.message;
                return finish(new Error(detail || 'WhatsApp closed the connection before pairing was ready.'));
            }
            if (!update.qr || requested) return;
            requested = true;
            try {
                const code = await sock.requestPairingCode(number);
                if (!code) throw new Error('WhatsApp returned an empty pairing code.');
                finish(null, String(code));
            } catch (error) {
                finish(error instanceof Error ? error : new Error(String(error)));
            }
        };

        timer = setTimeout(() => finish(new Error('Timed out waiting for WhatsApp pairing readiness. Please retry.')), timeoutMs);
        sock.ev.on('connection.update', onUpdate);
    });
}

module.exports = { requestPairingCodeWhenReady };
