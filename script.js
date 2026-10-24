/*
  BEFORE LAUNCH:
  1. Replace samplePlots below with verified plot details.
  2. Replace placeholder/sample image URLs with original photos supplied by the client or properly licensed photos.
  3. Set WHATSAPP_NUMBER to the company's WhatsApp number with country code, digits only (India: 91...).
  4. Add real phone, email and office details in the Contact section.
  5. A real backend is needed if enquiries should be stored securely or sent to staff.
*/
const WHATSAPP_NUMBER = "8197317345";

const samplePlots = [
  { id: "Krishna Dham", location: "Vrindavan", area: null, unit: "sq yd", length: null, breadth: null, price: null, status: "Sample listing", image: "assets/vr1.png", description: "Sample card only. Add the actual plot address, measurements, price, photographs and verified details supplied by the company." },
  { id: "Radha Nagari", location: "Barsana", area: null, unit: "sq yd", length: null, breadth: null, price: null, status: "Sample listing", image: "assets/bs1.png", description: "Sample card only. Add the actual plot address, measurements, price, photographs and verified details supplied by the company." },
  { id: "Giriraj Nagari", location: "Govardhan", area: null, unit: "sq yd", length: null, breadth: null, price: null, status: "Sample listing", image: "assets/gv1.png", description: "Sample card only. Add the actual plot address, measurements, price, photographs and verified details supplied by the company." }
];

const plotsGrid = document.getElementById("plotsGrid");
const locationFilter = document.getElementById("locationFilter");
const priceFilter = document.getElementById("priceFilter");
const plotCount = document.getElementById("plotCount");
const modal = document.getElementById("plotModal");
const modalContent = document.getElementById("modalContent");
const modalTitle = document.getElementById("modalTitle");

function formatPrice(price) {
  if (typeof price !== "number" || !Number.isFinite(price)) return "Ask for price";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
}

function safeText(value, fallback = "To be confirmed") {
  return value === null || value === undefined || value === "" ? fallback : String(value);
}

function plotCard(plot) {
  const img = plot.image ? `<img src="${plot.image}" alt="Photo for ${plot.id}; replace with an actual plot photo" loading="lazy" onerror="this.style.display='none'">` : "";
  const dimensions = plot.length && plot.breadth ? `${plot.length} × ${plot.breadth} ft` : "Dimensions to be added";
  const area = typeof plot.area === "number" ? `${plot.area} ${plot.unit || "sq yd"}` : "Area to be added";
  return `<article class="plot-card">
    <div class="plot-image">${img}<span class="status-tag">${safeText(plot.status, "Status to be confirmed")}</span></div>
    <div class="plot-body">
      <div class="plot-topline"><div><h3>${safeText(plot.id, "Plot ID")}</h3><div class="plot-location">⌖ ${safeText(plot.location)}</div></div><div class="plot-price">${formatPrice(plot.price)}<small>Final price to be confirmed</small></div></div>
      <div class="plot-specs"><span class="spec">${area}</span><span class="spec">${dimensions}</span></div>
      <div class="plot-actions"><button class="btn btn-light view-plot" data-id="${safeText(plot.id)}">View Details</button><button class="btn btn-primary enquire-plot" data-id="${safeText(plot.id)}">Enquire</button></div>
    </div>
  </article>`;
}

function getFilteredPlots() {
  let items = [...samplePlots];
  const location = locationFilter.value;
  if (location) items = items.filter(plot => plot.location === location);
  if (priceFilter.value === "low") items.sort((a,b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (priceFilter.value === "high") items.sort((a,b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
  return items;
}

function renderPlots() {
  const items = getFilteredPlots();
  plotCount.textContent = `${items.length} sample ${items.length === 1 ? "listing" : "listings"} — not real offers`;
  plotsGrid.innerHTML = items.length ? items.map(plotCard).join("") : `<div class="empty-state"><strong>No sample plots in this location yet.</strong><br>Contact us to ask about availability.</div>`;
  plotsGrid.querySelectorAll(".view-plot").forEach(button => button.addEventListener("click", () => openPlot(button.dataset.id)));
  plotsGrid.querySelectorAll(".enquire-plot").forEach(button => button.addEventListener("click", () => {
    const plot = samplePlots.find(item => item.id === button.dataset.id);
    document.getElementById("plotId").value = plot ? plot.id : "";
    document.getElementById("preferredLocation").value = plot ? plot.location : "";
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    document.getElementById("name").focus({ preventScroll: true });
  }));
}

function openPlot(id) {
  const plot = samplePlots.find(item => item.id === id);
  if (!plot) return;
  modalTitle.textContent = `Plot ${safeText(plot.id)}`;
  const dimensions = plot.length && plot.breadth ? `${plot.length} × ${plot.breadth} ft` : "To be confirmed";
  const area = typeof plot.area === "number" ? `${plot.area} ${plot.unit || "sq yd"}` : "To be confirmed";
  const image = plot.image ? `<img src="${plot.image}" alt="Sample image for ${plot.id}" onerror="this.style.display='none'">` : "";
  modalContent.innerHTML = `${image}<p>${safeText(plot.description)}</p>
    <div class="modal-details">
      <div class="modal-detail"><small>Location</small><strong>${safeText(plot.location)}</strong></div>
      <div class="modal-detail"><small>Plot area</small><strong>${area}</strong></div>
      <div class="modal-detail"><small>Length × breadth</small><strong>${dimensions}</strong></div>
      <div class="modal-detail"><small>Total price</small><strong>${formatPrice(plot.price)}</strong></div>
      <div class="modal-detail"><small>Availability</small><strong>${safeText(plot.status)}</strong></div>
      <div class="modal-detail"><small>Address / site map</small><strong>To be provided</strong></div>
    </div>
    <button class="btn btn-primary" id="modalEnquire">Enquire about this plot →</button>
    <p class="form-hint">This is a demonstration listing. Confirm all details and documents with the company.</p>`;
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("modalEnquire").addEventListener("click", () => {
    document.getElementById("plotId").value = plot.id;
    document.getElementById("preferredLocation").value = plot.location;
    closeModal();
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => document.getElementById("name").focus({ preventScroll: true }), 450);
  });
  document.getElementById("modalClose").focus();
}

function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

locationFilter.addEventListener("change", renderPlots);
priceFilter.addEventListener("change", renderPlots);
document.querySelectorAll(".location-filter").forEach(link => link.addEventListener("click", () => {
  locationFilter.value = link.dataset.location;
  renderPlots();
}));
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); });

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  document.body.classList.toggle("menu-open", isOpen);
});
navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("menu-open");
}));

document.getElementById("enquiryForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const enquiry = [
    "Hello Braj Rasik Bhoomi, I would like to enquire about a plot.",
    `Name: ${data.get("name")}`,
    `Mobile: ${data.get("mobile")}`,
    `Preferred location: ${data.get("location")}`,
    `Plot number: ${data.get("plotId") || "Not specified"}`,
    `Question: ${data.get("message")}`
  ].join("\n");
  const status = document.getElementById("formStatus");
  if (!WHATSAPP_NUMBER) {
    status.textContent = "The enquiry is ready, but WhatsApp is not connected yet. The website owner must add the real company WhatsApp number in the JavaScript settings before launch. No information has been sent.";
    status.classList.add("show");
    return;
  }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiry)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  status.textContent = "Your WhatsApp enquiry has been prepared. Please review and send it in WhatsApp.";
  status.classList.add("show");
});

document.getElementById("year").textContent = new Date().getFullYear();
renderPlots();
