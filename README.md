# KER — ARSHYXBILLA BOT

WhatsApp bot with group management, local Roman Urdu fun commands, safety controls, and web pairing

## Features

- WhatsApp command menus with command-only listings
- Group Management
- Media and utility commands where the required provider is available
- Image Editing Tools
- Islamic Commands
- Fun & Games
- Anti-Delete, Anti-Link, Anti-Call
- Auto-Status Viewer
- Web Dashboard with password-protected admin access
- WhatsApp pairing dashboard
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
| ADMIN_PASSWORD | Strong server-only dashboard password (minimum 12 characters) |
| PORT | Web dashboard port |

## Command Categories

- **Media Download**: video, youtube, instagram, tiktok, facebook, etc.
- **Group Management**: kick, add, promote, demote, mute, revoke, etc.
- **Tools**: weather, github, ipinfo, whois, portscan, etc.
- **Fun**: Roman Urdu joke/meme/dare/truth, Urdu poetry, safe fake hack animation
- **Islamic**: quran, hadith, prayer, qibla, asmaulhusna
- **System**: uptime, serverinfo, speedtest, device

## Web Dashboard

Access at `http://localhost:3000`

Set a unique `ADMIN_PASSWORD` with at least 12 characters in the server environment before deployment; there is no built-in password. The dashboard's sign-in screen is only a local UI gate. `ADMIN_PASSWORD` is verified only for Admin Access. WhatsApp pairing requests are independent of Admin Access. The bot cannot force WhatsApp to send its pairing notification; WhatsApp controls code and notification delivery.

## License

MIT


## ARSHYXBILLA menu, pairing and cards
- `.menu` lists the main sections. Use `.automation` for automation commands.
- In a group where the bot is an admin: `.groupcard welcome on`, `.groupcard goodbye on`, or `.groupcard admin on`. Use `.groupcard status` to review settings.
- `.adminmsg <text>` sends an admin alert card. With the admin card enabled, ordinary text messages from group admins are also echoed in the card style.
- In a private chat, the bot owner can set `.presencecard offline`, `.presencecard busy`, or `.presencecard online`; `.presencecard off` disables these auto-replies. A 20-minute per-chat cooldown is applied.
- Each of the six card types has 30 randomized phrase variations. Welcome/goodbye use WhatsApp group participant events.
- Pairing requests wait for Baileys' readiness event before asking WhatsApp for a code. On the phone, open **WhatsApp → Settings → Linked Devices → Link a Device → Link with phone number instead** and enter the code displayed by the dashboard. WhatsApp issues the code; the app cannot force a WhatsApp push notification.
- The admin-card feature echoes admin text in a card; WhatsApp has already delivered the original admin message, so the bot cannot replace it retroactively.
- The web pairing page is `index.html`; the three muted H.264 Baseline background videos and their poster fallbacks are served from `public/assets/`.

## Railway deployment

Create a Railway service from the public GitHub repository and deploy from the repository root. Railway uses `railway.toml` and runs `npm start`; the web dashboard binds to Railway's `PORT` and exposes `/health` for health checks.

Set these variables in Railway's service variables (never commit their values): `TELEGRAM_BOT_TOKEN`, `OWNER_NUMBER`, `OWNER_TELEGRAM_ID`, and a strong unique `ADMIN_PASSWORD`. Attach a persistent Railway volume at `/app/auth_info` and another at `/app/data` so WhatsApp authentication and bot settings survive redeploys. Pair the WhatsApp account through the dashboard after the service is healthy.

Do not commit `.env`, WhatsApp authentication files, or pairing/session data. The repository's `.gitignore` excludes these paths.
