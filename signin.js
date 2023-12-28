const signInForm = document.querySelector(".signin");
const errMessage = document.querySelector("#err-message");

const signIn = (e) => {
    e.preventDefault();
    const email = signInForm.email.value;
    const password = signInForm.password.value;
    if (!email || !password) return;

    setTimeout(() => {
        try {
            // retrieve the users data
            const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
            // check user existence
            const isExist = existingUsers.find(user => user.email === email);

            if (password !== isExist.password || email !== isExist.email) {
                errMessage.innerHTML = "Email or Password is not correct";
                throw new Error("Email or Password is not correct");
            } else if (isExist.isAdmin === true) {
                let user = JSON.stringify(isExist);
                localStorage.setItem('user', user);
                window.location.href = "https://amaged1896.github.io/CartCraft/dashboard";
            } else {
                // save user data 
                let user = JSON.stringify(isExist);
                localStorage.setItem('user', user);
                // Redirect after successful
                window.location.href = "https://amaged1896.github.io/CartCraft/index";
                signInForm.reset();
            }
        } catch (err) {
            console.log(err.message);
        }
    }, 0);
};

signInForm.addEventListener("submit", signIn);