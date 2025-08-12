document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("companyToken");
  if (!token) return (window.location.href = "business-login.html");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const location = document.getElementById("location");
  const password = document.getElementById("password");
  const response = document.getElementById("response");

  // Fetch profile
  fetch("http://localhost:3000/api/companies/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      name.value = data.name;
      email.value = data.email;
      location.value = data.location;
    })
    .catch(() => {
      response.innerHTML = `<div class="alert alert-danger">Failed to load profile.</div>`;
    });

  // Update profile
  document
    .getElementById("profileForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        name: name.value,
        email: email.value,
        location: location.value,
      };
      if (password.value) payload.password = password.value;

      try {
        const res = await fetch("http://localhost:3000/api/companies/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (res.ok) {
          response.innerHTML = `<div class="alert alert-success">${result.message}</div>`;
        } else {
          response.innerHTML = `<div class="alert alert-danger">${result.message}</div>`;
        }
      } catch (err) {
        response.innerHTML = `<div class="alert alert-danger">Update failed</div>`;
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("companyToken");
      window.location.href = "login.html";
    });
  }
});
