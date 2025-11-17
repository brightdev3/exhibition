async function newlesson() {
    let data = {
        "title": document.getElementById("lessonTitle").value,
        "index": document.getElementById("lessonIndex").value,
        "content": document.getElementById("lessonContent").value,
    };
    await request("/api/learn/new", data, (responseData) => {
        window.location.href = "/learn/lesson/" + responseData.code;
    });
};