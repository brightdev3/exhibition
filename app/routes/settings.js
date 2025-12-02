const express = require("express");
const router = express.Router();

router.use("/panel", async(req, res, next) => {
    if (req.method != "GET") {
        return next();
    }
    let promos = await req.app.locals.pool.query(
        `SELECT * FROM promos`
    );
    promos = promos.rows;
    req.dynamic.data = {
        ...req.dynamic.data,
        "promos": promos
    }
    return next();
});

module.exports = router;