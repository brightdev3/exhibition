async function signout() {
    await request("/api/auth/signout", {}, () => {
        setTimeout(() => {
            window.location.href = "/";
        }, 500);
    });
};