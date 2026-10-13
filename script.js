const STORAGE_KEY = "ecotrackReportsV1";
const form = document.getElementById("reportForm");
const reportsList = document.getElementById("reportsList");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const formMessage = document.getElementById("formMessage");
let reports = loadReports();

function loadReports() {
  try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(data) ? data : []; }
  catch { return []; }
}
function saveReports() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reports)); return true; }
  catch { formMessage.textContent = "Browser storage is unavailable or full."; return false; }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function dateLabel(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown date" : date.toLocaleString([], {dateStyle:"medium",timeStyle:"short"});
}
function updateStats() {
  document.getElementById("totalCount").textContent = reports.length;
  document.getElementById("pendingCount").textContent = reports.filter(r=>r.status==="Pending").length;
  document.getElementById("progressCount").textContent = reports.filter(r=>r.status==="In Progress").length;
  document.getElementById("collectedCount").textContent = reports.filter(r=>r.status==="Collected").length;
  document.getElementById("reportTotalLabel").textContent = `${reports.length} ${reports.length===1?"report":"reports"}`;
}
function renderReports() {
  const query = searchInput.value.trim().toLowerCase();
  const filter = statusFilter.value;
  const visible = reports.filter(r=>r.location.toLowerCase().includes(query)&&(filter==="All"||r.status===filter));
  reportsList.innerHTML = visible.map(r=>`<article class="report">
    <div><div class="reporttitle">${escapeHTML(r.location)}</div>
    <div class="meta">${escapeHTML(r.wasteType)} · ${dateLabel(r.createdAt)}</div>
    ${r.details?`<p class="details">${escapeHTML(r.details)}</p>`:""}
    <span class="pill priority-${r.priority.toLowerCase()}">${escapeHTML(r.priority)} priority</span>
    <span class="pill status-${r.status.toLowerCase().replace(" ","-")}">${escapeHTML(r.status)}</span></div>
    <div class="actions"><select data-status-id="${r.id}" aria-label="Update status"><option ${r.status==="Pending"?"selected":""}>Pending</option><option ${r.status==="In Progress"?"selected":""}>In Progress</option><option ${r.status==="Collected"?"selected":""}>Collected</option></select><button class="delete" data-delete-id="${r.id}" type="button">Delete</button></div>
  </article>`).join("");
  emptyState.classList.toggle("hidden",visible.length>0);
  emptyState.querySelector("h3").textContent = visible.length ? "" : (reports.length?"No matching reports":"No reports yet");
  emptyState.querySelector("p").textContent = reports.length&&!visible.length?"Try a different search or status filter.":"Submit your first report using the form.";
  document.getElementById("shownLabel").textContent = `Showing ${visible.length} of ${reports.length} reports`;
  updateStats();
}
form.addEventListener("submit",event=>{
  event.preventDefault();
  const location=document.getElementById("location").value.trim();
  if(!location){formMessage.textContent="Please enter a location.";return;}
  const report={id:Date.now().toString(36)+Math.random().toString(36).slice(2),location,wasteType:document.getElementById("wasteType").value,priority:document.getElementById("priority").value,details:document.getElementById("details").value.trim(),status:"Pending",createdAt:new Date().toISOString()};
  reports.unshift(report);
  if(!saveReports()){reports.shift();return;}
  form.reset();formMessage.textContent="Report added successfully.";statusFilter.value="All";searchInput.value="";renderReports();
});
reportsList.addEventListener("change",event=>{
  const id=event.target.dataset.statusId;if(!id)return;
  const report=reports.find(r=>r.id===id);if(!report)return;
  const previous=report.status;report.status=event.target.value;
  if(!saveReports())report.status=previous;
  renderReports();
});
reportsList.addEventListener("click",event=>{
  const id=event.target.dataset.deleteId;if(!id)return;
  const report=reports.find(r=>r.id===id);
  if(!report||!confirm(`Delete the report for "${report.location}"?`))return;
  const old=reports;reports=reports.filter(r=>r.id!==id);
  if(!saveReports())reports=old;
  renderReports();
});
searchInput.addEventListener("input",renderReports);
statusFilter.addEventListener("change",renderReports);
document.getElementById("clearAllBtn").addEventListener("click",()=>{
  if(!reports.length||!confirm("Delete all reports saved in this browser?"))return;
  const old=reports;reports=[];
  if(!saveReports())reports=old;
  renderReports();formMessage.textContent="All reports cleared.";
});
renderReports();