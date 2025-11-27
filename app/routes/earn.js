const express = require("express");
const router = express.Router();

router.get("/play", async (req, res, next) => {
    if (!req.user) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    let curr_question = await req.app.locals.pool.query(
        `SELECT curr_question FROM users WHERE username = $1`,
        [req.user]
    );
    curr_question = curr_question.rows[0].curr_question;
    let question = await req.app.locals.pool.query(
        `SELECT * FROM questions WHERE code = $1`,
        [curr_question]
    );
    question = question.rows[0];
    req.dynamic.data = {
        ...req.dynamic.data,
        question: question,
        isText: question.type == "text",
        isNumber: question.type == "number",
        isMultipleChoice: question.type == "multiple_choice",
    };
    return next();
});

router.all("/panel", async (req, res, next) => {
    if (!req.dynamic.data.admin) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    let questions = await req.app.locals.pool.query(
        `SELECT * FROM questions`
    );
    questions = questions.rows;
    let currencies = await req.app.locals.pool.query(
        `SELECT * FROM currencies`
    );
    currencies = currencies.rows;
    req.dynamic.data = {
        ...req.dynamic.data,
        questions: questions,
        currencies: currencies
    };
    return next();
});

router.all("/panel/question/{:code}", async (req, res, next) => {
    if (!req.dynamic.data.admin) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    const code = req.params.code;
    let question = await req.app.locals.pool.query(
        `SELECT * FROM questions WHERE code = $1`,
        [code]
    );
    if (question.rows.length == 0) {
        return res.status(404).render("files/errors/404", {"user": req.user});
    }
    question = question.rows[0];
    req.dynamic.data = {
        ...req.dynamic.data,
        question: question,
        isMultipleChoice: question.type == "multiple_choice"
    };
    req.dynamic.path = "earn/panel/question";
    return next();
});

router.use("/panel/question/{:code}/edit", async (req, res, next) => {
    if (!req.dynamic.data.admin) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    const code = req.params.code;
    let question = await req.app.locals.pool.query(
        `SELECT * FROM questions WHERE code = $1`,
        [code]
    );
    if (question.rows.length == 0) {
        return res.status(404).render("files/errors/404", {"user": req.user});
    }
    question = question.rows[0];
    req.dynamic.data = {
        ...req.dynamic.data,
        question: question,
        isMultipleChoice: question.type == "multiple_choice"
    };
    req.dynamic.path = "earn/panel/edit";
    return next();
});

module.exports = router;