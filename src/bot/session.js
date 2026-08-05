import { getSocket } from "./connect.js";

export async function generatePairingCode(phoneNumber) {

    const sock = getSocket();

    if (!sock) {
        throw new Error("WhatsApp socket is not connected.");
    }

    console.log("==================================");
    console.log("📱 Pairing Request Started");
    console.log("Socket User:", sock.user);
    console.log("Socket ReadyState:", sock.ws?.readyState);

    const formattedPhone = phoneNumber.replace(/\D/g, "");

    console.log("Phone Number:", formattedPhone);

    try {

        console.log("🔄 Requesting Pairing Code...");

        const code = await sock.requestPairingCode(formattedPhone);

        console.log("✅ Pairing Code Generated:", code);
        console.log("==================================");

        return code;

    } catch (err) {

        console.error("❌ Pairing Error");
        console.error(err);
        console.log("==================================");

        throw err;

    }

}
