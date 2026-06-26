/* 
 * The Writers Cafe - Core Script (Under 150 lines)
 * Clean, well-commented, beginner-friendly JavaScript.
 */

// 1. DATA: 8 Signature Literary-Themed Dishes
const MENU_ITEMS = [
  { id: 'st1', name: "The Great Gatsby Platter", category: "starters", desc: "Artisanal cheeses, fresh grapes, honeyed walnuts, and sourdough crackers.", price: 380, rating: 4.8, prep: "10 min", veg: true, img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80" },
  { id: 'st2', name: "Shakespeare’s Bruschetta", category: "starters", desc: "Toasted garlic sourdough topped with tomatoes, fresh basil, and balsamic glaze.", price: 260, rating: 4.6, prep: "8 min", veg: true, img: "https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=400&q=80" },
  { id: 'mn1', name: "Moby Dick Fish & Chips", category: "mains", desc: "Crispy beer-battered cod served with rustic sea-salt fries and tartar sauce.", price: 490, rating: 4.7, prep: "15 min", veg: false, img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80" },
  { id: 'mn2', name: "Pride & Prejudice Pasta", category: "mains", desc: "Creamy fettuccine tossed with wild forest mushrooms, truffle oil, and parmesan.", price: 460, rating: 4.8, prep: "14 min", veg: true, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80" },
  { id: 'ds1', name: "Alice in Wonderland Tarts", category: "desserts", desc: "Charming mini sweet tarts filled with silky lemon curd and fresh berries.", price: 280, rating: 4.8, prep: "6 min", veg: true, img: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=400&q=80" },
  { id: 'ds2', name: "Poe’s Dark Chocolate Mousse", category: "desserts", desc: "Decadent, rich dark chocolate mousse topped with fresh raspberry coulis.", price: 320, rating: 4.9, prep: "5 min", veg: true, img: "https://images.unsplash.com/photo-1541795795328-f073b763494e?auto=format&fit=crop&w=400&q=80" },
  { id: 'dr1', name: "The Alchemist Gold Latte", category: "drinks", desc: "Organic espresso, turmeric, oat milk, honey, and edible gold dust.", price: 190, rating: 4.9, prep: "5 min", veg: true, img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80" },
  { id: 'dr2', name: "Midsummer Matcha", category: "drinks", desc: "Chilled ceremonial green tea matcha layered with milk and lavender syrup.", price: 210, rating: 4.7, prep: "5 min", veg: true, img: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=400&q=80" }
];

// 2. STATE VARIABLES
let cart = JSON.parse(localStorage.getItem('twc_cart')) || [];
let activeDiscount = 0;
let deliveryFee = 0;

// 3. CORE CART ACTIONS
function saveCart() {
  localStorage.setItem('twc_cart', JSON.stringify(cart));
  updateUI();
}

function addToCart(id) {
  const dish = MENU_ITEMS.find(i => i.id === id);
  const exists = cart.find(i => i.id === id);
  if (exists) { exists.quantity++; } else { cart.push({ ...dish, quantity: 1 }); }
  saveCart();
  toggleDrawer(true);
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    saveCart();
  }
}

// 4. PRICE CALCULATIONS
function getTotals() {
  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const gst = Math.round(subtotal * 0.18);
  const grand = Math.max(0, subtotal + gst + deliveryFee - activeDiscount);
  return { subtotal, gst, grand };
}

// 5. RENDER FUNCTIONS
function updateUI() {
  // Update Cart Badge Counter
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.querySelectorAll('.cart-counter').forEach(el => el.textContent = count);

  // Render Slide-out Cart Drawer
  const dItems = document.getElementById('drawer-items');
  const dFooter = document.getElementById('drawer-footer');
  if (dItems && dFooter) {
    if (cart.length === 0) {
      dItems.innerHTML = `<p style="text-align:center; color:var(--text-muted);">Your cart is empty.</p>`;
      dFooter.style.display = 'none';
    } else {
      dItems.innerHTML = cart.map(i => `
        <div class="drawer-item">
          <div><div class="drawer-item-title">${i.name}</div><div style="color:var(--gold);">₹${i.price}</div></div>
          <div class="drawer-item-controls">
            <button class="qty-btn" onclick="updateQty('${i.id}', -1)">-</button>
            <span>${i.quantity}</span>
            <button class="qty-btn" onclick="updateQty('${i.id}', 1)">+</button>
          </div>
        </div>
      `).join('');
      dFooter.style.display = 'flex';
      const t = getTotals();
      document.getElementById('drawer-subtotal').textContent = `₹${t.subtotal}`;
      document.getElementById('drawer-grand').textContent = `₹${t.grand}`;
    }
  }

  // Render Detailed Cart Page Table (If on cart.html)
  const cTable = document.getElementById('cart-table-body');
  if (cTable) {
    if (cart.length === 0) {
      document.querySelector('.cart-page-grid').innerHTML = `<div style="text-align:center; padding: 40px 0; width: 100%; grid-column: 1/-1;"><h2>Your cart is empty</h2><br><a href="menu.html" class="btn btn-primary">Go to Menu</a></div>`;
    } else {
      cTable.innerHTML = cart.map(i => `
        <div class="cart-table-row">
          <div><strong>${i.name}</strong><br><small style="color:var(--gold);">₹${i.price}</small></div>
          <div class="drawer-item-controls">
            <button class="qty-btn" onclick="updateQty('${i.id}', -1)">-</button>
            <span>${i.quantity}</span>
            <button class="qty-btn" onclick="updateQty('${i.id}', 1)">+</button>
          </div>
          <div><strong>₹${i.price * i.quantity}</strong></div>
        </div>
      `).join('');
      const t = getTotals();
      document.getElementById('c-sub').textContent = `₹${t.subtotal}`;
      document.getElementById('c-gst').textContent = `₹${t.gst}`;
      document.getElementById('c-disc').textContent = `-₹${activeDiscount}`;
      document.getElementById('c-grand').textContent = `₹${t.grand}`;
    }
  }

  // Render Checkout Summary (If on checkout.html)
  const chItems = document.getElementById('ch-items');
  if (chItems) {
    chItems.innerHTML = cart.map(i => `<div style="display:flex; justify-content:space-between; font-size:14px; margin-bottom:8px;"><span>${i.name} x${i.quantity}</span><span>₹${i.price * i.quantity}</span></div>`).join('');
    const t = getTotals();
    document.getElementById('ch-sub').textContent = `₹${t.subtotal}`;
    document.getElementById('ch-gst').textContent = `₹${t.gst}`;
    document.getElementById('ch-del').textContent = deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`;
    document.getElementById('ch-disc').textContent = `-₹${activeDiscount}`;
    document.getElementById('ch-grand').textContent = `₹${t.grand}`;
  }
}

// 6. TOGGLE SIDEBAR DRAWER
function toggleDrawer(open) {
  const d = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  if (d && overlay) {
    d.classList.toggle('active', open);
    overlay.style.display = open ? 'block' : 'none';
  }
}

// 7. PAGE DYNAMIC LOGIC (MENU GRID GENERATOR)
function renderMenu(cat = 'all', query = '') {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  const filtered = MENU_ITEMS.filter(i => {
    return (cat === 'all' || i.category === cat) && i.name.toLowerCase().includes(query.toLowerCase());
  });

  grid.innerHTML = filtered.map(i => `
    <div class="food-card">
      <img src="${i.img}" class="food-img" alt="${i.name}">
      <div class="food-body">
        <div class="food-header">
          <div class="food-title">${i.name}</div>
          <div class="food-price">₹${i.price}</div>
        </div>
        <p class="food-desc">${i.desc}</p>
        <div class="food-footer">
          <span>${i.veg ? '🟢 VEG' : '🔴 NON-VEG'}</span>
          <span>⭐️ ${i.rating} | ⏱️ ${i.prep}</span>
          <button class="btn btn-outline" style="padding: 5px 12px; font-size:11px;" onclick="addToCart('${i.id}')">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

// 8. EVENT BINDINGS ON LOAD
document.addEventListener('DOMContentLoaded', () => {
  // Sidebar toggling
  document.getElementById('cart-icon-btn')?.addEventListener('click', (e) => { e.preventDefault(); toggleDrawer(true); });
  document.getElementById('drawer-close')?.addEventListener('click', () => toggleDrawer(false));
  document.getElementById('drawer-overlay')?.addEventListener('click', () => toggleDrawer(false));

  // Mobile menu toggle
  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-menu').classList.toggle('active');
  });

  // Contact / Newsletter form submit mock
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert("Thank you! Your message/table reservation request has been submitted.");
    e.target.reset();
  });

  // Catalog filtering and search
  if (document.getElementById('menu-grid')) {
    renderMenu();
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.category, document.getElementById('search-input').value);
      });
    });
    document.getElementById('search-input')?.addEventListener('input', (e) => {
      const activeCat = document.querySelector('.filter-btn.active')?.dataset.category || 'all';
      renderMenu(activeCat, e.target.value);
    });
  }

  // Cart page Coupon Codes
  document.getElementById('apply-coupon-btn')?.addEventListener('click', () => {
    const code = document.getElementById('coupon-code').value.trim().toUpperCase();
    if (code === 'WRITER20') {
      const t = getTotals();
      activeDiscount = Math.round(t.subtotal * 0.2);
      alert("Coupon 'WRITER20' applied! 20% discount added.");
    } else {
      alert("Invalid coupon. Try 'WRITER20'.");
      activeDiscount = 0;
    }
    saveCart();
  });

  // Checkout Delivery Choices
  document.querySelectorAll('.delivery-card').forEach(card => {
    card.addEventListener('click', (e) => {
      document.querySelectorAll('.delivery-card').forEach(c => c.classList.remove('active'));
      const target = e.currentTarget;
      target.classList.add('active');
      deliveryFee = target.dataset.speed === 'express' ? 80 : 0;
      saveCart();
    });
  });

  // Checkout Payment Tabs
  document.querySelectorAll('.pay-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.pay-pane').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      document.getElementById(`pane-${e.target.dataset.method}`).classList.add('active');
      document.getElementById('payment-method-val').value = e.target.dataset.method;
    });
  });

  // Place Order Simulation Form Submit
  document.getElementById('checkout-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Validate custom payment inputs
    const method = document.getElementById('payment-method-val').value;
    if (method === 'card' && !document.getElementById('card-num').value) {
      alert("Please fill card details."); return;
    }
    if (method === 'upi' && !document.getElementById('upi-id').value) {
      alert("Please fill UPI ID."); return;
    }
    
    // Trigger Success Modal
    const modal = document.getElementById('success-modal');
    if (modal) {
      document.getElementById('rec-num').textContent = `TWC-${Math.floor(100000 + Math.random() * 900000)}`;
      document.getElementById('rec-address').textContent = document.getElementById('cust-address').value;
      modal.style.display = 'flex';
      
      // Clear Cart
      cart = [];
      activeDiscount = 0;
      saveCart();
    }
  });

  // Close Success Modal
  document.getElementById('close-modal-btn')?.addEventListener('click', () => {
    document.getElementById('success-modal').style.display = 'none';
    window.location.href = 'index.html';
  });

  // Run initial state render
  updateUI();
});
