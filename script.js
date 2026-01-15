/* =========================================
   1. ACCESSIBILITY & STYLES
   ========================================= */
// We inject these styles automatically so you don't have to edit every HTML file
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    /* High Contrast Mode */
    body.high-contrast { background-color: #000000 !important; color: #FFFF00 !important; }
    body.high-contrast header, body.high-contrast footer, body.high-contrast section, body.high-contrast article, body.high-contrast div, body.high-contrast nav {
        background-color: #000000 !important; color: #FFFF00 !important; border-color: #FFFF00 !important;
    }
    body.high-contrast a, body.high-contrast button {
        background-color: #FFFF00 !important; color: #000000 !important; border: 2px solid #FFFFFF !important; font-weight: bold;
    }
    body.high-contrast img { filter: grayscale(100%) contrast(150%); }
    body.high-contrast input { background-color: #000 !important; color: #FFF !important; border: 2px solid #FFF !important; }
    
    /* Toolbar Styles */
    #a11y-bar { background: #1F2937; color: white; padding: 0.5rem; position: relative; z-index: 60; }
    #a11y-bar button { margin: 0 4px; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 14px; }
    
    /* Notification Toast (The "Item Added" Popup) */
    #toast { visibility: hidden; min-width: 250px; margin-left: -125px; background-color: #208090; color: #fff; text-align: center; border-radius: 8px; padding: 16px; position: fixed; z-index: 100; left: 50%; bottom: 30px; font-size: 17px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    #toast.show { visibility: visible; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
    @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
    @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
`;
document.head.appendChild(styleSheet);

// Add the Toast element to the page
const toast = document.createElement("div");
toast.id = "toast";
document.body.appendChild(toast);

// ON PAGE LOAD: Restore settings & Load Cart
window.onload = function() {
    // 1. Restore Accessibility Settings
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) document.documentElement.style.fontSize = savedSize + '%';
    
    if (localStorage.getItem('contrast') === 'high') {
        document.body.classList.add('high-contrast');
    }

    // 2. Load Cart Count in Header
    updateCartCount();

    // 3. If we are on the Cart Page, show the items
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
    
    // 4. If we are on the Tracking Page, show tracking
    if (window.location.pathname.includes('tracking.html')) {
        loadTrackingInfo();
    }
};

/* =========================================
   2. ACCESSIBILITY FUNCTIONS
   ========================================= */
function changeTextSize(action) {
    let currentPercent = parseFloat(document.documentElement.style.fontSize) || 100;

    if (action === 'increase') currentPercent += 10;
    if (action === 'decrease') currentPercent -= 10;
    if (action === 'reset') currentPercent = 100;

    // Set limits
    if (currentPercent < 80) currentPercent = 80;
    if (currentPercent > 150) currentPercent = 150;

    document.documentElement.style.fontSize = currentPercent + '%';
    localStorage.setItem('fontSize', currentPercent);
}

function toggleContrast() {
    document.body.classList.toggle('high-contrast');
    const isHigh = document.body.classList.contains('high-contrast');
    localStorage.setItem('contrast', isHigh ? 'high' : 'normal');
}

/* =========================================
   3. CART LOGIC
   ========================================= */
function addToCart(productName, price, image) {
    // 1. Get existing cart
    let cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    
    // 2. Add new item
    cart.push({ name: productName, price: price, img: image });
    
    // 3. Save back to storage
    localStorage.setItem('seniorCart', JSON.stringify(cart));
    
    // 4. Update Header Count
    updateCartCount();
    
    // 5. Show Notification
    showToast(productName + " added to cart!");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    const countElements = document.querySelectorAll('.cart-count-display');
    countElements.forEach(el => el.innerText = `Cart (${cart.length})`);
}

function showToast(message) {
    const x = document.getElementById("toast");
    x.innerText = "✅ " + message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

function renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    const container = document.getElementById('cart-items-container');
    const emptyMsg = document.getElementById('empty-cart-msg');
    const summary = document.getElementById('cart-summary');
    
    if(container) container.innerHTML = '';

    if (cart.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        if(container) container.style.display = 'none';
        if(summary) summary.style.display = 'none';
    } else {
        if(emptyMsg) emptyMsg.style.display = 'none';
        if(container) container.style.display = 'block';
        if(summary) summary.style.display = 'block';

        let total = 0;
        cart.forEach((item, index) => {
            total += parseFloat(item.price);
            const itemHTML = `
                <div class="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-xl shadow border border-gray-200 mb-4">
                    <img src="${item.img}" class="w-24 h-24 object-cover rounded-lg bg-gray-100 border border-gray-300">
                    <div class="flex-grow text-center md:text-left">
                        <h3 class="text-xl font-bold text-gray-800">${item.name}</h3>
                        <p class="text-gray-600 text-lg">$${item.price}</p>
                    </div>
                    <button onclick="removeItem(${index})" class="text-red-600 font-bold underline px-4 py-2 hover:bg-red-50 rounded text-lg">Remove</button>
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

/* =========================================
   4. CHECKOUT & TRACKING LOGIC
   ========================================= */
function placeOrder(event) {
    event.preventDefault(); 
    
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const newOrder = {
        id: Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleDateString(),
        status: "Shipped",
        items: cart
    };

    localStorage.setItem('seniorLastOrder', JSON.stringify(newOrder));
    localStorage.removeItem('seniorCart');
    window.location.href = 'success.html';
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

/* =========================================
   5. SEARCH & READER LOGIC
   ========================================= */
function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (query.includes('phone') || query.includes('mobile')) window.location.href = 'shop.html';
    else if (query.includes('health') || query.includes('pill')) window.location.href = 'health.html';
    else if (query.includes('vision')) window.location.href = 'vision.html';
    else { alert("Searching..."); window.location.href = 'shop.html'; }
}

function handleEnter(e) { if (e.key === 'Enter') handleSearch(); }

function toggleReader() {
    const btn = document.getElementById('read-btn');
    const btnText = document.getElementById('read-text');
    
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if(btnText) btnText.innerText = "Read";
        if(btn) btn.className = "flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-gray-700 transition w-28 justify-center border-2 border-transparent";
    } else {
        const content = document.querySelector('main').innerText;
        const speech = new SpeechSynthesisUtterance(content);
        speech.rate = 0.9;
        if(btnText) btnText.innerText = "Stop";
        if(btn) btn.className = "flex items-center gap-2 bg-red-100 text-red-700 border-red-500 border-2 px-4 py-2 rounded-lg font-bold transition w-28 justify-center";
        window.speechSynthesis.speak(speech);
        speech.onend = function() { toggleReader(); };
    }
}
