import { sendMainMenu } from "../commands/menu.js";
import { optOutCustomer, broadcastToFileList } from "../utils/broadcast.js";

function getPhoneFromJid(jid) {

    if (!jid) return null;

    const [user] = jid.split("@");

    return user.split(":")[0];

}

function isOwnerMessage(msg) {

    const sender = msg.key.remoteJid;
    const senderAlt = msg.key.remoteJidAlt;

    const senderId = getPhoneFromJid(sender);
    const senderAltId = getPhoneFromJid(senderAlt);

    if (senderId === process.env.OWNER_NUMBER) return true;
    if (senderAltId === process.env.OWNER_NUMBER) return true;

    if (senderId === process.env.OWNER_LID) return true;
    if (senderAltId === process.env.OWNER_LID) return true;

    return false;

}

export async function messageHandler(sock, message) {

    const msg = message.messages[0];

    if (!msg.message) return;

    if (msg.key.fromMe) return;

    const sender = msg.key.remoteJid;

    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        "";

    const body = text.trim();
    const bodyLower = body.toLowerCase();

    console.log("📩 Message:", bodyLower);
    console.log("🪪 remoteJid:", sender, "| remoteJidAlt:", msg.key.remoteJidAlt);

    // ── Owner-only broadcast command ──────────────────────────────
    if (bodyLower.startsWith("/broadcast")) {

        const isOwner = isOwnerMessage(msg);

        console.log("🔑 isOwner:", isOwner);

        if (!isOwner) {
            console.log(`⛔ Unauthorized broadcast attempt from ${sender}`);
            return;
        }

        const broadcastText = body.slice("/broadcast".length).trim();

        if (!broadcastText) {

            await sock.sendMessage(sender, {
                text: `Usage: /broadcast Your message here`
            });

            return;

        }

        await sock.sendMessage(sender, {
            text: `📢 Broadcast started. Check Render logs for progress.`
        });

        broadcastToFileList(sock, broadcastText);

        return;

    }

    switch (bodyLower) {

        case "stop":
        case "unsubscribe":

            await optOutCustomer(sender);

            await sock.sendMessage(sender, {
                text: `You have been unsubscribed from promotional messages. You will no longer receive offers or updates.`
            });

            break;

        case "hi":
        case "hello":
        case "menu":

            await sendMainMenu(sock, sender);

            break;

        case "1":

            await sock.sendMessage(sender, {
                text: `*Website Development*

We design and develop modern, high-performing websites tailored to your business needs, including:

• Business Websites
• Portfolio Websites
• Restaurant Websites
• Landing Pages
• E-Commerce Websites

Reply *YES* to proceed, or *Menu* to return to the main menu.`
            });

            break;

        case "2":

            await sock.sendMessage(sender, {
                text: `*Video Editing*

We create polished, professional video content designed to engage your audience, including:

• Instagram Reels
• Commercial Advertisements
• YouTube Videos
• Cinematic Videos

Reply *YES* to proceed, or *Menu* to return to the main menu.`
            });

            break;

        case "3":

            await sock.sendMessage(sender, {
                text: `*Branding*

We help build a strong, consistent brand identity through:

• Logo Design
• Brand Identity Development
• Social Media Design

Reply *YES* to proceed, or *Menu* to return to the main menu.`
            });

            break;

        case "4":

            await sock.sendMessage(sender, {
                text: `*Automation Services*

We streamline your business operations with tailored automation solutions, including:

• WhatsApp Chatbots
• WhatsApp Auto-Replies
• Lead Collection Systems
• Appointment Booking
• Website Contact Automation
• Business Workflow Automation

Reply *YES* to proceed, or *Menu* to return to the main menu.`
            });

            break;

        case "5":

            await sock.sendMessage(sender, {
                text: `*Portfolio*

Our portfolio is currently being updated and will be available shortly.

Reply *Menu* to return to the main menu.`
            });

            break;

        case "6":

            await sock.sendMessage(sender, {
                text: `*Contact Urban Sync*

Co-founder & Creative head
Name: Safar
Phone: +918075641889

Co-founder & Marketing manager
Name: Sabari Nath
Phone: +919847799791
Thank you for reaching out to us. We look forward to assisting you.`
            });

            break;

        case "yes":

            await sock.sendMessage(sender, {
                text: `Thank you for your interest in *Urban Sync*.

To proceed, kindly share the following details:

• Full Name
• Business Name
• Location
• Requirements

Our team will get in touch with you shortly.`
            });

            break;

        default:

            await sock.sendMessage(sender, {
                text: `We did not recognize that response.

Please send *Hi* or *Menu* to view the main menu.`
            });

    }

}
