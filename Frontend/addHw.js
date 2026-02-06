const Name = document.querySelector(".Input-name");
const Week = document.querySelector(".Input-week");
const SubmissionDate = document.querySelector(".Input-date");
const SubmittedBy = document.querySelector(".Input-author");
const file = document.querySelector(".Input-file");
const postForm = document.querySelector("#post-form");
const authBtn = document.querySelector(".auth-buttons")
const Errors = document.querySelector(".error-box");
const uploadBtn = document.querySelector(".upload");
const navList = document.querySelector(".nav-list");
loginValidate()

async function loginValidate() {
    const loginResponse = await fetch("http://localhost:3000/homework/Api/checkLogin", {
        credentials: 'include'
    })
    const data = await loginResponse.json();
    if (!data.Access) {
        authBtn.innerHTML = `<a href="login.html" class="btn login">Login</a>
        <a href="signup.html" class="btn register">Register</a>`;
    }
    else {
        authBtn.innerHTML = `<button id="logout-btn" class="btn login">Logout</button>`
    }
    console.log(data.userType);
    if (data.Access) {
        document.querySelector("#logout-btn").addEventListener('click', async () => {
            const response = await fetch("http://localhost:3000/auth/API/logout", {
                method: "POST",
                credentials: 'include'
            })
            console.log(response);
            if (response.ok) {
                window.location.href = "../Frontend/index.html";
            }
        });
    }
    console.log("Logged In");
    addHW()

}
async function addHW() {
    uploadBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("Name", Name.value);
        formData.append("Week", Week.value);
        formData.append("SubmissionDate", SubmissionDate.value);
        formData.append("SubmittedBy", SubmittedBy.value);
        if (file.files.length > 0) {
            formData.append("file", file.files[0]);
        }
        const response = await fetch("http://localhost:3000/homework/Api/addHomework", {
            method: 'POST',
            credentials: 'include',
            body: formData

        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            const errors = data.errors;
            if (errors) {
                let result = ``;
                errors.forEach((error) => {
                    result += `<li>${error.msg}</li>`;
                });
                Errors.innerHTML = result;
            }
        }

        console.log(data);
    })
}