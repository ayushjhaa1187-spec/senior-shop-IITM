// --- SEARCH LOGIC ---
function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    
    if (query.includes('phone') || query.includes('mobile') || query.includes('call')) {
        window.location.href = 'shop.html';
    } 
    else if (query.includes('pill') || query.includes('med') || query.includes('pressure') || query.includes('health')) {
        window.location.href = 'health.html';
    }
    else if (query.includes('glass') || query.includes('eye') || query.includes('vision') || query.includes('read')) {
        window.location.href = 'vision.html';
    }
    else if (query.includes('hearing') || query.includes('ear')) {
        alert("Hearing aids page coming soon!");
    }
    else {
        alert("We couldn't find a specific category for that. Taking you to our full catalog.");
        window.location.href = 'shop.html';
    }
}

function handleEnter(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
}

// --- READER LOGIC (START/STOP) ---
let currentUtterance = null;

function toggleReader() {
    const btn = document.getElementById('read-btn');
    const btnText = document.getElementById('read-text');

    if (window.speechSynthesis.speaking) {
        // STOP ACTION
        window.speechSynthesis.cancel();
        
        // Reset Button Style
        btnText.innerText = "Read";
        btn.classList.remove('bg-red-100', 'text-red-700', 'border-red-500'); 
        btn.classList.add('bg-gray-100', 'text-gray-700'); 
    } 
    else {
        // START ACTION
        const content = document.querySelector('main').innerText;
        currentUtterance = new SpeechSynthesisUtterance(content);
        currentUtterance.rate = 0.9;
        
        // Change Button Style to Stop
        btnText.innerText = "Stop";
        btn.classList.remove('bg-gray-100', 'text-gray-700');
        btn.classList.add('bg-red-100', 'text-red-700', 'border-red-500'); 
        
        window.speechSynthesis.speak(currentUtterance);

        // Auto-reset when done
        currentUtterance.onend = function() {
            btnText.innerText = "Read";
            btn.classList.remove('bg-red-100', 'text-red-700', 'border-red-500');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        };
    }
}
