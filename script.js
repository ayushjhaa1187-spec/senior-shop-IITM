/* =========================================
   SENIOR SHOP - ACCESSIBILITY ENGINE
   ========================================= */

// Create Toast Element Dynamically
const toast = document.createElement("div");
toast.id = "toast";
toast.setAttribute('role', 'alert');
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
    if(menu && btn) {
        menu.classList.toggle('open');
        const isOpen = menu.classList.contains('open');
        btn.setAttribute('aria-expanded', isOpen);
    }
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
   3. CART LOGIC
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
    if(x) {
        x.innerText = message;
        x.className = "show";
        setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}

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

/* =========================================
   4. ORDER LOGIC
   ========================================= */
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
    
    // Also save for tracking page
    localStorage.setItem('seniorLastOrder', JSON.stringify(newOrder));
    
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
        if(emptyMsg) emptyMsg.style.display = 'block';
    } else {
        if(emptyMsg) emptyMsg.style.display = 'none';
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

function loadTrackingInfo() {
    const order = JSON.parse(localStorage.getItem('seniorLastOrder'));
    const container = document.getElementById('tracking-container');
    const errorMsg = document.getElementById('no-order-msg');

    if (!order) {
        if(container) container.style.display = 'none';
        if(errorMsg) errorMsg.style.display = 'block';
        return;
    }

    document.getElementById('order-id-display').innerText = '#' + order.id;
    document.getElementById('order-date-display').innerText = order.date;
    document.getElementById('item-count-display').innerText = order.items.length + ' Items';

    if(container) container.style.display = 'block';
    if(errorMsg) errorMsg.style.display = 'none';
}
