const loginBtn = document.querySelector(".login-btn");
const email = document.querySelector('.input-email');
const password = document.querySelector('.input-password');
const userTypes = document.querySelectorAll("input[name=userType]");
let selectedValue;
function submitForm() {
    loginBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        for (let radio of userTypes) {
            if (radio.checked) {
                selectedValue = radio.value;
                break;
            }
        }
        console.log();
        const newObj = {
            Email: email.value,
            Password: password.value,
            UserType: selectedValue
        };
        const response = await fetch("http://localhost:3000/auth/API/login", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newObj)
        })
        if (response.ok) {
            window.location.href = "../Frontend/index.html";
        }
        console.log(response);
        console.log(selectedValue)
    })
}
submitForm()