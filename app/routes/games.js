const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const games = await req.app.locals.pool.query(
            `SELECT token, host, open FROM games`
        );

        req.dynamic.data = {
            ...req.dynamic.data,
            games: games.rows
        };
        req.dynamic.path = "games";
        return next();
    } catch (err) {
        return res.status(500).render("files/errors/500");
    }
});

module.exports = router;