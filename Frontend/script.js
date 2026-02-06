const listElement = document.querySelector(".homework-list");
const authBtn = document.querySelector(".auth-buttons");
const navList = document.querySelector('.nav-list');

async function getAPI() {
    const response = await fetch("http://localhost:3000/homework/Api", {
        credentials: 'include'
    });
    const data = await response.json();
    console.log(data);
    if (data.homework) {
        const listsElem = data.homework.map((info) => {
            const apiUrl = `http://localhost:3000/homework/Api/downloadhomework/${info._id}`
            const displayUrl = `http://localhost:3000/homework/Api/displayhomework/${info._id}`
            return `<li>
        <h3><a href="${displayUrl}" class="homework-link">${info.Name} Assignment</a></h3>
        <p>Due: ${info.SubmissionDate} | Submitted by: ${info.SubmittedBy}</p>
        <a href='${apiUrl}' class="download-btn">Download</a>
      </li>`;
        })
        let resulthtml = "";
        listsElem.forEach(result => {
            resulthtml += result
        });
        listElement.innerHTML = resulthtml;
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
    console.log(loginData)
    if (loginData.userType === 'Teacher') {
        const newList = document.createElement('li');
        newList.innerHTML = `<a href="add_homework.html" >Add Homework</a>`
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
getAPI();