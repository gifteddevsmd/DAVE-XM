const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd({
  pattern: 'gitclone',
  alias: ["git"],
  desc: "Download GitHub repository as a zip file.",
  react: '📦',
  category: "downloader",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  args,
  reply
}) => {
  if (!args[0]) {
    return reply("❌ Where is the GitHub link?\n\nExample:\n.gitclone https://github.com/username/repository");
  }

  if (!/^(https:\/\/)?github\.com\/.+/.test(args[0])) {
    return reply("⚠️ Invalid GitHub link. Please provide a valid GitHub repository URL.");
  }

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);

    if (!match) throw new Error("Invalid GitHub URL.");

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    const response = await fetch(zipUrl, { method: "HEAD" });
    if (!response.ok) throw new Error("Repository not found.");

    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition ? contentDisposition.match(/filename=(.*)/)[1] : `${repo}.zip`;

    reply(`📥 *Downloading repository...*\n\n*Repository:* ${username}/${repo}\n*Filename:* ${fileName}\n\n> *Powered by 𝐃𝐀𝐕𝐄-𝐗𝐌𝐃*`);

    await conn.sendMessage(from, {
      document: { url: zipUrl },
      fileName: fileName,
      mimetype: 'application/zip',
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363400480173280@newsletter',
          newsletterName: '𝐃𝐀𝐕𝐄-𝐗𝐌𝐃',
          serverMessageId: 143
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ Failed to download the repository. Please try again later.");
  }
});
