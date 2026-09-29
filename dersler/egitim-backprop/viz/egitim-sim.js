// Geriye Yayılım — Eğitim simülasyonu: kayıp eğrisi + karar sınırı
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-egitim-sim"] = function () {
    const hv = VizHelpers.canvas2D("viz-egitim-sim", 0.5);
    if (!hv) return;
    const { ctx } = hv;

    // Basit 2 sınıflı sınıflandırma simülasyonu
    // Karar sınırı: w1*x + w2*y + b > 0 → sınıf 1, yoksa sınıf 0
    const NOKTALAR = [];
    const sr = (seed => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; })(7);
    for (let i = 0; i < 40; i++) {
        const sinif = i < 20 ? 0 : 1;
        const cx = sinif === 0 ? 0.3 : 0.7;
        const cy = sinif === 0 ? 0.65 : 0.3;
        NOKTALAR.push({
            x: cx + (sr() - 0.5) * 0.35,
            y: cy + (sr() - 0.5) * 0.35,
            sinif
        });
    }

    // Başlangıç ağırlıkları — kötü başlangıç
    let w1 = -0.5, w2 = 0.3, bias = 0.1;
    const lr = 0.05;
    let epoch = 0;
    const MAX_EPOCH = 50;
    const kayipGecmisi = [];

    let animId = null;
    let calisiyor = true;

    function hesaplaKayip() {
        let hata = 0;
        for (const p of NOKTALAR) {
            const skor = w1 * p.x + w2 * p.y + bias;
            const pred = skor > 0 ? 1 : 0;
            if (pred !== p.sinif) hata++;
        }
        return hata / NOKTALAR.length;
    }

    function guncelle() {
        for (const p of NOKTALAR) {
            const skor = w1 * p.x + w2 * p.y + bias;
            const pred = skor > 0 ? 1 : 0;
            if (pred !== p.sinif) {
                // Perceptron kuralı: yanlış sınıflandırılan noktaya doğru düzelt
                const yon = p.sinif === 1 ? 1 : -1;
                w1 += lr * yon * p.x;
                w2 += lr * yon * p.y;
                bias += lr * yon;
            }
        }
        kayipGecmisi.push(hesaplaKayip());
        epoch++;
    }

    const ACCENT = VizHelpers.accentRenk();

    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);

        const solW = w * 0.48, sagX = w * 0.55, sagW = w * 0.42;
        const pad = { t: 30, b: 30, l: 40 };

        // === Sol: Kayıp eğrisi ===
        const gh1 = h - pad.t - pad.b - 20;
        VizHelpers.ortaYazi(ctx, "Kayıp (Hata Oranı)", solW / 2, 15, VizHelpers.accent2(), 11, true);

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(30, pad.t); ctx.lineTo(30, pad.t + gh1); ctx.lineTo(solW - 10, pad.t + gh1);
        ctx.stroke();

        for (let i = 0; i <= 4; i++) {
            const v = 0.5 - (i / 4) * 0.5;
            const py = pad.t + (i / 4) * gh1;
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.beginPath(); ctx.moveTo(30, py); ctx.lineTo(solW - 10, py); ctx.stroke();
            ctx.fillStyle = "#555"; ctx.font = "9px Inter"; ctx.textAlign = "right";
            ctx.fillText((v * 100).toFixed(0) + "%", 28, py + 3);
        }

        if (kayipGecmisi.length > 1) {
            ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
            ctx.beginPath();
            kayipGecmisi.forEach((k, i) => {
                const px = 30 + (i / MAX_EPOCH) * (solW - 40);
                const py = pad.t + (1 - k / 0.5) * gh1 * 0.9 + gh1 * 0.05;
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.stroke();
        }

        ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "center";
        ctx.fillText("Epoch →", solW / 2, h - 8);

        // === Sağ: Karar sınırı ===
        VizHelpers.ortaYazi(ctx, `Model Karar Sınırı (Epoch ${epoch})`, sagX + sagW / 2, 15, VizHelpers.accent2(), 11, true);
        const gx = sagX + 10, gy = pad.t, gw = sagW - 20, gh2 = gy + gh1;

        // Karar sınırı: w1*x + w2*y + b = 0 doğrusu → y = -(w1*x+b)/w2
        ctx.fillStyle = "rgba(86,166,5,0.04)";
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath(); ctx.roundRect(gx, gy, gw, gh1, 4); ctx.fill(); ctx.stroke();

        if (Math.abs(w2) > 0.001) {
            const sx1 = 0, sy1 = -(bias + w1 * sx1) / w2;
            const sx2 = 1, sy2 = -(bias + w1 * sx2) / w2;
            ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(gx + sx1 * gw, gy + (1 - sy1) * gh1);
            ctx.lineTo(gx + sx2 * gw, gy + (1 - sy2) * gh1);
            ctx.stroke();
        }

        // Noktalar (sınıf renkleri)
        for (const p of NOKTALAR) {
            const px = gx + p.x * gw;
            const py = gy + (1 - p.y) * gh1;
            const skor = w1 * p.x + w2 * p.y + bias;
            const dogru = (skor > 0 ? 1 : 0) === p.sinif;
            ctx.fillStyle = p.sinif === 0
                ? (dogru ? "#3b82f6" : "#ef4444")
                : (dogru ? "#56a605" : "#ef4444");
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fill();
            if (!dogru) {
                ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.stroke();
            }
        }

        // Lejant
        ctx.fillStyle = "#3b82f6"; ctx.beginPath(); ctx.arc(gx + 10, h - 20, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "left";
        ctx.fillText("Sınıf 0", gx + 20, h - 16);
        ctx.fillStyle = ACCENT; ctx.beginPath(); ctx.arc(gx + 75, h - 20, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#9aa0b4";
        ctx.fillText("Sınıf 1", gx + 85, h - 16);
        ctx.fillStyle = "#9aa0b4";
        ctx.fillText(`w1=${w1.toFixed(2)}  w2=${w2.toFixed(2)}  b=${bias.toFixed(2)}`, gx + 140, h - 16);

        // Durum bilgisi
        const sonKayip = kayipGecmisi[kayipGecmisi.length - 1];
        if (sonKayip !== undefined) {
            const mesaj = sonKayip < 0.02
                ? "✓ Model öğrendi — ayrım başarılı!"
                : `Öğreniyor... hata oranı: %${(sonKayip * 100).toFixed(0)} (epoch ${epoch})`;
            ctx.fillStyle = sonKayip < 0.02 ? ACCENT : "#9aa0b4";
            ctx.font = "11px Inter"; ctx.textAlign = "center";
            ctx.fillText(mesaj, w / 2, h - 30);
        }
    }

    // Butonlar
    const mount = document.getElementById("viz-egitim-sim");
    const btnKutu = document.createElement("div");
    btnKutu.style.cssText = "display:flex;gap:0.5rem;justify-content:center;margin-top:0.6rem";
    const durdurBtn = VizHelpers._btn("⏸ Durdur");
    const resetBtn = VizHelpers._btn("↺ Sıfırla");
    btnKutu.append(durdurBtn, resetBtn);
    mount.parentElement.appendChild(btnKutu);

    durdurBtn.onclick = () => {
        calisiyor = !calisiyor;
        durdurBtn.textContent = calisiyor ? "⏸ Durdur" : "▶ Devam";
        if (calisiyor) dongu();
    };
    resetBtn.onclick = () => {
        calisiyor = false;
        w1 = -0.5; w2 = 0.3; bias = 0.1; epoch = 0;
        kayipGecmisi.length = 0;
        durdurBtn.textContent = "▶ Devam";
        ciz();
        calisiyor = true; dongu();
    };

    function dongu() {
        if (!calisiyor || epoch >= MAX_EPOCH) return;
        guncelle();
        ciz();
        animId = requestAnimationFrame(dongu);
    }
    ciz();
    dongu();
};
