const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section");
const form = document.getElementById("caseForm");
const casesGrid = document.querySelector(".cases-grid");

let editIndex = null;

function renderCases() {
  const cases = JSON.parse(localStorage.getItem("cases")) || [];
  casesGrid.innerHTML = "";

  cases.forEach((caseItem, index) => {
    const card = document.createElement("div");
    card.className = "case-card";

    card.innerHTML = `
      <h3 class="case-title">📁 ${caseItem.title}</h3>
      <p><span class="label">Client:</span> ${caseItem.clientName}</p>
      <p><span class="label">Mobile:</span> ${caseItem.clientNumber}</p>
      <p><span class="label">Date:</span> ${caseItem.date}</p>
      <div class="case-actions">
        <button class="edit-btn" data-index="${index}"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
        <button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash-can"></i> Delete</button>
      </div>
    `;
    casesGrid.appendChild(card);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.closest("button").getAttribute("data-index");
      deleteCase(index);
    });
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.closest("button").getAttribute("data-index");
      loadCaseForEdit(index);
    });
  });
}

function deleteCase(index) {
  const cases = JSON.parse(localStorage.getItem("cases")) || [];
  cases.splice(index, 1);
  localStorage.setItem("cases", JSON.stringify(cases));
  renderCases();
}

function loadCaseForEdit(index) {
  const cases = JSON.parse(localStorage.getItem("cases")) || [];
  const caseItem = cases[index];

  document.getElementById("clientName").value = caseItem.clientName;
  document.getElementById("clientNumber").value = caseItem.clientNumber;
  document.getElementById("caseTitle").value = caseItem.title;
  document.getElementById("caseDate").value = caseItem.date;

  editIndex = index;

  document.querySelector('[href="#add-case"]').click();
  document.querySelector("#caseForm button").textContent = "Update Case";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const updatedCase = {
    clientName: document.getElementById("clientName").value,
    clientNumber: document.getElementById("clientNumber").value,
    title: document.getElementById("caseTitle").value,
    date: document.getElementById("caseDate").value,
  };

  const cases = JSON.parse(localStorage.getItem("cases")) || [];

  if (editIndex !== null) {
    // Update existing case
    cases[editIndex] = updatedCase;
    editIndex = null;
    document.querySelector("#caseForm button").textContent = "Submit";
  } else {
    // Add new case
    cases.push(updatedCase);
  }

  localStorage.setItem("cases", JSON.stringify(cases));
  form.reset();
  renderCases();
  document.querySelector('[href="#all-cases"]').click();
});

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    sections.forEach(section => section.classList.add("hidden"));
    const id = link.getAttribute("href").substring(1);
    document.getElementById(id).classList.remove("hidden");
  });
});

renderCases();
