document.addEventListener("DOMContentLoaded", () => {
  fetchApprovedCompanies();
});

async function fetchApprovedCompanies() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/admin/approved", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Fetched approved companies:", data);

    // Handle the updated response structure
    const companies = data.companies || data;
    const tbody = document.getElementById("approved-companies-body");
    tbody.innerHTML = "";

    if (!Array.isArray(companies) || companies.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">No approved companies found.</td>
        </tr>`;
      return;
    }

    companies.forEach((company, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${company.name || "N/A"}</td>
        <td>${company.type || "N/A"}</td>
        <td>${company.location || "N/A"}</td>
        <td>
          ${
            company.kraPin
              ? `<a href="${company.kraPin}" target="_blank" class="btn btn-sm btn-outline-primary">View</a>`
              : "N/A"
          }
        </td>
        <td>
          ${
            company.businessLicense
              ? `<a href="${company.businessLicense}" target="_blank" class="btn btn-sm btn-outline-primary">View</a>`
              : "N/A"
          }
        </td>
        <td>
          ${
            company.certificateOfIncorporation
              ? `<a href="${company.certificateOfIncorporation}" target="_blank" class="btn btn-sm btn-outline-primary">View</a>`
              : "N/A"
          }
        </td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to load approved companies", err);
    const tbody = document.getElementById("approved-companies-body");
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center text-danger">
          Error loading companies: ${err.message}
        </td>
      </tr>`;
  }
}
