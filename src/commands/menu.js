export async function sendMainMenu(sock, sender) {

    await sock.sendMessage(sender, {
        text: `*Welcome to Urban Sync* 👋

We help businesses grow through creative and digital solutions tailored to your goals.

Please select a service from the list below by replying with the corresponding number.

──────────────

*1.* Website Development
*2.* Video Editing
*3.* Branding
*4.* Automation
*5.* Portfolio
*6.* Contact Us

──────────────

Reply with a number (1–6) to continue.`
    });

}
