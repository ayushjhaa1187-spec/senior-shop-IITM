// PRODUCT DATABASE
const PRODUCTS = {
  phone1: {
    id: "phone1",
    name: "Jitterbug Flip 2",
    price: 99.99,
    image: "https://placehold.co/400x300/208090/FFFFFF?text=Jitterbug+Flip",
    description: "Large buttons, loud speaker, very easy to use."
  },
  phone2: {
    id: "phone2",
    name: "Clarity Alto Plus",
    price: 129.99,
    image: "https://placehold.co/400x300/EEEEEE/208090?text=Clarity+Alto",
    description: "Extra loud volume with flashing ringer."
  },
  phone3: {
    id: "phone3",
    name: "Snapfon ez4G",
    price: 79.99,
    image: "https://placehold.co/400x300/333333/FFFFFF?text=Snapfon",
    description: "Talking keypad with SOS button."
  }
};

// CART HELPERS
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || {};
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  window.location.href = "cart.html";
}

function updateQty(id, delta) {
  const cart = getCart();
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  location.reload();
}

function removeItem(id) {
  const cart = getCart();
  delete cart[id];
  saveCart(cart);
  location.reload();
}
