async function newgame() {
    let data = {
        "open": document.getElementById("open").checked,
        "password": document.getElementById("password").value,
    };
    await request("/api/games/new", data, (responseData) => {
        joingame(responseData.token);
    });
};

document.getElementById("newgameForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await newgame();
});