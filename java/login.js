document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    // Retrieve users from local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];
  
    // Find the user with matching email and password
    const user = users.find(
      (user) => user.email === email && user.password === password
    );
  
    if (user) {
      alert("Login successful! Redirecting to dashboard...");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid email or password!");
    }
  });