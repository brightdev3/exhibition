const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path")

const cookieParser = require("cookie-parser");
router.use(cookieParser(process.env.COOKIE_SECRET));

router.use(async(req, res, next) => {
    if (req.method != "GET") {
        return next();
    }
    let lessons = await req.app.locals.pool.query(
        `SELECT * FROM lessons ORDER BY index ASC`
    );
    lessons = lessons.rows;
    if (!req.dynamic) req.dynamic = {};
    req.dynamic.data = {
        ...req.dynamic.data,
        "learnLayout": true,
        "lessons": lessons
    }
    if (req.path == "/") {
        req.dynamic.path = "learn/index";
    }
    return next();
});

router.use("/lesson/{:code}", async(req, res, next) => {
    if (req.method != "GET") {
        return next();
    }
    let lesson = await req.app.locals.pool.query(
        `SELECT * FROM lessons WHERE code = $1`,
        [req.params.code]
    );
    if (lesson.rows.length == 0) {
        return res.status(404).render("files/errors/404", {"user": req.user});
    }
    lesson = lesson.rows[0];
    if (!req.dynamic) req.dynamic = {};
    req.dynamic.data = {
        ...req.dynamic.data,
        "learnLayout": true,
        "lesson": lesson
    }
    req.dynamic.path = "learn/lesson";
    return next();
});

module.exports = router;