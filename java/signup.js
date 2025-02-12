document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    // Validate password match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userExists = users.some((user) => user.email === email);
  
    if (userExists) {
      alert("User already exists with this email!");
      return;
    }
  
    // Save user data
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
  
    alert("Signup successful! Redirecting to login page...");
    window.location.href = "index.html";
  });