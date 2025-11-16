const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

const cookieParser = require("cookie-parser");
router.use(cookieParser(process.env.COOKIE_SECRET));

router.use((req, res, next) => {
    req.user = false;
    if (req.signedCookies.verified) {
        req.user = req.signedCookies.username;
    }
    return next();
});

router.use("/api/auth", require("./api/auth"));
router.use("/api/games", require("./api/games"));
router.use("/game", require("./game"));
router.use("/games", require("./games"));
router.use("/user", require("./user"));

router.get(/^\/(?:files|layouts)/, (req, res) => {
    return res.status(403).render("files/errors/403", {user: req.user});
});

router.get("/{*path}", (req, res, next) => {
    if (req.dynamic) {
        if (req.dynamic.err) {
            return res.render("files/errors/" + req.dynamic.err, {user: req.user, ...req.dynamic.data});
        }
        return res.render(req.dynamic.path, {user: req.user, ...req.dynamic.data});
    }

    let reqPath = decodeURIComponent(req.path);
    if (reqPath.length > 1 && reqPath.endsWith("/")) {
        reqPath = reqPath.slice(0, -1);
    }
    let absPath = path.join(req.app.locals.baseDir, "views", reqPath);

    let htmlPath = absPath + ".html";
    if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
        return res.render(absPath, {user: req.user});
    }

    if (fs.existsSync(absPath) && fs.statSync(absPath).isDirectory()) {
        let indexPath_abs = path.join(absPath, "index");
        let indexPath_html = path.join(absPath, "index.html");
        if (fs.existsSync(indexPath_html)) {
            return res.render(indexPath_abs, {user: req.user});
        }
    }
    next();
});

router.use((req, res, next) => {
    return res.status(404).render("files/errors/404", {"user": req.user});
});

module.exports = router;