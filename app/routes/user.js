const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path")

const cookieParser = require("cookie-parser");
router.use(cookieParser(process.env.COOKIE_SECRET));

router.get("/{:username}", async(req, res, next) => {
    try {
        const username = req.params.username;
        const isOwner = req.user == username;
        let userQuery = await req.app.locals.pool.query(
            `SELECT * FROM users WHERE username = $1`,
            [username]
        );
        if (userQuery.rows.length == 0) {
            return next();
        }
        userQuery = userQuery.rows[0];
        const assets = Object.entries(userQuery.assets);
        return res.render("files/user", {"user": req.user, "username": username, "isOwner": isOwner, "user_details": userQuery, "assets": assets});
    } catch (err) {
        return res.render("files/errors/500");
    }
});

module.exports = router;