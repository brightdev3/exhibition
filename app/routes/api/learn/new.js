const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");


router.use(cookieParser(process.env.COOKIE_SECRET));

router.post("/", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(403).json({
            success: false,
            message: "forbidden"
        });
    }
    try {
        const { title, content, index} = req.body;
        let code = "";
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 6; i++) {
            code += characters[Math.floor(Math.random() * characters.length)];
        }
        await req.app.locals.pool.query(
            `INSERT INTO lessons (title, content, code, index) VALUES ($1, $2, $3, $4)`,
            [title, content, code, index]
        );
        return res.status(201).json({
            success: true,
            message: "lesson created",
            code: code
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