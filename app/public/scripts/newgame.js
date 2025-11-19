async function newgame() {
    let data = {
        "open": document.getElementById("newGameOpen").checked,
        "password": document.getElementById("newGamePassword").value,
    };
    await request("/api/games/new", data, (responseData) => {
        document.getElementById("joinPassword").value = data.password;
        join(responseData.token);
    });
};

document.getElementById("newGameOpen").addEventListener("input", (event) => {
    document.getElementById("newGamePassword").disabled = event.target.checked;
})