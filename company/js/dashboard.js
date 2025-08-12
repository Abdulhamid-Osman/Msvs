document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/agents/agents", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch agents");
    console.log("No agents");
    const agents = await res.json();
    document.getElementById("totalAgents").innerText = agents.length;
  } catch (err) {
    console.error("Error loading total agents", err);
    document.getElementById("totalAgents").innerText = "0";
  }
});

//load company profile
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:3000/api/companies/dashboard", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to fetch company profile");
    const data = await res.json();

    document.getElementById("companyName").textContent = data.name;
    document.getElementById("businessType").textContent = data.type;
    document.getElementById("location").textContent = data.location;
    document.getElementById("email").textContent = data.email;
    document.getElementById("status").textContent = data.status;
  } catch (err) {
    console.error("Error loading company info", err);
  }
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
