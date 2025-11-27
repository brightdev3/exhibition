const express = require("express");
const router = express.Router();

router.get("/:token", async (req, res, next) => {
    const token = req.params.token;
    const links = await req.app.locals.pool.query(
        `SELECT 1 FROM users_games WHERE games_token = $1 AND users_username = $2`,
        [token, req.user]
    );
    if (links.rows.length == 0) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    const users = await req.app.locals.pool.query(
        `SELECT users_username FROM users_games WHERE games_token = $1`,
        [token]
    );
    const games_host = await req.app.locals.pool.query(
        `SELECT host FROM games WHERE token = $1`,
        [token]
    );
    
    req.dynamic.data = {
        ...req.dynamic.data,
        host: games_host.rows[0].host == req.user,
        users: users.rows,
        token: token
    };
    req.dynamic.path = "game";
    return next();
});

module.exports = router;