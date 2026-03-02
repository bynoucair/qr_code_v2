const MASTER_KEY = "1988"; 
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

function update() {
    const color = document.getElementById('qr-color').value;
    document.documentElement.style.setProperty('--brand', color);
    const source = document.getElementById('qrcode-raw');
    source.innerHTML = "";
    
    // Higher resolution source for crisp rendering
    new QRCode(source, {
        text: document.getElementById('qr-input').value || "https://allthinkers.com",
        width: 1200, height: 1200,
        colorDark : color, colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    setTimeout(() => { 
        const qr = source.querySelector('canvas'); 
        if (qr) render(qr); 
    }, 120);
}

function render(qr) {
    const text = document.getElementById('qr-caption').value.toUpperCase();
    const color = document.getElementById('qr-color').value;
    const scale = parseFloat(document.getElementById('qr-scale').value);
    const fontSize = parseInt(document.getElementById('qr-font').value);
    
    const size = 1500; canvas.width = size; canvas.height = size;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, size, size);

    const qrSize = size * scale;
    // Position QR slightly higher to make room for caption
    ctx.drawImage(qr, (size-qrSize)/2, (size-qrSize)/2 - 100, qrSize, qrSize);

    // Draw Designer Label
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(100, size - 250, size - 200, 180, 50);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontSize * 1.8}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(text, size/2, size - 145);
}

function handleDownload() {
    const link = document.createElement('a');
    link.download = `Architect-Prime-v4.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
}

function render(qr) {
    const text = document.getElementById('qr-caption').value.toUpperCase();
    const color = document.getElementById('qr-color').value;
    const scale = parseFloat(document.getElementById('qr-scale').value);
    const fontSize = parseInt(document.getElementById('qr-font').value);
    const gap = parseInt(document.getElementById('qr-gap').value); // New Gap Parameter
    
    const size = 1500; 
    canvas.width = size; 
    canvas.height = size;
    
    // Background
    ctx.fillStyle = "#ffffff"; 
    ctx.fillRect(0, 0, size, size);

    const qrSize = size * scale;
    const labelHeight = 160;
    
    // Calculate total content height to center everything vertically
    const totalContentHeight = qrSize + gap + labelHeight;
    const startY = (size - totalContentHeight) / 2;

    // 1. Draw QR Code
    ctx.drawImage(qr, (size - qrSize) / 2, startY, qrSize, qrSize);

    // 2. Draw Label (with the specified Gap)
    ctx.fillStyle = color;
    ctx.beginPath();
    const labelY = startY + qrSize + gap;
    ctx.roundRect(150, labelY, size - 300, labelHeight, 40);
    ctx.fill();

    // 3. Draw Text
    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${fontSize * 1.8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, size / 2, labelY + (labelHeight / 2) + 5);
}

// Ensure the update function pulls the new gap value
function update() {
    const color = document.getElementById('qr-color').value;
    document.documentElement.style.setProperty('--brand', color);
    const source = document.getElementById('qrcode-raw');
    source.innerHTML = "";
    
    new QRCode(source, {
        text: document.getElementById('qr-input').value || "https://allthinkers.com",
        width: 1200, height: 1200,
        colorDark : color, colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    setTimeout(() => { 
        const qr = source.querySelector('canvas'); 
        if (qr) render(qr); 
    }, 120);
}


window.onload = () => {
    // Hidden debug for mobile testing
    if(window.location.hash === "#bypass") document.getElementById('sentinel').remove();
};
