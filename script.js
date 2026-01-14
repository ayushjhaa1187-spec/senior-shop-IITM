<script>
    // DATA
    const products = [
        { name: "Big Button Phone", price: 89, icon: "📱", desc: "Large keys & SOS", category: "Phone" },
        { name: "Easy Tablet", price: 199, icon: "💻", desc: "Simple menu system", category: "Tablet" },
        { name: "Talking Watch", price: 29, icon: "⌚", desc: "Speaks the time", category: "Health" },
        { name: "SOS Pendant", price: 49, icon: "🔴", desc: "Emergency alert", category: "Health" },
        { name: "Loud Speaker", price: 59, icon: "🔊", desc: "Voice boost", category: "Accessories" },
        { name: "Stylus Pen", price: 19, icon: "🖊️", desc: "Easy grip handle", category: "Tablet" }
    ];

    let cartItems = [];
    let currentFontSize = 16;

    // INIT
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Page loaded, initializing...');
        renderProducts(products);
        
        // Add click listeners to close buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Close modal when clicking outside
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeAllModals();
                }
            });
        });
    });

    function renderProducts(items) {
        const grid = document.getElementById('productGrid');
        if (!grid) {
            console.error('Product grid not found!');
            return;
        }
        
        grid.innerHTML = "";
        items.forEach((p, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card touch-target-box';
            productCard.innerHTML = `
                <div style="font-size:3rem; margin-bottom:10px;">${p.icon}</div>
                <h3>${p.name}</h3>
                <p style="color:#666;">${p.desc}</p>
                <div class="price">$${p.price}</div>
                <button class="btn-primary add-to-cart-btn" style="width:100%; justify-content:center;" data-name="${p.name}" data-price="${p.price}">
                    Add to Cart
                </button>
            `;
            grid.appendChild(productCard);
        });
        
        // Add event listeners to all add-to-cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const price = parseFloat(this.getAttribute('data-price'));
                addToCart(name, price);
            });
        });
    }

    // CART LOGIC
    function addToCart(name, price) {
        console.log('Adding to cart:', name, price);
        cartItems.push({ name, price });
        
        const countElement = document.getElementById('cartCount');
        if (countElement) {
            countElement.innerText = cartItems.length;
        }
        
        updateCartDisplay();
        alert("✓ Added " + name + " to cart!");
    }

    function updateCartDisplay() {
        const list = document.getElementById('cartItemsList');
        const totalElement = document.getElementById('cartTotal');
        
        if (!list || !totalElement) {
            console.error('Cart elements not found!');
            return;
        }
        
        let total = 0;
        list.innerHTML = "";
        
        if (cartItems.length === 0) {
            list.innerHTML = "<p>Your cart is empty.</p>";
        } else {
            cartItems.forEach((item, index) => {
                total += item.price;
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <span>${item.name}</span>
                    <b>$${item.price}</b>
                `;
                list.appendChild(itemDiv);
            });
        }
        totalElement.innerText = "$" + total.toFixed(2);
    }

    // MODAL SYSTEM
    function closeAllModals() {
        console.log('Closing all modals');
        document.querySelectorAll('.modal-overlay').forEach(el => {
            el.classList.remove('show');
        });
    }

    function openCart() {
        console.log('Opening cart, items:', cartItems.length);
        closeAllModals();
        updateCartDisplay();
        
        const cartModal = document.getElementById('cartModal');
        if (cartModal) {
            cartModal.classList.add('show');
        } else {
            console.error('Cart modal not found!');
        }
    }

    function openPayment() {
        console.log('Opening payment modal');
        if (cartItems.length === 0) {
            alert("Cart is empty! Add items first.");
            return;
        }
        closeAllModals();
        
        const paymentModal = document.getElementById('paymentModal');
        if (paymentModal) {
            paymentModal.classList.add('show');
        } else {
            console.error('Payment modal not found!');
        }
    }

    function processPayment() {
        console.log('Processing payment');
        
        // Basic validation
        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const cardCVC = document.getElementById('cardCVC');

        if (!cardNumber || !cardExpiry || !cardCVC) {
            alert("Payment form elements not found!");
            return;
        }

        if (!cardNumber.value || !cardExpiry.value || !cardCVC.value) {
            alert("Please fill in all payment details");
            return;
        }

        // Simulate processing
        const btn = event.target;
        const originalText = btn.innerText;
        btn.innerText = "Processing...";
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
            
            // Generate order number
            const orderNum = 'ACT-2026-' + Math.floor(Math.random() * 10000);
            const orderElement = document.getElementById('orderNumber');
            if (orderElement) {
                orderElement.innerText = orderNum;
            }
            
            closeAllModals();
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.classList.add('show');
            }
            
            // Reset Cart
            cartItems = [];
            const countElement = document.getElementById('cartCount');
            if (countElement) {
                countElement.innerText = "0";
            }
            updateCartDisplay();
            
            // Clear form
            cardNumber.value = '';
            cardExpiry.value = '';
            cardCVC.value = '';
        }, 1500);
    }

    // UTILS
    function filterCategory(cat) {
        console.log('Filtering category:', cat);
        if (cat === 'all') {
            renderProducts(products);
        } else {
            renderProducts(products.filter(p => p.category === cat));
        }
        scrollToShop();
    }

    function resizeText(amount) {
        currentFontSize = Math.max(12, Math.min(32, currentFontSize + amount));
        document.body.style.fontSize = currentFontSize + "px";
    }
    
    function toggleAnnotations() { 
        document.body.classList.toggle('show-annotations'); 
    }
    
    function toggleHighContrast() { 
        document.body.classList.toggle('high-contrast-mode'); 
    }
    
    function scrollToShop() { 
        const shopSection = document.getElementById('shopSection');
        if (shopSection) {
            shopSection.scrollIntoView({behavior: 'smooth'});
        }
    }
</script>
