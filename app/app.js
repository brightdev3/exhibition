const express = require("express");
const { engine } = require("express-handlebars");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const BASE_DIR = path.join(__dirname, "files");
const NOT_FOUND = path.join(BASE_DIR, "404.html");

app.use(express.static(path.join(__dirname, "public")));

app.engine("html", engine({
    extname: "html",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials")
}));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

app.get("/{*path}", (req, res) => {
    let reqPath = decodeURIComponent(req.path);
    if (reqPath.length > 1 && reqPath.endsWith("/")) {
        reqPath = reqPath.slice(0, -1);
    }
    let absPath = path.join(__dirname, "views", reqPath);

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
            return res.status(404).sendFile(NOT_FOUND);
        }
    }

    return res.status(404).render(NOT_FOUND);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});