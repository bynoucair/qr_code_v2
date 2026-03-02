const MASTER_KEY = "1988"; 
const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function checkProtocol(val) {
    if (val === MASTER_KEY) {
        document.getElementById('sentinel').classList.add('unlocked');
        setTimeout(update, 500); // Wait for unlock animation
    }
}

function update() {
    const color = document.getElementById('qr-color').value;
    document.documentElement.style.setProperty('--accent', color);
    
    const source = document.getElementById('qrcode-raw');
    source.innerHTML = "";
    
    // 1. Generate QR at high resolution
    new QRCode(source, {
        text: document.getElementById('qr-input').value || "https://allthinkers.com",
        width: 1400, height: 1400,
        colorDark : color, colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // 2. Fix the "Blank Screen" Race Condition
    // We wait 200ms to ensure the library finished drawing before we copy it
    setTimeout(() => { 
        const qr = source.querySelector('canvas'); 
        if (qr) render(qr); 
    }, 200);
}

function render(qr) {
    const text = document.getElementById('qr-caption').value.toUpperCase();
    const color = document.getElementById('qr-color').value;
    const scale = parseFloat(document.getElementById('qr-scale').value);
    const fontSize = parseInt(document.getElementById('qr-font').value);
    const gap = parseInt(document.getElementById('qr-gap').value);
    
    const size = 1800; // Master resolution
    canvas.width = size; canvas.height = size;
    
    // Background
    ctx.fillStyle = "#ffffff"; 
    ctx.fillRect(0, 0, size, size);

    const qrSize = size * scale;
    const labelH = 200;
    const totalH = qrSize + gap + labelH;
    const startY = (size - totalH) / 2;

    // Center & Draw QR
    ctx.drawImage(qr, (size - qrSize) / 2, startY, qrSize, qrSize);

    // Designer Label
    ctx.fillStyle = color;
    ctx.beginPath();
    const labelY = startY + qrSize + gap;
    ctx.roundRect((size - (qrSize + 40))/2, labelY, qrSize + 40, labelH, 50);
    ctx.fill();

    // Caption
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontSize * 2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, labelY + (labelH / 2) + 5);
}

function handleDownload() {
    const link = document.createElement('a');
    link.download = `Nou-Architect-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
}

window.onload = () => {
    if(window.location.hash === "#auth") document.getElementById('sentinel').remove();
};
