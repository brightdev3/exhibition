async function signup() {
    let data = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value,
        "password_repeat": document.getElementById("password_repeat").value,
        "name": document.getElementById("name").value,
        "email": document.getElementById("email").value
    };
    await request("/api/auth/signup", data, () => {
        setTimeout(() => {
            window.location.href = "/signin"; 
        }, 500);
    });
};

document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await signup();
});