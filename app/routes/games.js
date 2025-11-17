const express = require("express");
const router = express.Router();

const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

router.use(cookieParser(process.env.COOKIE_SECRET));

router.get("/", async (req, res, next) => {
    try {
        const games = await req.app.locals.pool.query(
            `SELECT token, host, open FROM games`
        );
        if (!req.dynamic) req.dynamic = {};
        req.dynamic.data = {
            ...req.dynamic.data,
            games: games.rows
        };
        req.dynamic.path = "games";
        return next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});

module.exports = router;