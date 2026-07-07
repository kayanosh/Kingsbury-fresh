// Kingsbury Fresh Fruit & Veg — interactive storefront

const PRODUCTS = [
  { id: "apples", name: "Orchard Apples", emoji: "🍎", price: 1.80, unit: "per kg", cat: "fruit", tag: "Fruit" },
  { id: "bananas", name: "Fairtrade Bananas", emoji: "🍌", price: 1.10, unit: "per bunch", cat: "fruit", tag: "Fruit" },
  { id: "strawberries", name: "Local Strawberries", emoji: "🍓", price: 2.50, unit: "per punnet", cat: "fruit", tag: "Fruit" },
  { id: "oranges", name: "Juicy Oranges", emoji: "🍊", price: 2.00, unit: "per kg", cat: "fruit", tag: "Fruit" },
  { id: "grapes", name: "Seedless Grapes", emoji: "🍇", price: 2.75, unit: "per punnet", cat: "fruit", tag: "Fruit" },
  { id: "lemons", name: "Zesty Lemons", emoji: "🍋", price: 0.45, unit: "each", cat: "fruit", tag: "Fruit" },
  { id: "carrots", name: "Field Carrots", emoji: "🥕", price: 0.95, unit: "per kg", cat: "veg", tag: "Veg" },
  { id: "broccoli", name: "Green Broccoli", emoji: "🥦", price: 1.20, unit: "each", cat: "veg", tag: "Veg" },
  { id: "tomatoes", name: "Vine Tomatoes", emoji: "🍅", price: 1.90, unit: "per kg", cat: "veg", tag: "Veg" },
  { id: "potatoes", name: "Maris Piper Potatoes", emoji: "🥔", price: 1.30, unit: "per 2kg", cat: "veg", tag: "Veg" },
  { id: "peppers", name: "Mixed Peppers", emoji: "🫑", price: 1.60, unit: "pack of 3", cat: "veg", tag: "Veg" },
  { id: "aubergine", name: "Glossy Aubergine", emoji: "🍆", price: 0.85, unit: "each", cat: "veg", tag: "Veg" },
  { id: "corn", name: "Sweetcorn", emoji: "🌽", price: 0.70, unit: "each", cat: "veg", tag: "Veg" },
  { id: "leafy", name: "Salad Leaves", emoji: "🥬", price: 1.15, unit: "per bag", cat: "veg", tag: "Veg" },
  { id: "veg-box", name: "Weekly Veg Box", emoji: "🧺", price: 18.00, unit: "feeds 3–4", cat: "box", tag: "Box" },
  { id: "fruit-box", name: "Fruit Lover's Box", emoji: "🍉", price: 16.50, unit: "8 varieties", cat: "box", tag: "Box" },
];

const STORAGE_KEY = "kingsbury-cart";
let cart = loadCart();

/* ---------- Rendering products ---------- */
const grid = document.getElementById("productGrid");

function renderProducts(filter = "all") {
  const items = PRODUCTS.filter((p) => filter === "all" || p.cat === filter);
  grid.innerHTML = items
    .map(
      (p) => `
      <article class="product-card" data-cat="${p.cat}">
        <div class="product-media">
          <img src="images/${p.id}.webp" alt="${p.name}" loading="lazy" width="600" height="600" />
        </div>
        <div class="product-body">
          <span class="product-tag">${p.tag}</span>
          <span class="product-name">${p.name}</span>
          <span class="product-unit">${p.unit}</span>
          <div class="product-foot">
            <span class="product-price">£${p.price.toFixed(2)}</span>
            <button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name} to basket">+</button>
          </div>
        </div>
      </article>`
    )
    .join("");
}
renderProducts();

/* ---------- Filters ---------- */
document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  document.querySelectorAll(".filter").forEach((f) => f.classList.remove("is-active"));
  btn.classList.add("is-active");
  renderProducts(btn.dataset.filter);
});

/* ---------- Cart logic ---------- */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}
function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateCartUI();
  bumpCart();
}
function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  updateCartUI();
}

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartButton = document.getElementById("cartButton");

function updateCartUI() {
  const ids = Object.keys(cart);
  const totalItems = ids.reduce((n, id) => n + cart[id], 0);
  cartCount.textContent = totalItems;

  if (ids.length === 0) {
    cartItems.innerHTML = `<p class="cart-empty">Your basket is empty.<br>Add some fresh goodies! 🥕</p>`;
    cartTotal.textContent = "£0.00";
    return;
  }

  let total = 0;
  cartItems.innerHTML = ids
    .map((id) => {
      const p = PRODUCTS.find((x) => x.id === id);
      const qty = cart[id];
      total += p.price * qty;
      return `
        <div class="cart-row">
          <img class="thumb" src="images/${p.id}.webp" alt="${p.name}" width="48" height="48" />
          <div class="info">
            <strong>${p.name}</strong>
            <span>£${p.price.toFixed(2)} ${p.unit}</span>
          </div>
          <div class="qty">
            <button data-dec="${id}" aria-label="Decrease ${p.name}">−</button>
            <span>${qty}</span>
            <button data-inc="${id}" aria-label="Increase ${p.name}">+</button>
          </div>
        </div>`;
    })
    .join("");
  cartTotal.textContent = "£" + total.toFixed(2);
}

function bumpCart() {
  cartButton.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
    { duration: 300, easing: "ease-out" }
  );
}

/* Event delegation for add / qty buttons */
document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) return addToCart(add.dataset.add);
  const inc = e.target.closest("[data-inc]");
  if (inc) return changeQty(inc.dataset.inc, 1);
  const dec = e.target.closest("[data-dec]");
  if (dec) return changeQty(dec.dataset.dec, -1);
});

/* ---------- Cart drawer ---------- */
const drawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("cartOverlay");

function openCart() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
}
function closeCart() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
}
cartButton.addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeCart(); });

document.getElementById("checkoutBtn").addEventListener("click", () => {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  if (count === 0) {
    alert("Your basket is empty — add some fresh produce first! 🍏");
    return;
  }
  alert(`Thanks for your order! ${count} item(s) will be picked fresh and delivered today. 🚚\n\n(This is a demo checkout.)`);
  cart = {};
  saveCart();
  updateCartUI();
  closeCart();
});

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
navToggle.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});
navMenu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Contact form ---------- */
const form = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    formNote.textContent = "Please fill in all fields with a valid email.";
    formNote.style.color = "var(--berry)";
    return;
  }
  const name = document.getElementById("name").value.trim();
  formNote.style.color = "var(--green-700)";
  formNote.textContent = `Thanks ${name}! We'll be in touch shortly. 🌿`;
  form.reset();
});

/* ---------- Misc ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
updateCartUI();
