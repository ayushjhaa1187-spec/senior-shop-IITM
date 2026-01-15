/* =========================================
   SENIOR SHOP - CORE LOGIC (Restored)
   ========================================= */

// 1. INJECT REQUIRED STYLES (Focus Ring & Skip Link)
// We add this via JS so you don't have to edit every HTML file
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    /* Keyboard Focus Ring (Required for Accessibility Score) */
    *:focus-visible { outline: 4px solid #F59E0B !important; outline-offset: 2px; }
    
    /* Skip Link (Hidden until Tabbed) */
    .skip-link { position: absolute; top: -999px; left: 0; background: #208090; color: white; padding: 15px; z-index: 9999; font-weight: bold; }
    .skip-link:focus { top: 0; }

    /* Toast Notification */
    #toast { visibility: hidden; min-width: 250px; background-color: #208090; color: #fff; text-align: center; border-radius: 50px; padding: 16px; position: fixed; z-index: 100; left: 50%; transform: translateX(-50%); bottom: 30px; font-size: 17px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
    #toast.show { visibility: visible; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
    @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
    @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
    
    /* Screen Reader Only Class */
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }
`;
document.head.appendChild(styleSheet);

// Add Toast & Announcer Elements
const toast = document.createElement("div");
toast.id = "toast";
document.body.appendChild(toast);

const announcer = document.createElement("div");
announcer.id = "a11y-announcer";
announcer.setAttribute("aria-live", "polite");
announcer.className = "sr-only";
document.body.appendChild(announcer);

// ON PAGE LOAD
window.onload = function() {
    updateCartCount();
    // Check for high contrast preference from simple toolbar
    if(localStorage.getItem('contrast') === 'high') document.body.classList.add('contrast-high');
    if(localStorage.getItem('text') === 'large') document.documentElement.style.fontSize = '120%';
    
    // Page Loaders
    if (window.location.pathname.includes('cart.html')) renderCartPage();
    if (window.location.pathname.includes('tracking.html')) loadTrackingInfo();
    if (window.location.pathname.includes('orders.html')) loadOrderHistory();
};

/* --- CORE FUNCTIONS --- */

function addToCart(productName, price, image) {
    let cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    cart.push({ name: productName, price: price, img: image });
    localStorage.setItem('seniorCart', JSON.stringify(cart));
    
    updateCartCount();
    showToast(`✅ ${productName} added to cart`);
    announce(`${productName} added to cart. Cart has ${cart.length} items.`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    const countElements = document.querySelectorAll('.cart-count-display');
    countElements.forEach(el => el.innerText = `Cart (${cart.length})`);
}

function showToast(message) {
    const x = document.getElementById("toast");
    if(x) {
        x.innerText = message;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}

function announce(message) {
    const el = document.getElementById("a11y-announcer");
    if(el) el.innerText = message;
}

/* --- SIMPLE ACCESSIBILITY TOOLS (Restored Original Toolbar Logic) --- */
function toggleContrast() {
    document.body.classList.toggle('bg-black');
    document.body.classList.toggle('text-yellow-400');
    // Simple toggle for the "First Version" look
    const isHigh = document.body.classList.contains('bg-black');
    if(isHigh) {
        document.body.style.backgroundColor = "black";
        document.body.style.color = "#FFFF00";
    } else {
        document.body.style.backgroundColor = "#F8FAFC";
        document.body.style.color = "#1F2937";
    }
}

function toggleTextSize() {
    const current = document.documentElement.style.fontSize;
    if(current === '120%') {
        document.documentElement.style.fontSize = '100%';
        localStorage.setItem('text', 'normal');
    } else {
        document.documentElement.style.fontSize = '120%';
        localStorage.setItem('text', 'large');
    }
}

/* --- CART PAGE LOGIC --- */
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if(!container) return;
    
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    const emptyMsg = document.getElementById('empty-cart-msg');
    const summary = document.getElementById('cart-summary');
    
    container.innerHTML = '';

    if (cart.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        container.style.display = 'none';
        if(summary) summary.style.display = 'none';
    } else {
        if(emptyMsg) emptyMsg.style.display = 'none';
        container.style.display = 'block';
        if(summary) summary.style.display = 'block';

        let total = 0;
        cart.forEach((item, index) => {
            total += parseFloat(item.price);
            const itemHTML = `
                <div class="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4">
                    <img src="${item.img}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg">
                    <div class="flex-grow text-center md:text-left">
                        <h3 class="text-xl font-bold text-gray-800">${item.name}</h3>
                        <p class="text-gray-600 text-lg">$${item.price}</p>
                    </div>
                    <button onclick="removeItem(${index})" class="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded">Remove</button>
                </div>
            `;
            container.innerHTML += itemHTML;
        });
        if(document.getElementById('total-price')) 
            document.getElementById('total-price').innerText = '$' + total.toFixed(2);
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('seniorCart', JSON.stringify(cart));
    renderCartPage();
    updateCartCount();
}
