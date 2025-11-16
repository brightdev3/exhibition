async function joingame(token) {
    let data = {
        "token": token,
        "password": document.getElementById("password").value,
    };
    await request("/api/games/join", data, () => {
        setTimeout(() => {
            window.location.href = "/game/" + token; 
        }, 500);
    });
};