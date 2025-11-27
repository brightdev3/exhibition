const express = require("express");
const router = express.Router();

router.post("/new", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "unauthorized",
        });
    }
    try {
        const { open, password } = req.body;
        let token = "";
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 6; i++) {
            token += characters[Math.floor(Math.random() * characters.length)];
        }
        await req.app.locals.pool.query(
            `INSERT INTO games (token, host, open, password, started)
            VALUES ($1, $2, $3, $4, $5)`, [token, req.user, open, password, false]
        );
        return res.status(201).json({
            success: true,
            message: "game created",
            token: token
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});

router.post("/join", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "unauthorized",
        });
    }
    try {
        const { token, password } = req.body;
        const games = await req.app.locals.pool.query(
            `SELECT password, open FROM games WHERE token = $1`,
            [token]
        );
        if (!games.rows[0].open && password != games.rows[0].password) {
            return res.status(401).json({
                success: false,
                message: "unauthorized",
            });
        }
        const users_games = await req.app.locals.pool.query(
            `SELECT 1 FROM users_games WHERE users_username = $1 AND games_token = $2`,
            [req.user, token]
        );
        if (users_games.rows.length == 0) {
            await req.app.locals.pool.query(
                `INSERT INTO users_games (users_username, games_token, data)
                VALUES ($1, $2, $3)`, [req.user, token, {}]
            );
        }
        return res.status(200).json({
            success: true,
            message: "joined game"
        });
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});

router.post("/leave", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "unauthorized",
        });
    }
    try {
        const { token } = req.body;
        const games = await req.app.locals.pool.query(
            `SELECT host FROM games WHERE token = $1`,
            [token]
        );
        if (games.rows.length == 0) {
            return res.status(404).json({
                success: false,
                message: "game not found",
            });
        }
        let isHost = false;
        if (games.rows[0].host == req.user) {
            isHost = true;
        }
        if (isHost) {
            await req.app.locals.pool.query(
                `DELETE FROM users_games WHERE games_token = $1`,
                [token]
            );
            await req.app.locals.pool.query(
                `DELETE FROM games WHERE token = $1`,
                [token]
            );
        } else {
            const users_games = await req.app.locals.pool.query(
                `DELETE FROM users_games WHERE users_username = $1 AND games_token = $2`,
                [req.user, token]
            );
        }
        return res.status(200).json({
            success: true,
            message: isHost ? "deleted game" : "left game"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});

router.get("/view", async (req, res) => {
    try {
        const games = await req.app.locals.pool.query(
            `SELECT token, host, open FROM games`
        );
        return res.status(200).json({
            success: true,
            data: games.rows
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
});

module.exports = router;