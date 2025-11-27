const express = require("express");
const router = express.Router();

router.use("/{:username}", async(req, res, next) => {
    if (req.method != "GET") {
        return next();
    }
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
        
        req.dynamic.data = {
            ...req.dynamic.data,
            "username": username,
            "isOwner": isOwner,
            "user_details": userQuery,
            "assets": assets
        }
        req.dynamic.path = "user";
        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).render("files/errors/500");
    }
});

module.exports = router;