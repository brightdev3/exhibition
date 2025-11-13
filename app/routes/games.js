const express = require("express");
const router = express.Router();

const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

router.use(cookieParser(process.env.COOKIE_SECRET));

router.get("/:token", async (req, res, next) => {
    const token = req.params.token;
    const links = await req.app.locals.pool.query(
        `SELECT 1 FROM users_games WHERE games_token = $1 AND users_username = $2`,
        [token, req.user]
    );
    if (links.rows.length == 0) {
        return res.render("files/errors/401", {"user": req.user});
    }
    const users = await req.app.locals.pool.query(
        `SELECT users_username FROM users_games WHERE games_token = $1`,
        [token]
    );
    const games_host = await req.app.locals.pool.query(
        `SELECT host FROM games WHERE token = $1`,
        [token]
    );
    let host = false;
    if (games_host.rows[0].host == req.user) {
        host = true;
    }
    return res.render("files/games/game", {"user": req.user, "users": users.rows, "host": host});
});

module.exports = router;