let fullName = document.querySelector('.input-fullname');
let email = document.querySelector('.input-email');
let password = document.querySelector('.input-password');
let confirm_password = document.querySelector('.input-confirm-password');
let errorsElem = document.querySelector(".errors");
const submitBtn = document.querySelector('.submit-btn');
const userTypes = document.querySelectorAll("input[name=userType]");
let selectedValue;

function signUp() {
    submitBtn.addEventListener('click', async (event) => {
        event.preventDefault();
        for (let radio of userTypes) {
            if (radio.checked) {
                selectedValue = radio.value;
                break;
            }
        }
        const data = {
            fullName: fullName.value,
            Email: email.value,
            Password: password.value,
            confirm_password: confirm_password.value,
            userType: selectedValue
        };
        const response = await fetch("http://localhost:3000/auth/API/signup", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const newData = await response.json();
        console.log(newData);
        if (response.ok) {
            window.location.href = "../Frontend/waiting.html";
        }
        else {
            const errors = newData.errors;
            if (errors) {
                let result = "";
                errors.forEach((error) => {
                    result += `<li>${error.msg}</li>`;
                });
                errorsElem.innerHTML = result;
            }
            if (newData.message) {
                errorsElem.innerHTML = `<li>${newData.message}</li>`;
            }

        }
        fullName.value = "";
        email.value = "";
        password.value = "";
        confirm_password = "";
    })

}
signUp()