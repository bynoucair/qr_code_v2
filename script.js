const MASTER_KEY = "1988"; 
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwNRkFoFZFI3nsVhyeuwXY9G_PAynPURHo-LW5nT-jSiekkN6VgAq9MlqGCMatAIm2tjQ/exec";

const canvas = document.getElementById('output-canvas');
const ctx = canvas.getContext('2d');

/** 1. SECURITY & DATA SYNCHRONIZATION **/
function checkProtocol(val) {
    if (val === MASTER_KEY) {
        document.getElementById('sentinel').classList.add('unlocked');
    }
}

async function submitToSheet() {
    const nameInput = document.getElementById('req-name');
    const emailInput = document.getElementById('req-email');
    const btn = document.getElementById('submit-btn');

    if (!nameInput.value || !emailInput.value) {
        alert("Strategic Oversight: Please provide Name and Email.");
        return;
    }

    // Dynamic ID Generation
    const randomID = Math.random().toString(36).substring(2, 8).toUpperCase();
    const fullID = `ARCHITECT-REQ-${randomID}`;

    btn.innerText = "SYNCHRONIZING...";
    btn.disabled = true;

    try {
        // Essential 'no-cors' mode for GitHub-to-Google communication
        await fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors', 
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: nameInput.value, 
                email: emailInput.value, 
                id: fullID 
            })
        });

        // UI Feedback: Assuming success with no-cors
        btn.innerText = "REQUEST SENT";
        btn.style.background = "#10b981";
        
        alert(`Success! Your Request ID is: ${fullID}\n\nNoucair has received your data. Access Key will be sent via WhatsApp/Email.`);
        
        nameInput.value = "";
        emailInput.value = "";
        btn.disabled = false;

    } catch (error) {
        console.error("Sync Error:", error);
        btn.innerText = "RETRY";
        btn.disabled = false;
    }
}

/** 2. WORKSTATION CORE **/
function setPreset(color, cap) {
    document.getElementById('qr-color').value = color;
    document.getElementById('qr-caption').value = cap;
    update();
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
    }, 80);
}

function render(qr) {
    const text = document.getElementById('qr-caption').value.toUpperCase();
    const color = document.getElementById('qr-color').value;
    const scale = parseFloat(document.getElementById('qr-scale').value);
    const fontSize = parseInt(document.getElementById('qr-font').value);
    
    const size = 1400; canvas.width = size; canvas.height = size;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, size, size);

    const qrSize = size * scale * 0.85;
    const bannerH = fontSize * 3.5;
    const gap = 60;
    const totalH = qrSize + gap + bannerH;

    const qrX = (size - qrSize) / 2;
    const qrY = (size - totalH) / 2;

    ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);
    ctx.fillStyle = color;
    ctx.beginPath(); 
    ctx.roundRect((size - (qrSize + 40))/2, qrY + qrSize + gap, qrSize + 40, bannerH, 40); 
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${fontSize}px 'Plus Jakarta Sans'`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, size/2, qrY + qrSize + gap + (bannerH/2) + 5);
}

function handleDownload() {
    const link = document.createElement('a');
    link.download = `Architect-Prime-Identity.png`;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
}

function exportExecutiveSummary() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFillColor(3, 7, 18); doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8); doc.text("BY NOUCAIR B. | EXECUTIVE IDENTITY", 20, 20);
    doc.addImage(canvas.toDataURL("image/png"), 'PNG', 40, 50, 130, 130);
    doc.save(`Executive-Summary.pdf`);
}

window.onload = () => update();
