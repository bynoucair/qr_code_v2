const MASTER_KEY = "1988"; 
const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function checkProtocol(val) {
    if (val === MASTER_KEY) {
        document.getElementById('sentinel').classList.add('unlocked');
        setTimeout(update, 500); 
    }
}

function update() {
    const color = document.getElementById('qr-color').value;
    document.documentElement.style.setProperty('--accent', color);
    
    const source = document.getElementById('qrcode-raw');
    source.innerHTML = "";
    
    // Create high-res QR source
    new QRCode(source, {
        text: document.getElementById('qr-input').value || "https://allthinkers.com",
        width: 1400, height: 1400,
        colorDark : color, colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // CRITICAL: Delay rendering to wait for library to finish
    setTimeout(() => { 
        const qr = source.querySelector('canvas'); 
        if (qr) render(qr); 
    }, 250);
}

function render(qr) {
    const text = document.getElementById('qr-caption').value.toUpperCase();
    const color = document.getElementById('qr-color').value;
    const scale = parseFloat(document.getElementById('qr-scale').value);
    const fontSize = parseInt(document.getElementById('qr-font').value);
    const gap = parseInt(document.getElementById('qr-gap').value);
    
    const size = 2000; // Final output resolution
    canvas.width = size; canvas.height = size;
    
    ctx.fillStyle = "#ffffff"; 
    ctx.fillRect(0, 0, size, size);

    const qrSize = size * scale;
    const labelH = 220;
    const totalH = qrSize + gap + labelH;
    const startY = (size - totalH) / 2;

    // Draw QR
    ctx.drawImage(qr, (size - qrSize) / 2, startY, qrSize, qrSize);

    // Draw Designer Label
    ctx.fillStyle = color;
    ctx.beginPath();
    const labelY = startY + qrSize + gap;
    ctx.roundRect((size - (qrSize + 40))/2, labelY, qrSize + 40, labelH, 60);
    ctx.fill();

    // Draw Text
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontSize * 2.2}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, labelY + (labelH / 2) + 10);
}

function handleDownload() {
    const link = document.createElement('a');
    link.download = `Architect-Ecosystem-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
}

// Add this to your existing script.js
function triggerRefresh() {
    const btn = document.querySelector('.btn-primary');
    btn.innerText = "SYNCHRONIZING...";
    update();
    setTimeout(() => {
        btn.innerText = "EXPORT IDENTITY";
    }, 600);
}

window.onload = () => {
    if(window.location.hash === "#bypass") document.getElementById('sentinel').remove();
};
