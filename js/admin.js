const API = "https://chronoframesbackend.onrender.com/api/templates";

/* DOM */
const templateList = document.getElementById("templateList");
const titleInput = document.getElementById("title");
const promptInput = document.getElementById("prompt");
const beforeImg = document.getElementById("beforeImg");
const afterImg = document.getElementById("afterImg");
const categorySelect = document.getElementById("categorySelect");
const categoryList = document.getElementById("categoryList");
const newCategory = document.getElementById("newCategory");

/* INIT */
loadDashboard();
loadCategories();
loadTemplates();

/* DASHBOARD */
async function loadDashboard() {
  const res = await fetch(`${API}/stats/dashboard`);
  const data = await res.json();
  views.innerText = data.views;
  likes.innerText = data.likes;
  templates.innerText = data.templates;
}

/* CATEGORIES */
async function loadCategories() {
  const res = await fetch(`${API}/categories`);
  const cats = await res.json();

  categorySelect.innerHTML =
    `<option value="">Select category</option>` +
    cats.map(c => `<option value="${c.name}">${c.name}</option>`).join("");

  categoryList.innerHTML = cats.map(c => `
    <div class="category-row">
      <span>${c.name}</span>
      <button class="danger" onclick="deleteCategory('${c._id}')">Remove</button>
    </div>
  `).join("");
}

async function addCategory() {
  if (!newCategory.value) return;

  await fetch(`${API}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newCategory.value })
  });

  newCategory.value = "";
  loadCategories();
}

async function deleteCategory(id) {
  if (!confirm("Remove this category?")) return;
  await fetch(`${API}/categories/${id}`, { method: "DELETE" });
  loadCategories();
}

/* TEMPLATES */
async function uploadTemplate() {
  if (
    !titleInput.value ||
    !promptInput.value ||
    !categorySelect.value ||
    !beforeImg.files[0] ||
    !afterImg.files[0]
  ) {
    alert("All fields required");
    return;
  }

  const fd = new FormData();
  fd.append("title", titleInput.value);
  fd.append("prompt", promptInput.value);
  fd.append("category", categorySelect.value);
  fd.append("beforeImg", beforeImg.files[0]);
  fd.append("afterImg", afterImg.files[0]);

  await fetch(API, { method: "POST", body: fd });

  titleInput.value = "";
  promptInput.value = "";
  beforeImg.value = "";
  afterImg.value = "";

  loadTemplates();
  loadDashboard();
}

async function loadTemplates() {
  const res = await fetch(API);
  const data = await res.json();

  templateList.innerHTML = data.map(t => `
    <div class="template-card">
      <h4>${t.title} <small>(${t.category})</small></h4>
      <textarea id="p-${t._id}">${t.prompt}</textarea>
      <div class="template-actions">
        <button onclick="updatePrompt('${t._id}')">Update</button>
        <button class="danger" onclick="deleteTemplate('${t._id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

async function updatePrompt(id) {
  const newPrompt = document.getElementById(`p-${id}`).value;

  await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: newPrompt })
  });

  alert("Prompt updated");
}

async function deleteTemplate(id) {
  if (!confirm("Delete template?")) return;
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadTemplates();
  loadDashboard();
}
