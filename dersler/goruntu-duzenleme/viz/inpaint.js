// Görüntü Düzenleme — İnteraktif inpainting demo (maske boyama)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-inpaint"] = function () {
    const mount = document.getElementById("viz-inpaint");
    if (!mount) return;

    const GRID = 20;

    mount.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:4px;max-width:640px;margin:0 auto">
            ${["Orijinal", "Maske (siz çizin)", "Sonuç"].map(b => `
                <div style="text-align:center;font-size:0.78rem;color:var(--edu-text-dim);font-weight:600">${b}</div>`).join("")}
            <canvas id="inp-orj" style="width:100%;border-radius:6px;background:#111;aspect-ratio:1;display:block"></canvas>
            <canvas id="inp-maske" style="width:100%;border-radius:6px;background:#111;aspect-ratio:1;display:block;cursor:crosshair;touch-action:none"></canvas>
            <canvas id="inp-sonuc" style="width:100%;border-radius:6px;background:#111;aspect-ratio:1;display:block"></canvas>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;padding:4px 0 6px">
            <button id="inp-clear" style="padding:5px 12px;border-radius:8px;background:rgba(255,255,255,0.07);border:1px solid var(--edu-border);color:var(--edu-text);cursor:pointer;font-size:0.78rem;font-family:Inter">Temizle</button>
        </div>
        <div style="text-align:center;font-size:0.72rem;color:var(--edu-text-dim);padding-bottom:4px">Orta panele fırçayla maske çizin — model o bölgeyi yeniden üretir (simülasyon)</div>`;

    const orjC = document.getElementById("inp-orj").getContext("2d");
    const maskeC = document.getElementById("inp-maske").getContext("2d");
    const sonucC = document.getElementById("inp-sonuc").getContext("2d");
    const maskeCanvas = document.getElementById("inp-maske");

    const W = 300;
    [orjC, maskeC, sonucC].forEach(c => { c.canvas.width = W; c.canvas.height = W; });

    // Basit "manzara" resmi üret
    function orjResimCiz(ctx) {
        const sol = W * 0.55;
        // Gök
        const gradient = ctx.createLinearGradient(0, 0, 0, W * 0.55);
        gradient.addColorStop(0, "#87CEEB"); gradient.addColorStop(1, "#FFD700");
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, W * 0.55);
        // Güneş
        ctx.fillStyle = "#FFA500"; ctx.beginPath(); ctx.arc(W * 0.75, W * 0.2, W * 0.1, 0, Math.PI * 2); ctx.fill();
        // Deniz
        ctx.fillStyle = "#1E90FF"; ctx.fillRect(0, W * 0.55, W, W * 0.45);
        // Dalga
        ctx.fillStyle = "#B0E0E6";
        for (let i = 0; i < 6; i++) ctx.fillRect(W * 0.1 + i * 45, W * 0.58 + (i % 2) * 8, 28, 4);
        // Palmiye benzeri
        ctx.fillStyle = "#8B4513"; ctx.fillRect(W * 0.28, W * 0.42, 8, 35);
        ctx.fillStyle = "#228B22"; ctx.fillRect(W * 0.18, W * 0.30, 55, 20);
    }

    orjResimCiz(orjC);
    maskeC.fillStyle = "#000"; maskeC.fillRect(0, 0, W, W);
    sonucC.drawImage(orjC.canvas, 0, 0);

    let ciziyorum = false;
    let sonX = -1, sonY = -1;

    function maskeGuncelle(x, y) {
        const r = maskeCanvas.getBoundingClientRect();
        const sx = (x - r.left) / r.width * W;
        const sy = (y - r.top) / r.height * W;
        if (sonX >= 0) {
            maskeC.strokeStyle = "#fff"; maskeC.lineWidth = 14; maskeC.lineCap = "round";
            maskeC.beginPath(); maskeC.moveTo(sonX, sonY); maskeC.lineTo(sx, sy); maskeC.stroke();
        } else {
            maskeC.fillStyle = "#fff";
            maskeC.beginPath(); maskeC.arc(sx, sy, 7, 0, Math.PI * 2); maskeC.fill();
        }
        sonX = sx; sonY = sy;
        sonucUret();
    }

    function sonucUret() {
        sonucC.drawImage(orjC.canvas, 0, 0);
        const md = maskeC.getImageData(0, 0, W, W).data;
        const sd = sonucC.getImageData(0, 0, W, W);
        // Masked bölgeyi "diffusion benzeri" bulanık/değiştir
        for (let i = 0; i < sd.data.length; i += 4) {
            if (md[i] > 128) { // maskeli piksel
                const px = (i / 4) % W, py = Math.floor(i / 4 / W);
                // Gürültü + hafif renk değişimi simülasyonu
                sd.data[i]     = Math.min(255, sd.data[i] * 0.6 + Math.sin(px * 0.3) * 60 + 80);
                sd.data[i + 1] = Math.min(255, sd.data[i + 1] * 0.5 + Math.cos(py * 0.3) * 40 + 60);
                sd.data[i + 2] = Math.min(255, sd.data[i + 2] * 0.8);
            }
        }
        sonucC.putImageData(sd, 0, 0);
        // Kenarları hafif yumuşat
        sonucC.filter = "blur(1px)";
        sonucC.drawImage(sonucC.canvas, 0, 0);
        sonucC.filter = "none";
    }

    maskeCanvas.addEventListener("mousedown", e => { ciziyorum = true; sonX = -1; maskeGuncelle(e.clientX, e.clientY); });
    maskeCanvas.addEventListener("mousemove", e => { if (ciziyorum) maskeGuncelle(e.clientX, e.clientY); });
    window.addEventListener("mouseup", () => { ciziyorum = false; });
    maskeCanvas.addEventListener("touchstart", e => { e.preventDefault(); ciziyorum = true; sonX = -1; const t = e.touches[0]; maskeGuncelle(t.clientX, t.clientY); }, { passive: false });
    maskeCanvas.addEventListener("touchmove", e => { e.preventDefault(); if (ciziyorum) { const t = e.touches[0]; maskeGuncelle(t.clientX, t.clientY); } }, { passive: false });
    maskeCanvas.addEventListener("touchend", () => { ciziyorum = false; });

    document.getElementById("inp-clear").onclick = () => {
        maskeC.fillStyle = "#000"; maskeC.fillRect(0, 0, W, W);
        sonucC.drawImage(orjC.canvas, 0, 0);
    };

    orjResimCiz(orjC);
    sonucC.drawImage(orjC.canvas, 0, 0);
};
