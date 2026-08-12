import Customer from "../models/Customer.js";
import { loadCustomerList } from "./customerList.js";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const UNSUBSCRIBE_FOOTER = "Reply STOP to unsubscribe from these updates.";

function getPhoneFromJid(jid) {

    if (!jid) return null;

    const [user] = jid.split("@");

    return user.split(":")[0];

}

export async function broadcastToFileList(
    sock,
    messageText,
    minDelaySeconds = 10,
    maxDelaySeconds = 60,
    media = null,
    cta = null
) {

    const customers = loadCustomerList();

    const optedOutDocs = await Customer.find({ optedOut: true }, "phone");
    const optedOutSet = new Set(optedOutDocs.map(doc => doc.phone));

    const targets = customers.filter(c => !optedOutSet.has(c.phone));

    console.log(`📢 Starting broadcast to ${targets.length} customers (${customers.length - targets.length} opted out, skipped)`);

    const buttons = cta ? [
        {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
                display_text: cta.buttonText,
                url: cta.url
            })
        }
    ] : undefined;

    const fullText = `${messageText}\n\n_${UNSUBSCRIBE_FOOTER}_`;

    let sent = 0;
    let failed = 0;

    for (const customer of targets) {

        try {

            const jid = `${customer.phone}@s.whatsapp.net`;

            if (media?.type === "image") {

                await sock.sendMessage(jid, {
                    image: media.buffer,
                    mimetype: media.mimetype,
                    caption: fullText,
                    ...(buttons ? { buttons, footer: UNSUBSCRIBE_FOOTER } : {})
                });

            } else if (media?.type === "video") {

                await sock.sendMessage(jid, {
                    video: media.buffer,
                    mimetype: media.mimetype,
                    caption: fullText,
                    ...(buttons ? { buttons, footer: UNSUBSCRIBE_FOOTER } : {})
                });

            } else {

                await sock.sendMessage(jid, {
                    text: fullText,
                    ...(buttons ? { buttons, footer: UNSUBSCRIBE_FOOTER } : {})
                });

            }

            sent++;

            console.log(`✅ Sent to ${customer.phone} (${sent}/${targets.length})`);

        } catch (err) {

            failed++;
            console.error(`❌ Failed to send to ${customer.phone}:`, err.message);

        }

        const delayMs = (
            minDelaySeconds + Math.random() * (maxDelaySeconds - minDelaySeconds)
        ) * 1000;

        await wait(delayMs);

    }

    console.log(`📢 Broadcast finished. Sent: ${sent}, Failed: ${failed}`);

    return { sent, failed, total: targets.length };

}

export async function optOutCustomer(msg) {

    const sender = msg.key.remoteJid;
    const senderAlt = msg.key.remoteJidAlt;

    const phone = getPhoneFromJid(sender);
    const altPhone = getPhoneFromJid(senderAlt);

    await Customer.findOneAndUpdate(
        { phone },
        { phone, altPhone, optedOut: true },
        { upsert: true }
    );

    console.log(`🚫 Opt-out recorded — phone: ${phone}, altPhone: ${altPhone || "none"}`);

    if (!altPhone) {
        console.log(`⚠️ This opt-out came in as a LID with no phone fallback. If ${phone} doesn't match an entry in customers.json, you may need to manually check which real number this corresponds to and remove it yourself.`);
    }

}
