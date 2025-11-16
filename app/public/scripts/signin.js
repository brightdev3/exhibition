document.getElementById("signinForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    let data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
    };
    await request("/api/auth/signin", data, () => {
        setTimeout(() => {
            window.location.href = "/"; 
        }, 500);
    });
});