const express = require("express");
const router = express.Router();

router.use("/", async(req, res, next) => {
    if (req.method != "GET") {
        return next();
    }
    if (req.path != "/") {
        return next();
    }
    try {
        let userQuery = await req.app.locals.pool.query(
            `SELECT packets FROM users WHERE username = $1`,
            [req.user]
        );

        userQuery = userQuery.rows[0];
        const packets = userQuery.packets;

        req.dynamic.data = {
            ...req.dynamic.data,
            packets: [
                ["lower_class", packets.lower_class],
                ["middle_class", packets.middle_class],
                ["upper_class", packets.upper_class],
                ["premium", packets.premium]
            ]
        }
        req.dynamic.path = "market";
        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).render("files/errors/500");
    }
});

module.exports = router;