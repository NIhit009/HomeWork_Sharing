const currentList = document.querySelector(".homework-list");
const displayHeading = document.querySelector(".display-heading");
const authBtn = document.querySelector(".auth-buttons");
const navList = document.querySelector('.nav-list');

async function getCurrentHomework() {
    const response = await fetch("http://localhost:3000/homework/Api/currentHomework", {
        method: 'GET',
        credentials: 'include'
    })
    const currentData = await response.json();
    console.log(currentData);
    if (currentData.currentHomework) {
        let resulthtml = "";
        currentData.currentHomework.forEach((currData) => {
            const displayUrl = `http://localhost:3000/homework/Api/displayhomework/${currData._id}`;
            const apiUrl = `http://localhost:3000/homework/Api/downloadhomework/${currData._id}`
            resulthtml += `<li>
        <h3><a href="${displayUrl}" class="homework-link">${currData.Name} Assignment</a></h3>
        <p>Due: ${currData.SubmissionDate} | Submitted by: ${currData.SubmittedBy}</p>
        <a href='${apiUrl}' class="download-btn">Download</a>
      </li>`;
        });
        currentList.innerHTML = resulthtml;
    }
    else {
        displayHeading.textContent = currentData.message;
    }
    const loginResponse = await fetch("http://localhost:3000/homework/Api/checkLogin", {
        credentials: 'include'
    })
    const loginData = await loginResponse.json();
    if (!loginData.Access) {
        authBtn.innerHTML = `<a href="login.html" class="btn login">Login</a>
        <a href="signup.html" class="btn register">Register</a>`;
    }
    else {
        authBtn.innerHTML = `<button id="logout-btn" class="btn login">Logout</button>`
    }
    if (loginData.userType === 'Teacher') {
        const newList = document.createElement('li');
        newList.innerHTML = `<a href="add_homework.html">Add Homework</a>`
        navList.appendChild(newList);
    }
    if (loginData.Access) {
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
}
getCurrentHomework()