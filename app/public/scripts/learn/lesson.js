let lessonTitle = document.getElementById("lessonTitle").innerText;
let lessonIndex = document.getElementById("lessonIndex").innerText;
let lessonCode = window.location.pathname.split("/").pop();

let editTitle = "";
let editContent = "";
let editIndex = 0;
let editMode = false;

function render() {
    let content = "";
    if (editMode) {
        content = editContent;
    } else {
        content = lessonContent;
    }
    content = content.split("\n");
    let output = "";
    let inHTML = false;
    for (let i = 0; i < content.length; i++) {
        if (content[i] == "<html>") {
            inHTML = true;
            continue;
        }
        if (content[i] == "</html>") {
            inHTML = false;
            continue;
        }
        output += content[i];
        if (!inHTML) {
            output += "<br>";
        }
    }
    document.getElementById("lessonContent").innerHTML = output;
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
    
    document.getElementById("lesson").innerHTML = `
        <label for="lessonTitle">Title:</label>
        <input type="text" id="lessonTitle" class="form-control" value="${title}">
        <br>
        <label for="lessonIndex">Index:</label>
        <input type="text" id="lessonIndex" class="form-control" value="${index}">
        <br>
        <label for="lessonContent">Content:</label>
        <textarea id="lessonContent" class="form-control" rows="10"></textarea>
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
    document.getElementById("lessonContent").value = content;
    editMode = true;
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
        <div id="lessonContent"><script>lessonContent = \`${editContent}\`</script></div>
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