/* =========================================
   SENIOR SHOP - ACCESSIBILITY ENGINE
   ========================================= */

// 1. GLOBAL SETTINGS RESTORE
window.onload = function() {
    updateCartCount();
    // Restore User Preferences
    if (localStorage.getItem('contrast') === 'high') document.body.classList.add('contrast-high');
    if (localStorage.getItem('mode') === 'large') document.body.classList.add('large-targets');
    
    // Page Specific Loads
    if (window.location.pathname.includes('cart.html')) renderCartPage();
    if (window.location.pathname.includes('orders.html')) loadOrderHistory();
    if (window.location.pathname.includes('tracking.html')) loadTrackingInfo();
};

/* =========================================
   2. ACCESSIBILITY TOGGLES
   ========================================= */
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

/* =========================================
   3. CART LOGIC WITH ARIA LIVE (Critical Fix)
   ========================================= */
function addToCart(productName, price, image) {
    let cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    cart.push({ name: productName, price: price, img: image });
    localStorage.setItem('seniorCart', JSON.stringify(cart));
    
    updateCartCount();
    
    // ARIA LIVE ANNOUNCEMENT [Fixes Status Message Error]
    const announcement = `${productName} added to cart. Cart now has ${cart.length} items.`;
    announceToScreenReader(announcement);
    
    alert(announcement); // Visual feedback as well
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    const countElements = document.querySelectorAll('.cart-count-display');
    countElements.forEach(el => el.innerText = `Cart (${cart.length})`);
}

// Helper to speak to screen readers without visual clutter
function announceToScreenReader(message) {
    let alertBox = document.getElementById('a11y-announcer');
    if (!alertBox) {
        alertBox = document.createElement('div');
        alertBox.id = 'a11y-announcer';
        alertBox.setAttribute('aria-live', 'polite');
        alertBox.style.position = 'absolute';
        alertBox.style.left = '-9999px';
        document.body.appendChild(alertBox);
    }
    alertBox.innerText = message;
}

// ... [Keep your existing renderCartPage, placeOrder, etc. functions here]
