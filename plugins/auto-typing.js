const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd } = require('../command');

// In-memory auto typing toggle state per chat
const typingState = {}; // { [chatId]: true | false }

// Command to toggle Auto Typing in each chat
cmd({
    pattern: "autotyping ?(on|off)?",
    desc: "Toggle AutoTyping per chat",
    category: "presence",
    react: "✍️",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    const input = args[0]?.toLowerCase();

    if (!input) {
        const status = typingState[from] ? "ON ✅" : "OFF ❌";
        return reply(`✍️ AutoTyping is currently *${status}*\n\nUse: ${config.PREFIX}autotyping on / off`);
    }

    if (input === "on") {
        typingState[from] = true;
        return reply("✅ AutoTyping has been *enabled* for this chat.");
    } else if (input === "off") {
        typingState[from] = false;
        return reply("❌ AutoTyping has been *disabled* for this chat.");
    } else {
        return reply("⚠️ Invalid option. Use:\n.autotyping on\n.autotyping off");
    }
});

// Passive listener to trigger typing if enabled
cmd({
    on: "all",
    dontAddCommandList: true,
    filename: __filename
}, async (conn, mek, m, { from }) => {
    if (typingState[from] || config.AUTO_TYPING === 'true') {
        await conn.sendPresenceUpdate('composing', from);
    }
});