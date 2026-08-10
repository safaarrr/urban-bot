export async function sendMainMenu(sock, sender) {

    await sock.sendMessage(sender, {
        text: `👋 *Welcome to Urban Sync*\n\nWe help businesses grow with creative and digital solutions.\n\nChoose a service below 👇`,
        buttons: [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "🌐 Website Development",
                    id: "1"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "🎥 Video Editing",
                    id: "2"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "🎨 Branding",
                    id: "3"
                })
            }
        ]
    });

}

export async function sendMoreOptions(sock, sender) {

    await sock.sendMessage(sender, {
        text: `More options 👇`,
        buttons: [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "🤖 Automation",
                    id: "4"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "📂 Portfolio",
                    id: "5"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "📞 Contact Us",
                    id: "6"
                })
            }
        ]
    });

}
