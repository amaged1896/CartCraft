const signupForm = document.querySelector("#signup-form");
const errMessge = document.querySelector("#err-message");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const passwordRepeat = signupForm["signup-password-reapeat"].value;
  const phoneNumber = signupForm.phoneNumber.value;
  const firstName = signupForm.firstName.value;
  const lastName = signupForm.lastName.value;

  const nameRegex = /[a-zA-Z]/gi;
  const mobileRegex = /^(011|012|015|010)\d{8}$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    errMessge.innerHTML = "No numbers allowed in the name field";
    throw new Error("No numbers allowed in the name field");
  }

  if (!mobileRegex.test(phoneNumber)) {
    errMessge.innerHTML =
      "Egyptian Phone Numbers only Allowed Ex.(011|012|015|010)";
    throw new Error("Egyptian Phone Numbers only Allowed Ex.(011|012|015|010)");
  }

  if (password !== passwordRepeat) {
    errMessge.innerHTML = "Passwords did not match";
    throw new Error("The passwords did not match");
  }

  setTimeout(() => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

      // check user existence
      const isExist = existingUsers.find((user) => user.email === email);
      if (isExist) {
        errMessge.innerHTML = "This email already exists";
        throw new Error("Email already exists");
      }

      // If not, create a new user object and store it in localStorage
      const newUser = {
        firstName: firstName,
        lastName: lastName,
        password: password,
        phoneNumber: phoneNumber,
        email: email,
        isAdmin: false,
        shoppingCart: [],
        wishList: [],
        pendingOrders: [],
        previousOrders: [],
      };
      
      existingUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(existingUsers));
      // Redirect after successful signup
      window.location.href = "https://amaged1896.github.io/CartCraft/signin";
      signupForm.reset();
    } catch (err) {
      // Handle errors
      if (err.message !== "Email already exists") {
        // Handle other errors, e.g., validation errors
        console.log(err.message);
      }
    }
  }, 0);
});
