import { Router } from "express";
import QRCode from "qrcode";

import { generatePairingCode } from "../bot/session.js";
import { getSocket } from "../bot/connect.js";
import { getQR } from "../bot/qrManager.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| GET /api/status
|--------------------------------------------------------------------------
*/

router.get("/status", (req, res) => {

    const sock = getSocket();

    res.json({

        connected: !!sock,

        number: sock?.user?.id || null

    });

});

/*
|--------------------------------------------------------------------------
| GET /api/qr
|--------------------------------------------------------------------------
*/

router.get("/qr", async (req, res) => {

    try {

        const qr = getQR();

        if (!qr) {

            return res.json({

                success: false,

                message: "QR Code not available."

            });

        }

        const image = await QRCode.toDataURL(qr);

        res.json({

            success: true,

            qr: image

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
|--------------------------------------------------------------------------
| POST /api/pair
|--------------------------------------------------------------------------
*/

router.post("/pair", async (req, res) => {

    try {

        const { phone } = req.body;

        if (!phone) {

            return res.status(400).json({

                success: false,

                message: "Phone number is required."

            });

        }

        const code = await generatePairingCode(phone);

        res.json({

            success: true,

            code

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

export default router;
