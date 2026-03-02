const MASTER_KEY = "1988"; 
const GOOGLE_URL = "https://script.google.com/macros/s/AKfycbwNRkFoFZFI3nsVhyeuwXY9G_PAynPURHo-LW5nT-jSiekkN6VgAq9MlqGCMatAIm2tjQ/exec";

const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

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
    if(!name || !email) return alert("Fill Name/Email");

    const id = `ARCHITECT-REQ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    btn.innerText = "SYNCING...";

    try {
        await fetch(GOOGLE_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify({ name, email, id }) });
        alert(`Success! ID: ${id}`);
        btn.innerText = "REQUEST SENT";
    } catch (e) { btn.innerText = "ERROR"; }
}

function update() {
    const color = document.getElementById('qr-color').value;
    document.documentElement.style.setProperty('--brand', color);
    const source = document.getElementById('qrcode-raw');
    source.innerHTML = "";
    
    new QRCode(source, {
        text: document.getElementById('qr-input').value || "https://allthinkers.com",
        width: 1000, height: 1000,
        colorDark : color, colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    setTimeout(() => { 
        const qr = source.querySelector('canvas'); 
        if (qr) render(qr); 
    }, 100);
}

function render(qr) {
    const text = document.getElementById('qr-caption').value.toUpperCase();
    const color = document.getElementById('qr-color').value;
    const scale = parseFloat(document.getElementById('qr-scale').value);
    const fontSize = parseInt(document.getElementById('qr-font').value);
    
    const size = 1200; canvas.width = size; canvas.height = size;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, size, size);

    const qrSize = size * scale;
    ctx.drawImage(qr, (size-qrSize)/2, (size-qrSize)/2 - 80, qrSize, qrSize);

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(100, 950, 1000, 150, 40);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontSize * 1.5}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, size/2, 1045);
}

function handleDownload() {
    const link = document.createElement('a');
    link.download = `QR-Architect.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

window.onload = () => { if(window.location.hash === "#test") document.getElementById('sentinel').remove(); };
