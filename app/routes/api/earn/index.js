const express = require("express");
const router = express.Router();

router.post("/submit", async (req, res) => {
    let { currency, answer } = req.body;
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "unauthorized",
        });
    }
    let curr_question = await req.app.locals.pool.query(
        `SELECT curr_question FROM users WHERE username = $1`,
        [req.user]
    );
    curr_question = curr_question.rows[0].curr_question;
    let question = await req.app.locals.pool.query(
        `SELECT answers FROM questions WHERE code = $1`,
        [curr_question]
    );
    question = question.rows[0];
    if (question.answers.includes(answer.toString().toLowerCase())) {
        let currencyData = await req.app.locals.pool.query(
            `SELECT earn_min, earn_max FROM currencies WHERE code = $1`,
            [currency]
        );
        currencyData = currencyData.rows[0];
        let earn = Math.floor(Math.random() * (currencyData.earn_max - currencyData.earn_min + 1)) + currencyData.earn_min;
        await req.app.locals.pool.query(
            `UPDATE users
            SET assets = jsonb_set(
                assets,
                ARRAY[$1::text],
                ((COALESCE(assets->>$1, '0'))::int + $2)::text::jsonb
            )
            WHERE username = $3;`,
            [currency, earn, req.user]
        );
        nextQuestion(req.app.locals.pool, req.user, req.body.type);
        return res.status(200).json({
            success: true,
            message: "correct answer",
            correct: true,
            answers: question.answers,
            earn: earn
        });
    } else {
        nextQuestion(req.app.locals.pool, req.user, req.body.type);
        return res.status(200).json({
            success: true,
            message: "incorrect answer",
            correct: false,
            answers: question.answers
        });
    }
});

async function nextQuestion(pool, user, type) {
    let questions = {};
    if (!type || type == "any") {
        questions = await pool.query(
            `SELECT code FROM questions`
        );
    } else {
        questions = await pool.query(
            `SELECT code FROM questions WHERE type = $1`,
            [type]
        );
    }
    random = questions.rows[Math.floor(Math.random() * questions.rows.length)].code;
    await pool.query(
        `UPDATE users SET curr_question = $1 WHERE username = $2`,
        [random, user]
    );
    return random;
}

router.get("/currency", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    let code = req.query.code;
    currencies = await req.app.locals.pool.query(
        `SELECT * FROM currencies WHERE code = $1`,
        [code]
    );
    if (currencies.rows.length == 0) {
        return res.status(404).json({
            success: false
        });
    }
    currencies = currencies.rows[0];
    return res.status(200).json({
        success: true,
        data: currencies
    });
});

router.post("/set", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    let { code, earn_min, earn_max } = req.body;
    await req.app.locals.pool.query(
        `UPDATE currencies SET earn_min = $2, earn_max = $3 WHERE code = $1`,
        [code, earn_min, earn_max]
    );
    return res.status(200).json({
        success: true,
        message: "currency updated",
        code: code
    });
});

router.post("/new", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    let { type, content, answers, choices } = req.body;
    let code = "";
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }
    await req.app.locals.pool.query(
        `INSERT INTO questions (code, type, content, answers, choices) VALUES ($1, $2, $3, $4, $5)`,
        [code, type, content, answers.split("\n"), choices.split("\n")]
    );
    return res.status(201).json({
        success: true,
        message: "question created",
        code: code
    });
});

router.post("/edit", async (req, res) => {
    if (!req.dynamic.data.admin) {
        return res.status(401).render("files/errors/401", {"user": req.user});
    }
    let { code, content, choices, answers } = req.body;
    await req.app.locals.pool.query(
        `UPDATE questions SET content = $2, choices = $3, answers = $4 WHERE code = $1`,
        [code, content, choices && choices != "" ? choices.split("\n") : null, answers.split("\n")]
    );
    return res.status(201).json({
        success: true,
        message: "question edited"
    });
});

module.exports = router;