export async function messageHandler(sock, message) {

    const msg = message.messages[0];

    if (!msg.message) return;

    if (msg.key.fromMe) return;

    const sender = msg.key.remoteJid;

    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

    const body = text.toLowerCase().trim();

    console.log("Message :", body);

    switch (body) {

        case "hi":

        case "hello":

            await sock.sendMessage(sender, {

                text:
`👋 Welcome to Urban Sync

Choose a service

1️⃣ Website Development

2️⃣ Video Editing

3️⃣ Branding

4️⃣ Contact`

            });

            break;

        case "1":

            await sock.sendMessage(sender, {

                text:
`🌐 Website Development

✔ Business Websites
✔ Portfolio Websites
✔ Landing Pages
✔ E-Commerce

Reply YES to continue.`

            });

            break;

        case "2":

            await sock.sendMessage(sender, {

                text:
`🎥 Video Editing

✔ Reels
✔ Commercial Ads
✔ Cinematic Videos

Reply YES to continue.`

            });

            break;

        case "3":

            await sock.sendMessage(sender, {

                text:
`🎨 Branding

✔ Logo Design
✔ Brand Identity
✔ Social Media Design`

            });

            break;

        case "4":

            await sock.sendMessage(sender, {

                text:
`📞 Urban Sync

📱 +91XXXXXXXXXX

🌐 www.urbansync.in`

            });

            break;

        default:

            await sock.sendMessage(sender, {

                text:
`❓ Unknown command.

Send *Hi* to open the menu.`

            });

    }

}
