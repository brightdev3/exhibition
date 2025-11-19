function leave() {
    let data = {
        "token": document.getElementById("gameToken").innerHTML,
    };
    request("/api/games/leave", data, (responseData) => {
        window.location.href = "/games";
    });
}