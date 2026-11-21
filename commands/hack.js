'use strict';
const animations = [
 ['Booting pretend terminal','Loading pixel tools','Scanning imaginary matrix','Progress: 100%','Simulation complete'],
 ['Connecting to localhost','Checking fictional firewall','No real system contacted','Progress: 100%','All safe'],
 ['Starting neon console','Decrypting a made-up cipher','Generating green pixels','Progress: 100%','Just a visual joke'],
 ['Opening virtual console','Counting digital sheep','Found 42 imaginary files','Progress: 100%','Nothing was accessed'],
 ['Launching demo sequence','Mapping pretend network','Every address is fictional','Progress: 100%','Demo finished'],
 ['Warming up keyboard','Typing at 9000 WPM','Coffee level: critical','Progress: 100%','Keyboard hero mode'],
 ['Starting cyber theater','Rendering green rain','No packets sent','Progress: 100%','Stage effect complete'],
 ['Checking imaginary server','Server says: hello','No login attempted','Progress: 100%','Friendly simulation'],
 ['Loading safe mode','Creating fake access logs','No real files read','Progress: 100%','Safe mode remains on'],
 ['Running pixel generator','Painting terminal green','Adding dramatic beeps','Progress: 100%','Animation complete'],
 ['Starting demo scanner','Scanning fictional planets','Mars: very dusty','Progress: 100%','Space scan complete'],
 ['Entering pretend mainframe','Searching for snacks','Snacks not detected','Progress: 100%','Try the kitchen'],
 ['Opening mock command line','Calculating coolness','Result: maximum','Progress: 100%','No computer touched'],
 ['Loading cyber style','Adding neon glow','Adding dramatic music','Progress: 100%','Style applied'],
 ['Starting virtual mission','Mission: make tea','Water: ready','Progress: 100%','Tea mission complete'],
 ['Scanning fictional galaxy','Found 3 friendly aliens','They say salam','Progress: 100%','Galaxy simulation done'],
 ['Booting animation engine','Drawing tiny robots','Robot says beep','Progress: 100%','Beep boop'],
 ['Running pretend update','Installing good vibes','Removing bad moods','Progress: 100%','Mood updated'],
 ['Launching harmless demo','Checking imaginary permissions','Everything is pretend','Progress: 100%','Demo safely stopped'],
 ['Starting terminal theater','Rendering green characters','No network activity','Progress: 100%','This was only an animation']
];
async function hackCommand(sock, chatId, msg, q = '') {
    const raw = String(q || '').trim();
    if (raw && !/^\d+$/.test(raw)) return sock.sendMessage(chatId, { text: 'Istemaal: .hack ya .hack 1-20' }, { quoted: msg });
    const index = raw ? Number(raw) - 1 : Math.floor(Math.random() * animations.length);
    if (index < 0 || index >= animations.length) return sock.sendMessage(chatId, { text: 'Animation number 1 se 20 tak chunein.' }, { quoted: msg });
    const sequence = animations[index];
    const body = [`╭━━〔 💻 HACK ANIMATION ${index + 1}/20 〕━━╮`, ...sequence.map((line,i) => `▰ ${String(i+1).padStart(2,'0')}/05  ${line}`), '╰━━ Sirf mazaaq — koi system access ya hacking nahi hui ━━╯'].join('\n');
    return sock.sendMessage(chatId, { text: body }, { quoted: msg });
}
hackCommand.animations = animations;
module.exports = hackCommand;
