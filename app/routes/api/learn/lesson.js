const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");


router.use(cookieParser(process.env.COOKIE_SECRET));

router.post("/edit", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(403).json({
            success: false,
            message: "forbidden"
        });
    }
    try {
        const { code, title, content } = req.body;
        await req.app.locals.pool.query(
            `UPDATE lessons SET title = $1, content = $2 WHERE code = $3`,
            [title, content, code]
        );
        return res.status(201).json({
            success: true,
            message: "lesson edited"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});

router.post("/delete", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(403).json({
            success: false,
            message: "forbidden"
        });
    }
    try {
        const { code } = req.body;
        await req.app.locals.pool.query(
            `DELETE FROM lessons WHERE code = $1`,
            [code]
        );
        return res.status(201).json({
            success: true,
            message: "lesson deleted"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});

module.exports = router;