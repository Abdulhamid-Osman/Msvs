async function fetchDashboardStats() {
  try {
    const token = localStorage.getItem("adminToken");

    const [companiesRes, reportRes] = await Promise.all([
      fetch("http://localhost:3000/api/admin/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch("http://localhost:3000/api/report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (!companiesRes.ok || !reportRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const companies = await companiesRes.json();
    const report = await reportRes.json();

    const totalCompanies = companies.length;
    const pendingCompanies = companies.filter(
      (c) => c.status === "pending"
    ).length;
    const totalReports = report.reports.length;

    document.getElementById("total-companies").textContent = totalCompanies;
    document.getElementById("pending-companies").textContent = pendingCompanies;
    document.getElementById("total-reports").textContent = totalReports;
  } catch (err) {
    console.error("Error fetching Dashboard Data", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchDashboardStats();
});
