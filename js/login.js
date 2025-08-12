document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        //save token to local storage
        localStorage.setItem("adminToken", data.token);
        alert("Login successfull");
        //redirect to dashboard
        window.location.href = "index.html";
      } else {
        alert(data.message || "Login Failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occured during login");
    }
  });
});
