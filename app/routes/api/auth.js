const express = require("express");
const router = express.Router();

const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

router.use(cookieParser(process.env.COOKIE_SECRET));

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password, password_repeat, name} = req.body;
        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: "username must be at least 3 characters long"
            });
        } else if (username.length > 20) {
            return res.status(400).json({
                success: false,
                message: "username must be less than 20 characters long"
            });
        } else if (!/^[a-z0-9_]+$/i.test(username)) {
            return res.status(400).json({
                success: false,
                message: "username must only contain alphanumeric characters and underscores"
            });
        } else if (password != password_repeat) {
            return res.status(400).json({
                success: false,
                message: "passwords must equal each other"}
            );
        } else if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "password must be at least 6 characters long"}
            );
        } else if (!/^[\x20-\x7E]+$/) {
            return res.status(400).json({
                success: false,
                message: "password must only contain standard characters"}
            );
        }
        const exists_username = await req.app.locals.pool.query(
            "SELECT 1 FROM users WHERE LOWER(username)=$1",
            [username.toLowerCase()]
        );
        if (exists_username.rowCount > 0) {
            return res.status(409).json({
                success: false,
                message: "username is already taken"
            });
        }
        await req.app.locals.pool.query(
            `INSERT INTO users (username, password, name, email, assets)
            VALUES ($1, $2, $3, $4, $5)`, [username, password, name, email, {"gold":0,"money":0,"SCC":1000}]
        );
        /*
        await req.app.locals.pool.query(
            `UPDATE users SET assets = jsonb_set(
                assets,
                '{SCC}',
                1000,
                true
            )
            WHERE username = $1;`, [username]
        );
        */
        return res.status(201).json({
            success: true,
            message: "account registered"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
});

router.post("/signin", async (req, res) => {
    const kv = req.app.locals.kv;
    const { username, password } = req.body;
    if (!username) {
        return res.status(401).json({
            success: false,
            message: "username is invalid"
        });
    }
    const accounts = await req.app.locals.pool.query(
        "SELECT username, password FROM users WHERE LOWER(username)=$1",
        [username.toLowerCase()]
    );
    if (accounts.rowCount == 0) {
        return res.status(401).json({
            success: false,
            message: "username is invalid"
        });
    }
    if (password == accounts.rows[0].password) {
        res.cookie("username", accounts.rows[0].username, {signed: true});
        res.cookie("verified", true, {signed: true});
        return res.status(200).json({
            success: true,
            message: "signed in"
        });
    } else {
        return res.status(401).json({
            success: false,
            message: "password is incorrect"
        });
    }
});

router.post("/signout", async (req, res) => {
    res.clearCookie("username", { signed: true });
    res.clearCookie("verified", { signed: true });
    return res.status(200).json({
        success: true,
        message: "signed out"
    });
});

module.exports = router;