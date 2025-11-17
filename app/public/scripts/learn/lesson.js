let lessonTitle = document.getElementById("lessonTitle").innerHTML;
let lessonContent = document.getElementById("lessonContent").innerHTML;
let lessonIndex = document.getElementById("lessonIndex").innerHTML;
let lessonCode = window.location.pathname.split("/").pop();

let editTitle = "";
let editContent = "";
let editIndex = 0;
let editMode = false;

function render() {
    document.getElementById("lessonContent").innerHTML = document.getElementById("lessonContent").innerHTML.replaceAll("\n", "<br>");
}

function startEdit() {
    let title = lessonTitle;
    let content = lessonContent;
    let index = lessonIndex;
    if (editMode) {
        title = editTitle;
        content = editContent;
        index = editIndex;
    }
    editMode = true;
    document.getElementById("lesson").innerHTML = `
        <label for="lessonTitle">Title:</label>
        <input type="text" id="lessonTitle" class="form-control" value="${title}">
        <br>
        <label for="lessonIndex">Index:</label>
        <input type="text" id="lessonIndex" class="form-control" value="${index}">
        <br>
        <label for="lessonContent">Content:</label>
        <textarea id="lessonContent" class="form-control" rows="10">${content}</textarea>
        <br>
        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
            Delete lesson
        </button>
        <br>
        <br>
        <button class="btn btn-success" onclick="submitEdit();">Submit</button>
        <button class="btn btn-primary" onclick="previewEdit();">Preview</button>
        <button class="btn btn-secondary" onclick="endEdit();">Cancel</button>
    `;
}

function endEdit() {
    editMode = false;
    document.getElementById("lesson").innerHTML = `
        <h1 id="lessonTitle">${lessonTitle}</h1>
        <br>
        <div id="lessonContent">${lessonContent}</div>
        <br>
        <button class="btn btn-primary" onclick="startEdit();">Edit</button>
    `;
    render();
}

function previewEdit() {
    editTitle = document.getElementById("lessonTitle").value;
    editContent = document.getElementById("lessonContent").value;
    document.getElementById("lesson").innerHTML = `
        <div class="alert alert-warning" role="alert">This is a preview</div>
        <h1 id="lessonTitle">${editTitle}</h1>
        <br>
        <div id="lessonContent">${editContent}</div>
        <br>
        <button class="btn btn-success" onclick="submitEdit();">Submit</button>
        <button class="btn btn-primary" onclick="startEdit();">Edit</button>
        <button class="btn btn-secondary" onclick="endEdit();">Cancel</button>
    `;
    render();
}

async function submitEdit() {
    let data = {
        "code": lessonCode,
        "title": document.getElementById("lessonTitle").value || editTitle,
        "content": document.getElementById("lessonContent").value || editContent
    };
    await request("/api/learn/lesson/edit", data, () => {
        setTimeout(() => {
            window.location.href = "/learn/lesson/" + lessonCode;
        }, 500);
    });
}

function deleteLesson() {
    let data = {
        "code": lessonCode 
    };
    request("/api/learn/lesson/delete", data, () => {
        setTimeout(() => {
            window.location.href = "/learn";
        }, 500);
    });
}

render();