import { sendMainMenu } from "../commands/menu.js";
import { addLead } from "../data/leads.js";

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

    console.log("📩 Message:", body);

    switch (body) {

        case "hi":
        case "hello":
        case "menu":

            await sendMainMenu(sock, sender);

            break;

        case "1":

            await sock.sendMessage(sender, {
                text: `🌐 *Website Development*

✔ Business Website
✔ Portfolio Website
✔ Restaurant Website
✔ Landing Page
✔ E-Commerce Website

Reply *YES* if you're interested.`
            });

            break;

        case "2":

            await sock.sendMessage(sender, {
                text: `🎥 *Video Editing*

✔ Instagram Reels
✔ Commercial Ads
✔ YouTube Videos
✔ Cinematic Videos

Reply *YES* if you're interested.`
            });

            break;

        case "3":

            await sock.sendMessage(sender, {
                text: `🎨 *Branding*

✔ Logo Design
✔ Brand Identity
✔ Social Media Design

Reply *YES* if you're interested.`
            });

            break;

        case "4":

            await sock.sendMessage(sender, {
                text: `🤖 *Automation Services*

✔ WhatsApp Chatbots
✔ WhatsApp Auto Replies
✔ Lead Collection
✔ Appointment Booking
✔ Website Contact Automation
✔ Business Workflow Automation

Reply *YES* if you're interested.`
            });

            break;

        case "5":

            await sock.sendMessage(sender, {
                text: `📂 *Portfolio*

Our portfolio website will be available soon.`
            });

            break;

        case "6":

            await sock.sendMessage(sender, {
                text: `📞 *Contact Urban Sync*

👤 ${process.env.OWNER_NAME}
📱 ${process.env.OWNER_NUMBER}

Thank you for contacting us ❤️`
            });

            break;

        case "yes":

            addLead({
                phone: sender,
                service: "Interested"
            });

            await sock.sendMessage(sender, {
                text: `✅ Thank you for choosing *Urban Sync*.

Please send:

👤 Your Name
🏢 Business Name
📍 Location
📝 Your Requirements

Our team will contact you shortly.`
            });

            break;

        default:

            await sock.sendMessage(sender, {
                text: `❓ Unknown command.

Send *Hi* to view the main menu.`
            });

    }

}
