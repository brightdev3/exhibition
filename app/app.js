const express = require("express");
const { engine } = require("express-handlebars");
const pg = require("pg");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { createClient } = require("@vercel/kv");
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.engine("html", engine({
    extname: "html",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials")
}));
app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/*

const kv = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
});

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "brightdev03@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
    },
});

*/

app.locals.pool = pool;

/*
app.locals.kv = kv;
app.locals.transporter = transporter;
*/

app.locals.baseDir = __dirname;

const routes = require("./routes");
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});