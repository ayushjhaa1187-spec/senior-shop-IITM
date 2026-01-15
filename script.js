/* --- UPDATED ORDER LOGIC (Saves History) --- */
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
        status: "Shipped", // Default status
        items: cart,
        total: document.getElementById('total-price') ? document.getElementById('total-price').innerText : '$0.00'
    };

    // 1. Get Existing History
    let history = JSON.parse(localStorage.getItem('seniorOrderHistory')) || [];
    
    // 2. Add New Order to Top of List
    history.unshift(newOrder);
    
    // 3. Save Back to Storage
    localStorage.setItem('seniorOrderHistory', JSON.stringify(history));
    
    // 4. Clear Cart & Redirect
    localStorage.removeItem('seniorCart');
    window.location.href = 'success.html';
}

/* --- LOAD ORDER HISTORY (For the new Orders Page) --- */
function loadOrderHistory() {
    const history = JSON.parse(localStorage.getItem('seniorOrderHistory')) || [];
    const container = document.getElementById('orders-container');
    const emptyMsg = document.getElementById('no-orders-msg');

    if (history.length === 0) {
        if(container) container.style.display = 'none';
        if(emptyMsg) emptyMsg.style.display = 'block';
        return;
    }

    if(container) {
        container.innerHTML = ''; // Clear current list
        history.forEach(order => {
            // Create a card for each order
            const card = document.createElement('div');
            card.className = "bg-white p-6 rounded-xl shadow-md border-2 border-gray-100 mb-6";
            
            // Build Item List String
            const itemNames = order.items.map(i => i.name).join(", ");

            card.innerHTML = `
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-4">
                    <div>
                        <span class="text-sm text-gray-500 font-bold uppercase">Order #${order.id}</span>
                        <div class="text-xl font-bold text-gray-800">${order.date}</div>
                    </div>
                    <div class="mt-2 md:mt-0">
                        <span class="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-lg">
                            🚚 ${order.status}
                        </span>
                    </div>
                </div>
                <div class="mb-4">
                    <p class="text-gray-600 text-lg"><span class="font-bold">Items:</span> ${itemNames}</p>
                    <p class="text-gray-600 text-lg"><span class="font-bold">Total:</span> <span class="text-[#208090] font-bold">${order.total}</span></p>
                </div>
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span class="font-bold text-gray-700">Status: On the way to your home.</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-4 mt-3">
                        <div class="bg-[#208090] h-4 rounded-full" style="width: 60%"></div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        
        container.style.display = 'block';
        if(emptyMsg) emptyMsg.style.display = 'none';
    }
}
