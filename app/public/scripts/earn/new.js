async function newQuestion() {
    let data = {
        "type": document.getElementById("questionType").value,
        "content": document.getElementById("questionContent").value,
        "answers": document.getElementById("questionAnswers").value,
        "choices": document.getElementById("questionChoices").value
    };
    await request("/api/earn/new", data, (responseData) => {
        window.location.href = "/earn/panel/question/" + responseData.code;
    });
};