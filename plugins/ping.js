const config = require('../config');
const { cmd } = require('../command');

// First Ping: Fancy Reaction + Speed Measurement
cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // React first
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = Date.now();
        const speed = (end - start).toFixed(2);

        const msg = `> *𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 SPEED: ${speed}ms ${reactionEmoji}*`;

        await conn.sendMessage(from, {
            text: msg,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363400480173280@newsletter',
                    newsletterName: "𝐃𝐀𝐕𝐄-𝐗𝐌𝐃",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Ping command error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});


// Second Ping: Simple Pinging and Return
cmd({
    pattern: "ping2",
    desc: "Simple bot response speed test.",
    category: "main",
    react: "🍂",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const start = Date.now();
        const tempMsg = await conn.sendMessage(from, { text: '*PINGING...*' });
        const end = Date.now();
        const ping = end - start;

        await conn.sendMessage(from, {
            text: `*🔥 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃 SPEED : ${ping}ms*`
        }, { quoted: tempMsg });

    } catch (e) {
        console.error("Ping2 command error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});