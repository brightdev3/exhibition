document.getElementById("questionForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    let data = {};
    const questionType = document.getElementById("questionType").innerHTML;
    if (questionType == "text" || questionType == "number") {
        data.answer = document.getElementById("answerInput").value;
    } else if (questionType == "multiple_choice") {
        const selected = document.querySelector('input[name="answerOptions"]:checked');
        if (selected) data.answer = selected.value;
    }
    data.currency = document.getElementById("currencySelect").value;
    window.sessionStorage.setItem("currency", data.currency);
    await request("/api/earn/submit", data, (responseData) => {
        if (responseData.correct) {
            alertText("Correct answer!", "success");
            document.getElementById("earnText").style.display = "block";
            document.getElementById("earnText").innerHTML = `You earned ${responseData.earn} ${data.currency.toUpperCase()}! 🎉`;
        } else {
            alertText("Incorrect answer.", "danger");
        }
        document.getElementById("questionFieldset").disabled = true;
        document.getElementById("submitButton").style.display = "none";
        document.getElementById("nextQuestionButton").style.display = "block";
    }, false);
});

if (window.sessionStorage.getItem("currency")) {
    document.getElementById("currencySelect").value = window.sessionStorage.getItem("currency");
}