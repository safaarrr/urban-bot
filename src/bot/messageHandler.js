import { sendMainMenu } from "../commands/menu.js";

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

Name: ${process.env.OWNER_NAME}
Phone: ${process.env.OWNER_NUMBER}

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
