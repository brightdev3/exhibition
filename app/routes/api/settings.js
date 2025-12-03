const express = require("express");
const router = express.Router();

router.post("/promo/redeem", async (req, res) => {
    if (!req.user) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    try {
        let { code } = req.body;
        code = code.toLowerCase();
        let promo = await req.app.locals.pool.query(
            `SELECT * FROM promos WHERE code = $1`,
            [code]
        );
        if (promo.rows.length == 0) {
            return res.status(401).json({
                success: false,
                message: "code invalid"
            });
        }
        promo = promo.rows[0];
        await req.app.locals.pool.query(
            `DELETE FROM promos WHERE code = $1`,
            [code]
        );
        await req.app.locals.pool.query(
            `UPDATE users
            SET assets = jsonb_set(
                assets,
                ARRAY[$1::text],
                ((COALESCE(assets->>$1, '0'))::int + $2)::text::jsonb
            )
            WHERE username = $3;`,
            [promo.asset, promo.amount, req.user]
        );

        return res.status(201).json({
            success: true,
            message: "promo code applied"
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});

router.post("/panel/promo/new", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(403).json({
            success: false,
            message: "forbidden"
        });
    }
    try {
        const { currency, amount, quantity, notes } = req.body;
        for (let i = 0; i < quantity; i++) {
            let code = "";
            const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
            for (let i = 0; i < 6; i++) {
                code += characters[Math.floor(Math.random() * characters.length)];
            }
            await req.app.locals.pool.query(
                `INSERT INTO promos (code, asset, amount, notes) VALUES ($1, $2, $3, $4)`,
                [code, currency, amount, notes]
            );
        }
        return res.status(201).json({
            success: true,
            message: "promos created"
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});

router.post("/panel/promo/delete", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(403).json({
            success: false,
            message: "forbidden"
        });
    }
    try {
        const { codes } = req.body;
        await req.app.locals.pool.query(
            `DELETE FROM promos WHERE code = ANY($1::text[]);`,
            [codes]
        );
        return res.status(200).json({
            success: true,
            message: "promos deleted"
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});

module.exports = router;