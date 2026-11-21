'use strict';

const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const ffmpegPath = require('ffmpeg-static');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const execFileAsync = promisify(execFile);

async function collect(stream) {
    const chunks = [];
    for await (const chunk of stream) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks);
}

module.exports = async function toMp3Command(sock, chatId, msg) {
    const workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'arshy-mp3-'));
    const inputPath = path.join(workDir, 'input-media');
    const outputPath = path.join(workDir, 'converted.mp3');
    try {
        if (!ffmpegPath) throw new Error('The bundled ffmpeg binary is unavailable.');
        const current = msg.message?.ephemeralMessage?.message || msg.message?.viewOnceMessage?.message || msg.message?.viewOnceMessageV2?.message || msg.message || {};
        const context = current.extendedTextMessage?.contextInfo || msg.message?.extendedTextMessage?.contextInfo;
        const quoted = context?.quotedMessage?.ephemeralMessage?.message || context?.quotedMessage?.viewOnceMessage?.message || context?.quotedMessage?.viewOnceMessageV2?.message || context?.quotedMessage || {};
        const source = current.videoMessage ? { media: current.videoMessage, type: 'video' } : current.audioMessage ? { media: current.audioMessage, type: 'audio' } : quoted.videoMessage ? { media: quoted.videoMessage, type: 'video' } : quoted.audioMessage ? { media: quoted.audioMessage, type: 'audio' } : null;
        if (!source) return await sock.sendMessage(chatId, { text: 'Reply to an audio or video message with .tomp3.' }, { quoted: msg });
        const input = await collect(await downloadContentFromMessage(source.media, source.type));
        if (!input.length) throw new Error('The media download was empty.');
        if (input.length > 64 * 1024 * 1024) throw new Error('Media is larger than the 64 MB conversion limit.');
        await fs.writeFile(inputPath, input);
        await execFileAsync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', '-y', '-i', inputPath, '-vn', '-codec:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', '-ac', '2', outputPath], { timeout: 120000, maxBuffer: 1024 * 1024 });
        const mp3 = await fs.readFile(outputPath);
        if (!mp3.length) throw new Error('The converted MP3 was empty.');
        return await sock.sendMessage(chatId, { audio: mp3, mimetype: 'audio/mpeg', fileName: 'converted.mp3', ptt: false }, { quoted: msg });
    } catch (error) {
        console.error('MP3 conversion error:', error);
        return sock.sendMessage(chatId, { text: `MP3 conversion failed: ${error.message}` }, { quoted: msg });
    } finally {
        await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
};
