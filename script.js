const MASTER_KEY = "1988"; 
const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbwNRkFoFZFI3nsVhyeuwXY9G_PAynPURHo-LW5nT-jSiekkN6VgAq9MlqGCMatAIm2tjQ/exec";

// DOM References
const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');

// 1. MOBILE-SAFE INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    // Force initial render
    setTimeout(update, 500);
    
    // Bind button for mobile touch
    const submitBtn = document.getElementById('submit-btn');
    if(submitBtn) {
        submitBtn.addEventListener('click', submitToSheet);
        submitBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            submitToSheet();
        });
    }
});

function checkProtocol(val) {
    if (val === MASTER_KEY) {
        document.getElementById('sentinel').classList.add('unlocked');
        update();
    }
}

async function submitToSheet() {
    const name = document.getElementById('req-name').value;
    const email = document.getElementById('req-email').value;
    const btn = document.getElementById('submit-btn');

    if (!name || !email) return alert("Missing Credentials");

    const id = `ARCHITECT-REQ-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    btn.innerText = "SYNCING...";

    try {
        await fetch(GOOGLE_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ name, email, id })
        });
        btn.innerText = "LOGGED";
        alert(`ID GENERATED: ${id}\nNoucair will verify shortly.`);
    } catch (e) {
        btn.innerText = "ERROR";
    }
}

function update() {
    const source = document.getElementById('qrcode-raw');
    source.innerHTML = "";
    
    new QRCode(source, {
        text: "https://allthinkers.com",
        width: 1000, height: 1000,
        colorDark : "#3b82f6", colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    setTimeout(() => { 
        const qr = source.querySelector('canvas'); 
        if (qr) render(qr); 
    }, 150);
}

function render(qr) {
    const size = 1000;
    canvas.width = size; canvas.height = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    
    // Draw QR centered
    const qrSize = 750;
    ctx.drawImage(qr, (size-qrSize)/2, (size-qrSize)/2 - 50, qrSize, qrSize);
    
    // Draw Button Label
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.roundRect(150, 820, 700, 120, 30);
    ctx.fill();
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ACCESS ECOSYSTEM", size/2, 895);
}

function handleDownload() {
    const link = document.createElement('a');
    link.download = `Architect-Mobile.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}
