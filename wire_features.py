from pathlib import Path
p=Path('/tmp/arshy_update/index.js')
s=p.read_text()
# Import card helpers and persist per-group and per-session automation state.
if "const cardTools = require('./commands/cards');" not in s:
    s=s.replace("const { AsyncLocalStorage } = require('async_hooks');", "const { AsyncLocalStorage } = require('async_hooks');\nconst cardTools = require('./commands/cards');")
s=s.replace("let botData = { antilinkGroups: {}, totalBots: 0, registeredBots: [], statusSettings: {}, antiDelete: {}, userNames: {}, antiCall: {}, broadcastHistory: [] };", "let botData = { antilinkGroups: {}, totalBots: 0, registeredBots: [], statusSettings: {}, antiDelete: {}, userNames: {}, antiCall: {}, broadcastHistory: [], groupCards: {}, groupMemberCounts: {}, presenceCards: {}, cardReplyCooldowns: {} };")
# Normalize persisted keys for older bot_data.json files.
s=s.replace("if (fs.existsSync(DATA_FILE)) {\n    try { botData = fs.readJsonSync(DATA_FILE); } catch (e) {}\n}", "if (fs.existsSync(DATA_FILE)) {\n    try { botData = { ...botData, ...fs.readJsonSync(DATA_FILE) }; } catch (e) {}\n}\nfor (const key of ['groupCards','groupMemberCounts','presenceCards','cardReplyCooldowns']) if (!botData[key] || typeof botData[key] !== 'object') botData[key] = {};")
# Fast-but-not-racy pairing request: shave 2 seconds while leaving WhatsApp socket time to come up.
s=s.replace('await delay(3000);\n                    try {\n                        let code = await this.sock.requestPairingCode(pairingNumber);', 'await delay(1000);\n                    try {\n                        let code = await this.sock.requestPairingCode(pairingNumber);',1)
# Event handler for real group participant events.
anchor="            this.sock.ev.on('messages.upsert', async (m) => {"
handler="""            this.sock.ev.on('group-participants.update', async (event) => {
                try {
                    const jid = event.id;
                    if (!jid || !jid.endsWith('@g.us')) return;
                    const groupSettings = botData.groupCards[jid] || {};
                    if (!groupSettings.welcome && !groupSettings.goodbye) return;
                    const metadata = await this.sock.groupMetadata(jid);
                    const participants = Array.isArray(event.participants) ? event.participants : [];
                    for (const participant of participants) {
                        if (event.action !== 'add' && event.action !== 'remove') continue;
                        const kind = event.action === 'add' ? 'welcome' : 'goodbye';
                        if (!groupSettings[kind]) continue;
                        const countMap = botData.groupMemberCounts[jid] || (botData.groupMemberCounts[jid] = { joined: 0, left: 0 });
                        countMap[kind === 'welcome' ? 'joined' : 'left'] = (countMap[kind === 'welcome' ? 'joined' : 'left'] || 0) + 1;
                        const text = cardTools.render(kind, {
                            mention: '@' + String(participant).split('@')[0],
                            count: countMap[kind === 'welcome' ? 'joined' : 'left'],
                            time: new Date().toLocaleString(),
                            members: metadata.participants.length,
                            group: metadata.subject
                        });
                        await this.sock.sendMessage(jid, { text, mentions: [participant] });
                    }
                    saveBotData();
                } catch (error) { this.sendLog('Group card event failed: ' + error.message, 'warning'); }
            });
"""
if handler not in s: s=s.replace(anchor,handler+anchor,1)
# Add admin-authored ordinary text card after admin status has been established.
anchor="                        // Anti-status in groups\n"
admin="""                        if (isGroup && isAdmin && !isMe && text && !text.startsWith('.') && botData.groupCards[from]?.admin) {
                            const metadata = await this.sock.groupMetadata(from);
                            const card = cardTools.render('admin', { mention: '@' + sender.split('@')[0], time: new Date().toLocaleString(), group: metadata.subject, message: text });
                            await this.sock.sendMessage(from, { text: card, mentions: [sender] });
                        }
"""
if admin not in s: s=s.replace(anchor,admin+anchor,1)
# DM availability card response with a per-chat 20-minute cooldown.
anchor="                        // Auto-react\n"
autoreply="""                        if (!isMe && !isGroup && text && !text.startsWith('.')) {
                            const availability = botData.presenceCards[this.userId];
                            const mode = availability && availability.mode;
                            if (['offline', 'busy', 'online'].includes(mode)) {
                                const last = botData.cardReplyCooldowns[from] || 0;
                                if (Date.now() - last >= 20 * 60 * 1000) {
                                    await this.sock.sendMessage(from, { text: cardTools.render(mode, { time: new Date().toLocaleString() }) }, { quoted: msg });
                                    botData.cardReplyCooldowns[from] = Date.now();
                                    saveBotData();
                                }
                            }
                        }
"""
if autoreply not in s: s=s.replace(anchor,autoreply+anchor,1)
# Replace old .menu + separate audio attachment with section map and remove obsolete audio file send.
start=s.index("                                        case 'menu': {")
end=s.index("                                        case 'allmenu':",start)
menu="""                                        case 'menu': {
                                            const menuText = `╭━━━〔 ARSHYXBILLA MENU 〕━━━╮

✦ MAIN SECTIONS
• .automation  — automation commands
• .groupcard   — welcome/goodbye/admin cards
• .groupmenu   — group tools
• .ownermenu   — owner tools
• .downloadmenu — download commands
• .aimenu      — AI commands
• .toolsmenu   — utility commands
• .allmenu     — full command index

✦ QUICK START
• .automation
• .groupcard
• .groupcard welcome on
• .groupcard goodbye on

📢 ${settings.whatsappChannel}
👥 ${settings.whatsappGroups.join('\\n👥 ')}

╰━━━━━━━━━━━━━━━━━━━━━━━━╯`;
                                            try { await this.sock.sendMessage(from, { image: { url: settings.startimage }, caption: menuText }, { quoted: msg }); }
                                            catch (e) { await this.sock.sendMessage(from, { text: menuText }, { quoted: msg }); }
                                            break;
                                        }
"""
s=s[:start]+menu+s[end:]
# Insert automation and card menu commands ahead of allmenu.
anchor="                                        case 'allmenu': \n"
commands="""                                        case 'automation': case 'automationmenu': {
                                            const text = `╭━━━〔 AUTOMATION 〕━━━╮
• .autoread on/off
• .autostatus on/off
• .autoreacts on/off
• .presencecard offline|busy|online|off
• .groupcard welcome on/off
• .groupcard goodbye on/off
• .groupcard admin on/off
• .adminmsg <announcement>
• .groupcard status

Group cards require the bot to be a group admin. Presence cards are private-chat auto-replies with a 20-minute per-chat cooldown.\n
Powered by ARSHY`;
                                            await this.sock.sendMessage(from, { text }, { quoted: msg });
                                            break;
                                        }
                                        case 'groupcard': case 'card': {
                                            if (!isGroup) { await this.sock.sendMessage(from, { text: 'Use .groupcard inside a WhatsApp group.' }, { quoted: msg }); break; }
                                            const [cardType, cardAction] = args.map(x => x.toLowerCase());
                                            const cfg = botData.groupCards[from] || (botData.groupCards[from] = {});
                                            if (!cardType || cardType === 'status') {
                                                await this.sock.sendMessage(from, { text: `Group cards — welcome: ${cfg.welcome ? 'ON' : 'OFF'}, goodbye: ${cfg.goodbye ? 'ON' : 'OFF'}, admin: ${cfg.admin ? 'ON' : 'OFF'}\\nUse .groupcard <welcome|goodbye|admin> <on|off>` }, { quoted: msg });
                                                break;
                                            }
                                            if (!['welcome','goodbye','admin'].includes(cardType) || !['on','off'].includes(cardAction)) {
                                                await this.sock.sendMessage(from, { text: 'Usage: .groupcard <welcome|goodbye|admin> <on|off>' }, { quoted: msg }); break;
                                            }
                                            if (!isAdmin) { await this.sock.sendMessage(from, { text: 'Only group admins can change card settings.' }, { quoted: msg }); break; }
                                            cfg[cardType] = cardAction === 'on'; saveBotData();
                                            await this.sock.sendMessage(from, { text: `${cardType} card ${cfg[cardType] ? 'enabled' : 'disabled'}.\\n30 randomized lines are available for this card type.` }, { quoted: msg });
                                            break;
                                        }
                                        case 'welcomecard': case 'goodbyecard': case 'admincard': {
                                            if (!isGroup) { await this.sock.sendMessage(from, { text: 'Run this inside a group.' }, { quoted: msg }); break; }
                                            if (!isAdmin) { await this.sock.sendMessage(from, { text: 'Only group admins can change card settings.' }, { quoted: msg }); break; }
                                            const type = commandName === 'welcomecard' ? 'welcome' : commandName === 'goodbyecard' ? 'goodbye' : 'admin';
                                            const mode = (args[0] || '').toLowerCase();
                                            if (!['on','off'].includes(mode)) { await this.sock.sendMessage(from, { text: `Usage: .${commandName} <on|off>` }, { quoted: msg }); break; }
                                            const cfg = botData.groupCards[from] || (botData.groupCards[from] = {}); cfg[type] = mode === 'on'; saveBotData();
                                            await this.sock.sendMessage(from, { text: `${type} card ${mode}.` }, { quoted: msg }); break;
                                        }
                                        case 'adminmsg': {
                                            if (!isGroup || !isAdmin) { await this.sock.sendMessage(from, { text: 'Only a group admin can send an admin card in a group.' }, { quoted: msg }); break; }
                                            if (!q) { await this.sock.sendMessage(from, { text: 'Usage: .adminmsg <announcement text>' }, { quoted: msg }); break; }
                                            const metadata = await this.sock.groupMetadata(from);
                                            await this.sock.sendMessage(from, { text: cardTools.render('admin', { mention: '@' + sender.split('@')[0], time: new Date().toLocaleString(), group: metadata.subject, message: q }), mentions: [sender] }, { quoted: msg }); break;
                                        }
                                        case 'presencecard': {
                                            if (!isOwner && !isMe && !isSessionUser) { await this.sock.sendMessage(from, { text: 'Only the bot owner/session owner can change availability cards.' }, { quoted: msg }); break; }
                                            const mode = (args[0] || '').toLowerCase();
                                            if (!['offline','busy','online','off'].includes(mode)) { await this.sock.sendMessage(from, { text: 'Usage: .presencecard <offline|busy|online|off>' }, { quoted: msg }); break; }
                                            botData.presenceCards[this.userId] = { mode: mode === 'off' ? null : mode }; saveBotData();
                                            await this.sock.sendMessage(from, { text: mode === 'off' ? 'Availability auto-replies disabled.' : `${mode} card enabled for private chats (20-minute cooldown per chat).` }, { quoted: msg }); break;
                                        }
"""
if commands not in s: s=s.replace(anchor,commands+anchor,1)
# .automation section support in new .menu index and default command processing.
p.write_text(s)
