document.addEventListener("DOMContentLoaded", () => {
  const reportsTableBody = document.querySelector("#reportsTable tbody");

  async function fetchReports() {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("http://localhost:3000/api/report", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched data:", data); // Debug log

      const reports = data.reports || data;

      reportsTableBody.innerHTML = "";

      if (!Array.isArray(reports) || reports.length === 0) {
        reportsTableBody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center">No reports found.</td>
          </tr>`;
        return;
      }

      reports.forEach((report) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${report.name || "N/A"}</td>
          <td>${report.phone || "N/A"}</td>
          <td>${report.description || "N/A"}</td>
          <td>${
            report.createdAt
              ? new Date(report.createdAt).toLocaleDateString()
              : "N/A"
          }</td>
          <td>
            <span class="badge ${
              report.status === "resolved" ? "bg-success" : "bg-warning"
            }">
              ${report.status || "Pending"}
            </span>
          </td>
          <td>
            <button class="btn btn-danger btn-sm delete-btn me-2" data-id="${
              report._id
            }">
              Delete
            </button>
            <button class="btn btn-success btn-sm resolve-btn" data-id="${
              report._id
            }" 
              ${report.status === "resolved" ? "disabled" : ""}>
              ${report.status === "resolved" ? "Resolved" : "Resolve"}
            </button>
          </td>
        `;

        reportsTableBody.appendChild(row);
      });

      addEventListeners();
    } catch (err) {
      console.error("Error fetching reports:", err);
      reportsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center text-danger">
            Error loading reports: ${err.message}
          </td>
        </tr>`;
    }
  }

  function addEventListeners() {
    // Delete buttons
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const reportId = btn.getAttribute("data-id");

        if (!confirm("Are you sure you want to delete this report?")) {
          return;
        }

        try {
          const response = await fetch(
            `http://localhost:3000/api/report/delete/${reportId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              },
            }
          );

          const result = await response.json();

          if (result.success) {
            alert("Report deleted successfully");
            fetchReports(); // Refresh the table
          } else {
            alert("Failed to delete report: " + result.message);
          }
        } catch (error) {
          console.error("Error deleting report:", error);
          alert("Error deleting report");
        }
      });
    });

    // Resolve buttons
    document.querySelectorAll(".resolve-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const reportId = btn.getAttribute("data-id");

        if (btn.disabled) return;

        try {
          const response = await fetch(
            `http://localhost:3000/api/report/resolve/${reportId}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                "Content-Type": "application/json",
              },
            }
          );

          const result = await response.json();

          if (result.success) {
            alert("Report resolved successfully");
            fetchReports(); // Refresh the table
          } else {
            alert("Failed to resolve report: " + result.message);
          }
        } catch (error) {
          console.error("Error resolving report:", error);
          alert("Error resolving report");
        }
      });
    });
  }

  // Initial load
  fetchReports();
});
