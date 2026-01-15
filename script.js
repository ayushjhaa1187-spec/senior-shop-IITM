/* --- 1. SEARCH LOGIC --- */
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

/* --- 2. READER LOGIC --- */
let currentUtterance = null;
function toggleReader() {
    const btn = document.getElementById('read-btn');
    const btnText = document.getElementById('read-text');
    
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        btnText.innerText = "Read";
        btn.className = "flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-gray-700 transition w-28 justify-center border-2 border-transparent";
    } else {
        const content = document.querySelector('main').innerText;
        currentUtterance = new SpeechSynthesisUtterance(content);
        currentUtterance.rate = 0.9;
        btnText.innerText = "Stop";
        btn.className = "flex items-center gap-2 bg-red-100 text-red-700 border-red-500 border-2 px-4 py-2 rounded-lg font-bold transition w-28 justify-center";
        window.speechSynthesis.speak(currentUtterance);
        currentUtterance.onend = function() { toggleReader(); }; // Reset when done
    }
}

/* --- 3. CART LOGIC (NEW) --- */
// Load cart count on every page load
window.onload = function() {
    updateCartCount();
    // If we are on the cart page, load the items
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
};

function addToCart(productName, price, image) {
    // 1. Get existing cart from storage
    let cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    
    // 2. Add new item
    cart.push({ name: productName, price: price, img: image });
    
    // 3. Save back to storage
    localStorage.setItem('seniorCart', JSON.stringify(cart));
    
    // 4. Update UI
    updateCartCount();
    alert(productName + " added to your cart!");
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
    
    // CLEAR CURRENT LIST
    if(container) container.innerHTML = '';

    // CHECK IF EMPTY
    if (cart.length === 0) {
        if(emptyMsg) emptyMsg.style.display = 'block';
        if(container) container.style.display = 'none';
        if(summary) summary.style.display = 'none';
    } else {
        if(emptyMsg) emptyMsg.style.display = 'none';
        if(container) container.style.display = 'block';
        if(summary) summary.style.display = 'block';

        let total = 0;
        
        // Loop through items and draw them
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

        // Update Total
        document.getElementById('total-price').innerText = '$' + total.toFixed(2);
    }
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    cart.splice(index, 1); // Remove item at that index
    localStorage.setItem('seniorCart', JSON.stringify(cart));
    renderCartPage(); // Re-draw the page
    updateCartCount();
}
