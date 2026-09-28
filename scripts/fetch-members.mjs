import { readFileSync, writeFileSync, existsSync } from 'fs';

if (existsSync('.env')) {
    for (const line of readFileSync('.env', 'utf8').split('\n')) {
        const match = line.match(/^\s*([\w]+)\s*=\s*(.+)\s*$/);
        if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
}

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.GUILD_ID;

if (!token || !guildId) {
    console.error('DISCORD_TOKEN ve GUILD_ID ortam değişkenleri gerekli.');
    process.exit(1);
}

const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members?limit=1000`, {
    headers: { Authorization: `Bot ${token}` }
});

if (!res.ok) {
    console.error(`Discord API hatası: ${res.status} ${await res.text()}`);
    process.exit(1);
}

const raw = await res.json();

const members = raw
    .filter(m => !m.user.bot)
    .map(m => ({
        name: m.nick || m.user.global_name || m.user.username,
        avatar: m.user.avatar
            ? `https://cdn.discordapp.com/avatars/${m.user.id}/${m.user.avatar}.png?size=256`
            : `https://cdn.discordapp.com/embed/avatars/${(BigInt(m.user.id) >> 22n) % 6n}.png`
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'));

writeFileSync('members.json', JSON.stringify({ updatedAt: new Date().toISOString(), count: members.length, members }, null, 2));
console.log(`${members.length} üye members.json dosyasına yazıldı.`);
