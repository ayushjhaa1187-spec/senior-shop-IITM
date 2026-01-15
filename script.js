/* --- 1. ACCESSIBILITY & STYLES (NEW) --- */
// We inject the high-contrast styles via JS so you don't have to edit every HTML file
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
`;
document.head.appendChild(styleSheet);

// On Page Load: Restore settings & Cart
window.onload = function() {
    // 1. Restore Accessibility Settings
    const savedSize = localStorage.getItem('fontSize');
    if (savedSize) document.documentElement.style.fontSize = savedSize + '%';
    
    if (localStorage.getItem('contrast') === 'high') {
        document.body.classList.add('high-contrast');
    }

    // 2. Load Cart Logic
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
};

/* --- 2. ACCESSIBILITY FUNCTIONS --- */
function changeTextSize(action) {
    let currentPercent = parseFloat(document.documentElement.style.fontSize) || 100;

    if (action === 'increase') currentPercent += 10;
    if (action === 'decrease') currentPercent -= 10;
    if (action === 'reset') currentPercent = 100;

    // Set limits (80% to 150%)
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

/* --- 3. SEARCH LOGIC --- */
function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (query.includes('phone') || query.includes('mobile')) window.location.href = 'shop.html';
    else if (query.includes('health') || query.includes('pill')) window.location.href = 'health.html';
    else if (query.includes('vision')) window.location.href = 'vision.html';
    else if (query.includes('hearing')) window.location.href = 'hearing.html';
    else if (query.includes('mobility') || query.includes('cane')) window.location.href = 'mobility.html';
    else { alert("Searching our catalog..."); window.location.href = 'shop.html'; }
}
function handleEnter(e) { if (e.key === 'Enter') handleSearch(); }

/* --- 4. READER LOGIC --- */
let currentUtterance = null;
function toggleReader() {
    const btn = document.getElementById('read-btn');
    const btnText = document.getElementById('read-text');
    
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        if(btnText) btnText.innerText = "Read";
        if(btn) btn.className = "flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-gray-700 transition w-28 justify-center border-2 border-transparent";
    } else {
        const content = document.querySelector('main').innerText;
        currentUtterance = new SpeechSynthesisUtterance(content);
        currentUtterance.rate = 0.9;
        if(btnText) btnText.innerText = "Stop";
        if(btn) btn.className = "flex items-center gap-2 bg-red-100 text-red-700 border-red-500 border-2 px-4 py-2 rounded-lg font-bold transition w-28 justify-center";
        window.speechSynthesis.speak(currentUtterance);
        currentUtterance.onend = function() { toggleReader(); };
    }
}

/* --- 5. CART LOGIC --- */
function addToCart(productName, price, image) {
    let cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    cart.push({ name: productName, price: price, img: image });
    localStorage.setItem('seniorCart', JSON.stringify(cart));
    updateCartCount();
    alert(productName + " added to cart!");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    const countElements = document.querySelectorAll('.cart-count-display');
    countElements.forEach(el => el.innerText = `Cart (${cart.length})`);
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
                    <img src="${item.img}" class="w-24 h-24 object-cover rounded-lg bg-gray-100">
                    <div class="flex-grow text-center md:text-left">
                        <h3 class="text-xl font-bold">${item.name}</h3>
                        <p class="text-gray-600">$${item.price}</p>
                    </div>
                    <button onclick="removeItem(${index})" class="text-red-600 font-bold underline px-4 py-2">Remove</button>
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
