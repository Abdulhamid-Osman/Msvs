document.addEventListener("DOMContentLoaded", () => {
  loadPendingCompanies();
});

async function loadPendingCompanies() {
  const token = localStorage.getItem("adminToken");
  try {
    const res = await fetch("http://localhost:3000/api/admin/pending", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const companies = await res.json();
    const tbody = document.getElementById("pending-companies-body");
    tbody.innerHTML = "";
    companies.forEach((company, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
    <td>${index + 1}</td>
    <td>${company.name}</td>
    <td>${company.type}</td>
    <td>${company.location}</td>
    <td>${company.kraPin}</td>
    <td>${company.businessLicense}</td>
    <td>${company.certificateOfIncorporation}</td>
      <td>
          <button class="btn btn-success btn-sm" onclick="handleApproval('${
            company._id
          }', 'approve')">Approve</button>
          <button class="btn btn-danger btn-sm" onclick="handleApproval('${
            company._id
          }', 'reject')">Reject</button>
        </td>
    `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Failed to Load Pending companies", err);
  }
}

async function handleApproval(companyId, action) {
  const token = localStorage.getItem("adminToken");
  const endPoint = `http://localhost:3000/api/admin/${action}/${companyId}`;
  try {
    const res = await fetch(endPoint, {
      method: "put",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.success) {
      alert(`${action.toUpperCase()} successful`);
      loadPendingCompanies();
    } else {
      alert("Action Failed");
    }
  } catch (err) {
    alert("Request Error", err.message);
  }
}
