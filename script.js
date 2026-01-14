/* ========= READ PAGE ========= */
function readPage() {
  speechSynthesis.cancel();
  const text = document.querySelector("main").innerText;
  const msg = new SpeechSynthesisUtterance(text);
  msg.rate = 0.9;
  speechSynthesis.speak(msg);
}

/* ========= VOICE ========= */
function startVoice() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice not supported");
    return;
  }
  const r = new webkitSpeechRecognition();
  r.lang = "en-US";
  r.onresult = e => handleVoice(e.results[0][0].transcript.toLowerCase());
  r.start();
}

function handleVoice(cmd) {
  if (cmd.includes("home")) location.href = "index.html";
  else if (cmd.includes("cart")) location.href = "cart.html";
  else if (cmd.includes("checkout")) location.href = "payment.html";
  else if (cmd.includes("read")) readPage();
}

/* ========= CART ========= */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const found = cart.find(p => p.id === product.id);
  if (found) found.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart(cart);
  location.href = "cart.html";
}
