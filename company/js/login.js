document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorDiv = document.getElementById("error");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorDiv.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    try {
      const res = await fetch("http://localhost:3000/api/companies/login", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        errorDiv.textContent = data.message || "Login Failed";
        return;
      }

      //saving token to localstorage
      localStorage.setItem("companyToken", data.token);
      alert("Company Login successfull");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Login Error:", error);
      errorDiv.textContent = "Server Error. Please try again later";
    }
  });
});
