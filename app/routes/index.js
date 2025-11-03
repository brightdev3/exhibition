const express = require('express');
const router = express.Router();

const fs = require("fs");
const path = require("path");

router.use('/api/auth', require('./api/auth'));
router.use('/api/inflatio', require('./api/inflatio'));

router.get("/{*path}", (req, res) => {
    let reqPath = decodeURIComponent(req.path);
    if (reqPath.length > 1 && reqPath.endsWith("/")) {
        reqPath = reqPath.slice(0, -1);
    }
    let absPath = path.join(req.app.locals.baseDir, "views", reqPath);

    let htmlPath = absPath + ".html";
    if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
        return res.render(absPath);
    }

    if (fs.existsSync(absPath) && fs.statSync(absPath).isDirectory()) {
        let indexPath_abs = path.join(absPath, "index");
        let indexPath_html = path.join(absPath, "index.html");
        if (fs.existsSync(indexPath_html)) {
            return res.render(indexPath_abs);
        } else {
            return res.status(404).render(path.join("errors", "404.html"));
        }
    }

    return res.status(404).render(path.join("errors", "404.html"));
});

module.exports = router;