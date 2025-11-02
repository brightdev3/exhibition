const express = require("express");
const router = express.Router();

const pg = require("pg");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

router.post("/signup", async (req, res) => {
    const { username, email, password, password_repeat} = req.body;
    if (username.length < 3) {
        return res.status(400).json({
            success: false,
            message: "username must be at least 3 characters long"}
        );
    } else if (!/^[a-z0-9_]+$/i.test(username)) {
        return res.status(400).json({
            success: false,
            message: "username must only contain alphanumeric characters and underscores"}
        );
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            success: false,
            message: "email must be valid"}
        );
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
    let exists_email;
    try {
        exists_email = await req.app.locals.pool.query(
            "SELECT 1 FROM users WHERE LOWER(username)=$1",
            [username.toLowerCase()]
        );
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
    if (exists_email.rowCount > 0) {
        return res.status(409).json({
            success: false,
            message: "email is already in use"
        });
    }
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 16; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }
    const password_hash = await bcrypt.hash(password, 10);
    const token_expires = new Date(Date.now() + 1000 * 60 * 60 * 48);
    let mailDetails = {
        from: "brightdev03@gmail.com",
        to: email,
        subject: "Exhibition account verification",
        html: `Hello,<br><br>an account with your email was registered at our website with the username ${username}. If this was you, please verify <a href="https://exhibition-economy.vercel.app/api/verify/${token}">here</a>.<br><br>The exhibition team.<br><a href="https://exhibition-economy.vercel.app"></a>`,
    };
    try {
        await req.app.locals.transporter.sendMail(mailDetails);
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "email could not be sent"
        });
    }
    try {
        await req.app.locals.pool.query(
            `INSERT INTO users_pending (token, token_expires, username, password_hash, email)
            VALUES ($1, $2, $3, $4, $5)`, [token, token_expires, username, password_hash, email]
        );
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        });
    }
    return res.status(201).json({
        success: true,
        message: "verification sent"
    });
});

module.exports = router;