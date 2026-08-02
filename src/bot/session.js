import { getSocket } from "./connect.js";

export async function generatePairingCode(phoneNumber) {

    const sock = getSocket();

    if (!sock) {
        throw new Error("WhatsApp socket is not connected.");
    }

    if (sock.user) {
        throw new Error("Bot is already connected.");
    }

    const formattedPhone = phoneNumber.replace(/\D/g, "");

    const code = await sock.requestPairingCode(formattedPhone);

    return code;

}
