import Customer from "../models/Customer.js";
import { loadCustomerList } from "./customerList.js";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function broadcastToFileList(
    sock,
    messageText,
    minDelaySeconds = 10,
    maxDelaySeconds = 60
) {

    const customers = loadCustomerList();

    const optedOutDocs = await Customer.find({ optedOut: true }, "phone");
    const optedOutSet = new Set(optedOutDocs.map(doc => doc.phone));

    const targets = customers.filter(c => !optedOutSet.has(c.phone));

    console.log(`📢 Starting broadcast to ${targets.length} customers (${customers.length - targets.length} opted out, skipped)`);

    let sent = 0;
    let failed = 0;

    for (const customer of targets) {

        try {

            const jid = `${customer.phone}@s.whatsapp.net`;

            await sock.sendMessage(jid, {
                text: `${messageText}\n\n_Reply STOP to unsubscribe from these updates._`
            });

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

export async function optOutCustomer(phone) {

    const cleanPhone = phone.replace("@s.whatsapp.net", "");

    await Customer.findOneAndUpdate(
        { phone: cleanPhone },
        { phone: cleanPhone, optedOut: true },
        { upsert: true }
    );

    console.log(`🚫 Customer ${cleanPhone} opted out`);

}
