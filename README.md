# ARSHYXBILLA BOT v3.0

Ultimate WhatsApp Automation Tool with 120+ Commands

## Features

- 120+ WhatsApp Commands
- Hacking & Dangerous Tools
- Group Management
- Media Download (YouTube, TikTok, Instagram, etc.)
- Image Editing Tools
- Islamic Commands
- Fun & Games
- AI Chatbot
- Anti-Delete, Anti-Link, Anti-Call
- Auto-Status Viewer
- Web Dashboard with Broadcast
- Telegram Pairing System
- Premium User System

## Installation

```bash
npm install
npm start
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| TELEGRAM_BOT_TOKEN | Bot token from @BotFather |
| OWNER_NUMBER | Your WhatsApp number |
| OWNER_TELEGRAM_ID | Your Telegram ID |
| OPENAI_API_KEY | OpenAI API key (optional) |
| ADMIN_PASSWORD | Dashboard password |
| PORT | Web dashboard port |

## Command Categories

- **Media Download**: song, video, youtube, instagram, tiktok, facebook, etc.
- **Group Management**: kick, add, promote, demote, mute, revoke, etc.
- **Tools**: weather, github, ipinfo, whois, portscan, etc.
- **Fun**: joke, meme, dare, truth, ship, trivia, etc.
- **Islamic**: quran, hadith, prayer, qibla, asmaulhusna
- **System**: uptime, serverinfo, speedtest, device

## Web Dashboard

Access at `http://localhost:3000`

Set a strong `ADMIN_PASSWORD` environment variable before deployment; no default password is configured.

## License

MIT


## ARSHYXBILLA menu, pairing and cards
- `.menu` lists the main sections. Use `.automation` for automation commands.
- In a group where the bot is an admin: `.groupcard welcome on`, `.groupcard goodbye on`, or `.groupcard admin on`. Use `.groupcard status` to review settings.
- `.adminmsg <text>` sends an admin alert card. With the admin card enabled, ordinary text messages from group admins are also echoed in the card style.
- In a private chat, the bot owner can set `.presencecard offline`, `.presencecard busy`, or `.presencecard online`; `.presencecard off` disables these auto-replies. A 20-minute per-chat cooldown is applied.
- Each of the six card types has 30 randomized phrase variations. Welcome/goodbye use WhatsApp group participant events.
- Pairing requests begin sooner, but the pairing code itself is issued by WhatsApp and cannot be manually customized. WhatsApp Channel join/leave events and other users' global online status are not reliably exposed by the Baileys group-bot API.
- The admin-card feature echoes admin text in a card; WhatsApp has already delivered the original admin message, so the bot cannot replace it retroactively.
- The web pairing page is `index.html`; the three template videos are served from `public/assets/`.

## Railway deployment

Create a Railway service from the private GitHub repository and deploy from the repository root. Railway uses `railway.toml` and runs `npm start`; the web dashboard binds to Railway's `PORT` and exposes `/health` for health checks.

Set these variables in Railway's service variables (never commit their values): `TELEGRAM_BOT_TOKEN`, `OWNER_NUMBER`, `OWNER_TELEGRAM_ID`, and a strong unique `ADMIN_PASSWORD`. `OPENAI_API_KEY` is optional. Attach a persistent Railway volume at `/app/auth_info` and another at `/app/data` so WhatsApp authentication and bot settings survive redeploys. Pair the WhatsApp account through the dashboard after the service is healthy.

Do not commit `.env`, WhatsApp authentication files, or pairing/session data. The repository's `.gitignore` excludes these paths.
