document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addAgentForm");
  const messageDiv = document.getElementById("message");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Get form values
      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const agentCode = document.getElementById("agentCode").value.trim();
      const location = document.getElementById("location").value.trim();
      const photoFile = document.getElementById("photo").files[0];

      // Basic validation
      if (!name || !phone || !agentCode || !location || !photoFile) {
        messageDiv.innerHTML = `<div class="alert alert-danger">Please fill in all fields.</div>`;
        return;
      }

      const phonePattern = /^(\+254|0)\d{9}$/;
      if (!phonePattern.test(phone)) {
        messageDiv.innerHTML = `<div class="alert alert-danger">Please enter a valid phone number.</div>`;
        return;
      }

      const agentCodePattern = /^[A-Za-z0-9-]+$/;
      if (!agentCodePattern.test(agentCode)) {
        messageDiv.innerHTML = `<div class="alert alert-danger">Agent code can only contain letters, numbers, and hyphens (e.g., AGT-100).</div>`;
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(photoFile.type)) {
        messageDiv.innerHTML = `<div class="alert alert-danger">Please upload a JPG or PNG image.</div>`;
        return;
      }
      if (photoFile.size > 2 * 1024 * 1024) {
        messageDiv.innerHTML = `<div class="alert alert-danger">Image size must be less than 2MB.</div>`;
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("agentCode", agentCode);
      formData.append("location", location);
      formData.append("photo", photoFile);

      try {
        const token = localStorage.getItem("companyToken");
        const res = await fetch("http://localhost:3000/api/agents/add", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (res.ok) {
          alert("Agent added successfully ✅"); // Popup alert
          messageDiv.innerHTML = `<div class="alert alert-success">Agent added successfully</div>`;
          form.reset();
        } else {
          messageDiv.innerHTML = `<div class="alert alert-danger">Failed to add agent</div>`;
        }
      } catch (err) {
        console.error("Error:", err);
        messageDiv.innerHTML = `<div class="alert alert-danger">An unexpected error occurred.</div>`;
      }
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("companyToken");
      window.location.href = "login.html";
    });
  }
});
