async function signin() {
    let data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
    };
    try {
        document.getElementById("alertText").style.display = "block";
        document.getElementById("alertText").innerHTML = "Sending...";
        const response = await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.success) {
            document.getElementById("alertText").classList.remove("alert-info");
            document.getElementById("alertText").classList.add("alert-success");
            document.getElementById("alertText").innerHTML = "Success: " + responseData.message;
            setTimeout(() => {
                window.location.href = "/"; 
            }, 500);
        } else {
            document.getElementById("alertText").classList.remove("alert-info");
            document.getElementById("alertText").classList.add("alert-error");
            document.getElementById("alertText").innerHTML = "Error: " + responseData.message;
        }
    } catch (error) {
        document.getElementById("alertText").classList.remove("alert-info");
            document.getElementById("alertText").classList.add("alert-error");
        document.getElementById("alertText").innerHTML = "Error: " + "an unexpected error occurred";
    }
}

document.getElementById("signinForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await signin();
});