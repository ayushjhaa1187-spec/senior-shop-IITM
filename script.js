/* --- 6. ORDER TRACKING LOGIC --- */
function placeOrder(event) {
    event.preventDefault(); // Stop the form from refreshing immediately

    // 1. Generate a random Order ID
    const orderId = Math.floor(100000 + Math.random() * 900000);
    
    // 2. Get current cart items
    const cart = JSON.parse(localStorage.getItem('seniorCart')) || [];
    
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // 3. Create the Order Object
    const newOrder = {
        id: orderId,
        date: new Date().toLocaleDateString(),
        status: "Shipped", // We simulate that it is already shipped
        items: cart,
        total: document.getElementById('total-sum-display') ? document.getElementById('total-sum-display').innerText : '$99.99'
    };

    // 4. Save to Local Storage (Simulating a database)
    localStorage.setItem('seniorLastOrder', JSON.stringify(newOrder));

    // 5. Clear the Cart
    localStorage.removeItem('seniorCart');

    // 6. Go to Success Page
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

    // Update Text Details
    document.getElementById('order-id-display').innerText = '#' + order.id;
    document.getElementById('order-date-display').innerText = order.date;
    document.getElementById('item-count-display').innerText = order.items.length + ' Items';

    // Show the Tracking UI
    if(container) container.style.display = 'block';
    if(errorMsg) errorMsg.style.display = 'none';
}
