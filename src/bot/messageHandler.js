import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { sendMainMenu } from "../commands/menu.js";
import { optOutCustomer, broadcastToFileList } from "../utils/broadcast.js";

const processedMessageIds = new Set();
const MAX_TRACKED_IDS = 500;

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

/**
 * Parses "/broadcast Message | Button Text | https://url.com"
 * into { text, cta }. If no pipes are present, cta is null and
 * the whole remainder is treated as plain text (backward compatible).
 */
function parseBroadcastInput(raw) {

    const parts = raw.split("|").map(p => p.trim());

    if (parts.length === 3 && parts[2].length > 0) {

        let url = parts[2];

        // Auto-fix common URL shorthand
        if (!/^https?:\/\//i.test(url)) {
            url = `https://${url}`;
        }

        return {
            text: parts[0],
            cta: {
                buttonText: parts[1],
                url
            }
        };

    }

    return { text: raw.trim(), cta: null };

}

export async function messageHandler(sock, message) {

    const msg = message.messages[0];

    if (!msg.message) return;

    if (msg.key.fromMe) return;

    const msgId = msg.key.id;

    if (processedMessageIds.has(msgId)) {
        console.log(`🔁 Duplicate message event skipped: ${msgId}`);
        return;
    }

    processedMessageIds.add(msgId);

    if (processedMessageIds.size > MAX_TRACKED_IDS) {
        const oldest = processedMessageIds.values().next().value;
        processedMessageIds.delete(oldest);
    }

    const sender = msg.key.remoteJid;

    const imageMsg = msg.message.imageMessage;
    const videoMsg = msg.message.videoMessage;

    const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        imageMsg?.caption ||
        videoMsg?.caption ||
        "";

    const body = text.trim();
    const bodyLower = body.toLowerCase();

    console.log("📩 Message:", bodyLower);
    console.log("🪪 remoteJid:", sender, "| remoteJidAlt:", msg.key.remoteJidAlt);

    // ── Owner-only broadcast command ────────────────────────────
    if (bodyLower.startsWith("/broadcast")) {

        const isOwner = isOwnerMessage(msg);

        console.log("🔑 isOwner:", isOwner);

        if (!isOwner) {
            console.log(`⛔ Unauthorized broadcast attempt from ${sender}`);
            return;
        }

        const rawInput = body.slice("/broadcast".length).trim();

        let media = null;

        if (imageMsg || videoMsg) {

            try {

                const buffer = await downloadMediaMessage(msg, "buffer", {});

                media = {
                    buffer,
                    type: imageMsg ? "image" : "video",
                    mimetype: (imageMsg || videoMsg).mimetype
                };

                console.log(`📎 Media captured: ${media.type} (${buffer.length} bytes)`);

            } catch (err) {

                console.error("❌ Failed to download media:", err.message);

                await sock.sendMessage(sender, {
                    text: `Failed to process the attached media. Please try again.`
                });

                return;

            }

        }

        if (!rawInput && !media) {

            await sock.sendMessage(sender, {
                text: `Usage:

/broadcast Your message here

With a link button:
/broadcast Your message | Button Text | https://yourlink.com

Attach an image/video with either format as the caption to include media.`
            });

            return;

        }

        const { text: broadcastText, cta } = parseBroadcastInput(rawInput);

        if (cta) {
            console.log(`🔗 CTA button requested — text: "${cta.buttonText}", url: ${cta.url}`);
        }

        await sock.sendMessage(sender, {
            text: `📢 Broadcast started. Check Render logs for progress.`
        });

        broadcastToFileList(sock, broadcastText, 10, 60, media, cta);

        return;

    }

    switch (bodyLower) {

        case "stop":
        case "unsubscribe":

            await optOutCustomer(msg);

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
