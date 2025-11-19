let gameToken = "";

function closedGame(token) {
    gameToken = token;
}

async function join(token) {
    let data = {
        "token": token,
        "password": document.getElementById("joinPassword").value,
    };
    await request("/api/games/join", data, () => {
        setTimeout(() => {
            window.location.href = "/game/" + token; 
        }, 500);
    });
};

document.getElementById("newGameOpen").addEventListener("change", (event) => {
    const open = event.target.checked;
    document.getElementById("newGamePassword").disabled = open;
});