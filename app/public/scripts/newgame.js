async function newgame() {
    let data = {
        "open": document.getElementById("open").checked,
        "password": document.getElementById("password").value,
    };
    try {
        document.getElementById("errorText").style.color = "black";
        document.getElementById("errorText").style.display = "block";
        document.getElementById("errorText").innerHTML = "Sending...";
        const response = await fetch("/api/games/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.success) {
            console.log(responseData)
            document.getElementById("errorText").classList.remove("alert-warning");
            document.getElementById("errorText").classList.add("alert-success");
            document.getElementById("errorText").innerHTML = "Success: " + responseData.message;
            setTimeout(() => {
                window.location.href = "/games"; 
            }, 500);
        } else {
            document.getElementById("errorText").innerHTML = "Error: " + responseData.message;
        }
    } catch (error) {
        document.getElementById("errorText").style.display = "block";
        document.getElementById("errorText").innerHTML = "Error: " + "an unexpected error occurred";
    }
}

document.getElementById("newgameForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await newgame();
});