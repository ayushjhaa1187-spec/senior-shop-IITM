/* =========================================
   1. GLOBAL ACCESSIBILITY & STYLES
   ========================================= */
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    /* High Contrast Mode */
    body.contrast-high { background-color: #000000 !important; color: #FFFF00 !important; }
    body.contrast-high header, body.contrast-high footer, body.contrast-high section, body.contrast-high article, body.contrast-high div, body.contrast-high nav {
        background-color: #000000 !important; color: #FFFF00 !important; border-color: #FFFF00 !important;
    }
    body.contrast-high a, body.contrast-high button {
        background-color: #000000 !important; color: #FFFF00 !important; border: 2px solid #FFFFFF !important; font-weight: bold;
    }
    body.contrast-high img { filter: grayscale(100%) contrast(150%); }
    body.contrast-high input { background-color: #000 !important; color: #FFF !important; border: 2px solid #FFF !important; }

    /* INNOVATION: Large Click Targets Mode */
    body.large-targets button, body.large-targets a, body.large-targets input {
        min-height: 64px !important;
        min-width: 64px !important;
        font-size: 1.2rem !important;
        padding: 16px 24px !important;
    }

    /* Dyslexia Font */
    body.dyslexia-mode { font-family: 'OpenDyslexic', sans-serif !important; }

    /* Toast Notification */
    #toast { visibility: hidden; min-width: 280px; margin-left: -140px; background-color: #208090; color: #fff; text-align: center; border-radius: 50px; padding: 16px; position: fixed; z-index: 100; left: 50%; bottom: 30px; font-size: 18px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); font-weight: bold; }
    #toast.show { visibility: visible; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
    
    @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
    @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
`;
document.head.appendChild(styleSheet);

const toast = document.createElement("div");
toast.id = "toast";
toast.setAttribute('role', 'alert'); // Screen reader announcement
document.body.appendChild(toast);

// ON PAGE LOAD
window.onload = function() {
    updateCartCount();
    // Restore User Preferences
    if (localStorage.getItem('contrast') === 'high') document.body.classList.add('contrast-high');
    if (localStorage.getItem('mode') === 'large') document.body.classList.add('large-targets');
    if (localStorage.getItem('font') === 'dyslexic') document.body.classList.add('dyslexia-mode');

    // Page Specific Logic
    if (window.location.pathname.includes('cart.html')) renderCartPage();
    if (window.location.pathname.includes('tracking.html')) loadTrackingInfo();
    if (window.location.pathname.includes('orders.html')) loadOrderHistory();
};

/* =========================================
   2. ACCESSIBILITY TOGGLES
   ========================================= */
function toggleMenu() {
    const menu = document.getElementById('a11y-menu');
    const btn = document.getElementById('a11y-btn');
    menu.classList.toggle('open');
    const isOpen = menu.classList.contains('open');
    btn.setAttribute('aria-expanded', isOpen);
}

function setContrast(mode) {
    if (mode === 'high') {
        document.body.classList.add('contrast-high');
        localStorage.setItem('contrast', 'high');
    } else {
        document.body.classList.remove('contrast-high');
        localStorage.setItem('contrast', 'normal');
    }
}

function toggleLargeTargets() {
    document.body.classList.toggle('large-targets');
    const isLarge = document.body.classList.contains('large-targets');
    localStorage.setItem('mode', isLarge ? 'large' : 'normal');
}

function toggleDyslexia() {
    document.body.classList.toggle('dyslexia-mode');
    const isDyslexic = document.body.classList.contains('dyslexia-mode');
    localStorage.setItem('font', isDyslexic ? 'dyslexic' : 'normal');
}

/* =========================================
   3. CART & ORDER LOGIC
   ========================================= */
function addToCart(productName, price, image) {
    let cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    cart.push({ name: productName, price: price, img: image });
    localStorage.setItem('seniorCart', JSON.stringify(cart));
    updateCartCount();
    showToast(productName + " added to cart! 🛒");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    const countElements = document.querySelectorAll('.cart-count-display');
    countElements.forEach(el => el.innerText = `Cart (${cart.length})`);
}

function showToast(message) {
    const x = document.getElementById("toast");
    x.innerText = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

// ... (Keep existing renderCartPage, removeItem, placeOrder, loadOrderHistory logic from previous turn)
// Ensure renderCartPage has error handling if elements don't exist
function renderCartPage() {
    const container = document.getElementById('cart-items-container');
    if(!container) return; // Safety check
    
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    const emptyMsg = document.getElementById('empty-cart-msg');
    const summary = document.getElementById('cart-summary');
    
    container.innerHTML = '';

    if (cart.length === 0) {
        emptyMsg.style.display = 'block';
        container.style.display = 'none';
        summary.style.display = 'none';
    } else {
        emptyMsg.style.display = 'none';
        container.style.display = 'block';
        summary.style.display = 'block';

        let total = 0;
        cart.forEach((item, index) => {
            total += parseFloat(item.price);
            const itemHTML = `
                <div class="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-xl shadow border border-gray-200 mb-4">
                    <img src="${item.img}" alt="${item.name}" class="w-24 h-24 object-cover rounded-lg bg-gray-100 border border-gray-300">
                    <div class="flex-grow text-center md:text-left">
                        <h3 class="text-xl font-bold text-gray-800">${item.name}</h3>
                        <p class="text-gray-600 text-lg">$${item.price}</p>
                    </div>
                    <button onclick="removeItem(${index})" class="text-red-600 font-bold underline px-4 py-2 hover:bg-red-50 rounded text-lg" aria-label="Remove ${item.name} from cart">Remove</button>
                </div>
            `;
            container.innerHTML += itemHTML;
        });
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

function placeOrder(event) {
    event.preventDefault(); 
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    if(cart.length === 0) { alert("Your cart is empty!"); return; }

    const newOrder = {
        id: Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString(),
        status: "Shipped",
        items: cart,
        total: document.getElementById('total-price') ? document.getElementById('total-price').innerText : '$0.00'
    };

    let history = JSON.parse(localStorage.getItem('seniorOrderHistory')) || [];
    history.unshift(newOrder);
    localStorage.setItem('seniorOrderHistory', JSON.stringify(history));
    localStorage.removeItem('seniorCart');
    window.location.href = 'success.html';
}

function loadOrderHistory() {
    const container = document.getElementById('orders-container');
    if(!container) return;

    const history = JSON.parse(localStorage.getItem('seniorOrderHistory')) || [];
    const emptyMsg = document.getElementById('no-orders-msg');

    if (history.length === 0) {
        container.style.display = 'none';
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        container.style.display = 'block';
        container.innerHTML = '';
        history.forEach(order => {
            const itemNames = order.items.map(i => i.name).join(", ");
            const card = `
                <article class="bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 mb-6" tabindex="0" aria-label="Order number ${order.id}">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-4">
                        <div>
                            <span class="text-sm text-gray-500 font-bold uppercase">Order #${order.id}</span>
                            <div class="text-xl font-bold text-gray-800">${order.date}</div>
                        </div>
                        <div class="mt-2 md:mt-0">
                            <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-lg">🚚 ${order.status}</span>
                        </div>
                    </div>
                    <div class="mb-4">
                        <p class="text-gray-600 text-lg"><span class="font-bold">Items:</span> ${itemNames}</p>
                        <p class="text-gray-600 text-lg"><span class="font-bold">Total:</span> <span class="text-[#208090] font-bold">${order.total}</span></p>
                    </div>
                </article>
            `;
            container.innerHTML += card;
        });
    }
}
