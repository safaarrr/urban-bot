export async function sendMainMenu(sock, sender) {

    await sock.sendMessage(sender, {
        text: `👋 *Welcome to Urban Sync*

We help businesses grow with creative and digital solutions.

━━━━━━━━━━━━━━

1️⃣ Website Development

2️⃣ Video Editing

3️⃣ Branding

4️⃣ Portfolio

5️⃣ Contact Us

━━━━━━━━━━━━━━

Reply with the number to continue.`
    });

}
