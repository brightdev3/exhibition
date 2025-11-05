const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

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
        const password_hash = await bcrypt.hash(password, 10);
        await req.app.locals.pool.query(
            `INSERT INTO users (username, password_hash, display_name, email)
            VALUES ($1, $2, $3, $4)`, [username, password_hash, name, email]
        );
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

module.exports = router;