const verifyForm = document.querySelector(".verify-form");
const inputVerify = document.querySelector('.input-verify');

verifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log(inputVerify.value);
    const code = {code: inputVerify.value};
    const response = await fetch("http://localhost:3000/auth/API/verify-email-status", {
        method: "POST",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(code)
    });
    if(response.ok){
        window.location.href = "../Frontend/index.html";
    }
    
})