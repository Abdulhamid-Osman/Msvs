// frontend/company/js/my-agents.js

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("companyToken");
  const agentsList = document.getElementById("agentsList");
  const searchInput = document.getElementById("searchInput");

  if (!token) {
    window.location.href = "/frontend/company/login.html";
    return;
  }

  // Fetch all agents from backend
  async function fetchAgents() {
    try {
      const res = await fetch("http://localhost:3000/api/agents/agents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const agents = await res.json();

      if (!Array.isArray(agents)) {
        agentsList.innerHTML = `<div class="alert alert-danger">Failed to fetch agents</div>`;
        return;
      }

      renderAgents(agents);
    } catch (err) {
      console.error("Failed to fetch agents:", err);
      agentsList.innerHTML = `<div class="alert alert-danger">Error loading agents</div>`;
    }
  }

  // Render agents with optional filtering
  function renderAgents(agentData) {
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = agentData.filter((agent) => {
      return (
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.phone.includes(searchTerm) ||
        agent.agentCode.toLowerCase().includes(searchTerm) ||
        agent.location.toLowerCase().includes(searchTerm)
      );
    });

    if (filtered.length === 0) {
      agentsList.innerHTML = "<p>No agents found.</p>";
      return;
    }

    agentsList.innerHTML = filtered
      .map(
        (agent) => `
        <div class="card mb-3 p-3">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h5>${agent.name}</h5>
              <p>
                <strong>Phone:</strong> ${agent.phone}<br>
                <strong>Agent Code:</strong> ${agent.agentCode}<br>
                <strong>Location:</strong> ${agent.location}
              </p>
              <button class="btn btn-sm btn-warning me-2" onclick="openEditModal('${
                agent._id
              }', '${agent.name}', '${agent.phone}', '${agent.agentCode}', '${
          agent.location
        }')">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteAgent('${
                agent._id
              }')">Delete</button>
            </div>
            ${
              agent.photo
                ? `<img src="http://localhost:3000/uploads/agents/${agent.photo}" width="80" class="img-thumbnail" alt="Photo" />`
                : ""
            }
          </div>
        </div>
      `
      )
      .join("");
  }

  // Search in real-time
  searchInput.addEventListener("input", fetchAgents);

  // Delete agent
  window.deleteAgent = async function (id) {
    if (!confirm("Are you sure you want to delete this agent?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/agents/agents/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchAgents();
      } else {
        alert("Failed to delete agent.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error.");
    }
  };

  // Open edit modal with pre-filled values
  window.openEditModal = function (id, name, phone, code, location) {
    document.getElementById("editAgentId").value = id;
    document.getElementById("editName").value = name;
    document.getElementById("editPhone").value = phone;
    document.getElementById("editCode").value = code;
    document.getElementById("editLocation").value = location;

    const editModal = new bootstrap.Modal(
      document.getElementById("editAgentModal")
    );
    editModal.show();
  };

  // Close modal
  window.closeEditModal = function () {
    document.getElementById("editAgentModal").style.display = "none";
  };

  // Handle update agent
  document
    .getElementById("editAgentForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("editAgentId").value;

      const formData = new FormData();
      formData.append("name", document.getElementById("editName").value);
      formData.append("phone", document.getElementById("editPhone").value);
      formData.append("agentCode", document.getElementById("editCode").value);
      formData.append(
        "location",
        document.getElementById("editLocation").value
      );

      const photo = document.getElementById("editPhoto").files[0];
      if (photo) {
        formData.append("photo", photo);
      }

      try {
        const res = await fetch(
          `http://localhost:3000/api/agents/agents/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await res.json();
        if (res.ok) {
          alert("Agent updated successfully");
          closeEditModal();
          fetchAgents();
        } else {
          alert(data.message || "Failed to update agent");
        }
      } catch (err) {
        console.error(err);
        alert("Error updating agent");
      }
    });

  // Initial fetch
  fetchAgents();
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
