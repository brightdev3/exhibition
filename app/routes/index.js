const express = require("express");
const router = express.Router();

const fs = require("fs");
const path = require("path");

router.use("/api/auth", require("./api/auth"));
router.use("/api/inflatio", require("./api/inflatio"));

const cookieParser = require("cookie-parser");
router.use(cookieParser(process.env.COOKIE_SECRET));

router.get("/{*path}", (req, res, next) => {
    let user = false;
    if (req.signedCookies.verified) {
        user = req.signedCookies.username;
    }

    let reqPath = decodeURIComponent(req.path);
    if (reqPath.length > 1 && reqPath.endsWith("/")) {
        reqPath = reqPath.slice(0, -1);
    }
    let absPath = path.join(req.app.locals.baseDir, "views", reqPath);

    let htmlPath = absPath + ".html";
    if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
        return res.render(absPath, {"user": user});
    }

    if (fs.existsSync(absPath) && fs.statSync(absPath).isDirectory()) {
        let indexPath_abs = path.join(absPath, "index");
        let indexPath_html = path.join(absPath, "index.html");
        if (fs.existsSync(indexPath_html)) {
            return res.render(indexPath_abs, {"user": user});
        }
    }
    next();
});

module.exports = router;