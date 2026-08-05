import { getSocket } from "./connect.js";

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function generatePairingCode(phoneNumber) {

    const sock = getSocket();

    if (!sock) {
        throw new Error("WhatsApp socket is not connected.");
    }

    if (sock.user) {
        throw new Error("Bot is already connected.");
    }

    const formattedPhone = phoneNumber.replace(/\D/g, "");

    console.log("==================================");
    console.log("📱 Pairing Request Started");
    console.log("Phone:", formattedPhone);
    console.log("Waiting for socket to initialize...");

    // Wait 5 seconds before requesting the pairing code
    await wait(5000);

    try {

        console.log("🔄 Requesting Pairing Code...");

        const code = await sock.requestPairingCode(formattedPhone);

        console.log("✅ Pairing Code:", code);
        console.log("==================================");

        return code;

    } catch (err) {

        console.error("❌ Pairing Error:", err);
        console.log("==================================");

        throw err;

    }

}
