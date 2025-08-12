// ===== Helper: Show Validation Errors =====
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const feedback = input.nextElementSibling;
  input.classList.add("is-invalid");
  if (feedback) feedback.textContent = message;
}

document
  .getElementById("submitBtn")
  .addEventListener("click", async function () {
    const form = document.getElementById("registrationForm");
    const submitBtn = document.getElementById("submitBtn");
    const spinner = document.getElementById("loadingSpinner");
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const email = form.email.value.trim();

    // Reset validation
    [...form.querySelectorAll(".invalid-feedback")].forEach(
      (el) => (el.textContent = "")
    );
    [...form.querySelectorAll(".form-control, .form-select")].forEach((el) =>
      el.classList.remove("is-invalid")
    );

    // Validate
    if (password !== confirmPassword) {
      showError("confirmPassword", "Passwords do not match.");
      return;
    }

    if (!email.endsWith(".com")) {
      showError("email", "Email must end with .com");
      return;
    }

    const requiredFields = [
      "name",
      "type",
      "location",
      "email",
      "password",
      "confirmPassword",
      "kraPin",
      "certificateOfIncorporation",
    ];

    for (let field of requiredFields) {
      const input = form[field];
      if (!input.value) {
        showError(field, "This field is required.");
        return;
      }
    }

    // Submit
    const formData = new FormData(form);
    spinner.classList.remove("d-none");
    submitBtn.disabled = true;

    try {
      const response = await fetch(
        "http://localhost:3000/api/companies/register",
        {
          method: "POST",
          body: formData,
        }
      );

      let resultText = await response.text();
      let result = {};
      try {
        result = JSON.parse(resultText);
      } catch {
        result = { message: resultText };
      }

      if (response.ok) {
        alert("✅ Registration submitted successfully. Await approval.");
        form.reset();
        bootstrap.Modal.getInstance(
          document.getElementById("registrationModal")
        ).hide();
      } else {
        alert(
          result.message || `❌ Registration failed. Status: ${response.status}`
        );
      }
    } catch (err) {
      alert(
        "🚫 Network error: Could not reach the server. Please check your backend."
      );
      console.error("Fetch error:", err);
    } finally {
      spinner.classList.add("d-none");
      submitBtn.disabled = false;
    }
  });

//Search for a seller

document.getElementById("searchBtn").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value.trim();
  const sellerList = document.getElementById("sellerList");

  sellerList.innerHTML = "";

  if (!query) {
    sellerList.innerHTML =
      "<p class='text-danger'>Please enter a search value.</p>";
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/agents/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    if (!data.length) {
      sellerList.innerHTML =
        "<p class='text-danger'>No seller found. Please check the name, phone, or agent code and try again.</p>";
      return;
    }

    // Display each seller
    data.forEach((seller) => {
      const sellerCard = document.createElement("div");
      sellerCard.className = "col-md-4 mb-3";
      sellerCard.innerHTML = `
        <div class="card shadow-sm border-0">

          <img src="http://localhost:3000/uploads/agents/${
            seller.photo
          }" class="card-img-top" alt="Seller Photo" style="height: 250px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${seller.name}</h5>
            <p class="card-text mb-1"><strong>Phone:</strong> ${
              seller.phone
            }</p>
            <p class="card-text mb-1"><strong>Agent Code:</strong> ${
              seller.agentCode
            }</p>
            <p class="card-text mb-1"><strong>Location:</strong> ${
              seller.location || "Not specified"
            }</p>
            <p class="card-text"><strong>Company:</strong> ${
              seller.company?.name || "N/A"
            }</p>
             <p class="card-text"><strong>Status:</strong> ${
               seller.status?.status || "N/A"
             }</p>
          </div>
        </div>
      `;
      sellerList.appendChild(sellerCard);
    });
  } catch (err) {
    console.error("Search error:", err);
    sellerList.innerHTML =
      "<p class='text-danger'>An error occurred. Please try again later.</p>";
  }
});
