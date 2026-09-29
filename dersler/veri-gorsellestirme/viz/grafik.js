// Veri Görselleştirme — Canlı grafik türleri
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-grafik"] = function () {
    const hv = VizHelpers.canvas2D("viz-grafik", 0.55);
    if (!hv) return;
    const { ctx } = hv;

    // Örnek veri: model eğitim eğrileri (overfitting senaryosu)
    const epochs = Array.from({length: 20}, (_, i) => i + 1);
    const trainLoss = epochs.map(e => 1.5 * Math.exp(-e / 4) + 0.05 + Math.random() * 0.03);
    const valLoss = epochs.map((e, i) => {
        const min = 1.5 * Math.exp(-e / 6) + 0.1;
        return e > 8 ? min + (e - 8) * 0.055 : min;  // Overfitting: val kaybı geri yükseliyor
    });
    const trainAcc = epochs.map(e => 1 - 0.9 * Math.exp(-e / 4));
    const valAcc = epochs.map((e) => {
        const base = 1 - 0.85 * Math.exp(-e / 6);
        return e > 8 ? Math.max(0.5, base - (e - 8) * 0.015) : base;
    });

    const ADIMLAR = [
        { baslik: "Çizgi Grafiği: Eğitim Kaybı", aciklama: "Model öğrendikçe kayıp (hata) düşer. Ama dikkat: doğrulama kaybı 8. epoch'tan sonra YÜKSELİYOR — bu overfitting!" },
        { baslik: "Çizgi Grafiği: Doğruluk", aciklama: "Eğitim doğruluk yükselirken doğrulama doğruluğu düşüyor → model ezberliyor, genelleme yapamıyor." },
        { baslik: "Isı Haritası: Karışıklık Matrisi", aciklama: "Satır=gerçek sınıf, sütun=tahmin. Diyagonal (köşegen) koyu ise model iyi. Diyagonal dışındaki koyuluklar → hangi sınıflar karışıyor." }
    ];

    const conf = [[45, 3, 2], [2, 38, 5], [1, 2, 42]];
    const labels = ["Kedi", "Köpek", "Kuş"];
    const ACCENT = VizHelpers.accentRenk();

    function grafikCiz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        VizHelpers.ortaYazi(ctx, ADIMLAR[adim].baslik, w / 2, 20, ACCENT, 13, true);

        if (adim < 2) {
            // Çizgi grafiği
            const pad = { l: 50, r: 20, t: 45, b: 40 };
            const gw = w - pad.l - pad.r;
            const gh = h - pad.t - pad.b - 40;
            const vals = adim === 0 ? [trainLoss, valLoss] : [trainAcc, valAcc];
            const renkler = [ACCENT, "#f59e0b"];
            const etiketler = adim === 0 ? ["Eğitim", "Doğrulama"] : ["Eğitim", "Doğrulama"];
            const yMin = adim === 0 ? 0 : 0.4;
            const yMax = adim === 0 ? 1.6 : 1.0;

            // Eksenler
            ctx.strokeStyle = "rgba(255,255,255,0.2)";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gh); ctx.lineTo(pad.l + gw, pad.t + gh); ctx.stroke();

            // Kılavuz çizgileri
            for (let i = 0; i <= 4; i++) {
                const v = yMin + (yMax - yMin) * i / 4;
                const py = pad.t + gh - (i / 4) * gh;
                ctx.strokeStyle = "rgba(255,255,255,0.05)";
                ctx.beginPath(); ctx.moveTo(pad.l, py); ctx.lineTo(pad.l + gw, py); ctx.stroke();
                ctx.fillStyle = "#666"; ctx.font = "10px Inter";
                ctx.textAlign = "right";
                ctx.fillText(v.toFixed(1), pad.l - 5, py + 4);
            }

            // Çizgiler
            vals.forEach((dizi, di) => {
                ctx.strokeStyle = renkler[di];
                ctx.lineWidth = 2;
                ctx.beginPath();
                dizi.forEach((v, i) => {
                    const px = pad.l + (i / (dizi.length - 1)) * gw;
                    const py = pad.t + gh - ((v - yMin) / (yMax - yMin)) * gh;
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                });
                ctx.stroke();

                // Nokta işaretleri
                dizi.forEach((v, i) => {
                    if (i % 4 !== 0) return;
                    const px = pad.l + (i / (dizi.length - 1)) * gw;
                    const py = pad.t + gh - ((v - yMin) / (yMax - yMin)) * gh;
                    ctx.fillStyle = renkler[di];
                    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
                });
            });

            // Overfitting noktası işareti (epoch 8)
            if (adim === 0) {
                const px = pad.l + (7 / 19) * gw;
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath(); ctx.moveTo(px, pad.t); ctx.lineTo(px, pad.t + gh); ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = "#ef4444"; ctx.font = "10px Inter";
                ctx.textAlign = "left";
                ctx.fillText("⚠ Overfitting başlıyor", px + 4, pad.t + 14);
            }

            // Lejant
            etiketler.forEach((e, i) => {
                const lx = pad.l + 20 + i * 90;
                ctx.strokeStyle = renkler[i]; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(lx, h - 30); ctx.lineTo(lx + 18, h - 30); ctx.stroke();
                ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter";
                ctx.textAlign = "left";
                ctx.fillText(e, lx + 22, h - 26);
            });

            ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "center";
            ctx.fillText("Epoch", pad.l + gw / 2, h - 12);

        } else {
            // Isı haritası (confusion matrix)
            const cellSize = Math.min(70, (w - 120) / 3);
            const startX = (w - cellSize * 3) / 2;
            const startY = 55;
            const maxVal = 50;

            // Sütun etiketleri (tahmin)
            labels.forEach((l, j) => {
                VizHelpers.ortaYazi(ctx, l, startX + j * cellSize + cellSize / 2, startY - 10, "#9aa0b4", 11);
            });
            // Satır etiketleri (gerçek)
            labels.forEach((l, i) => {
                ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter";
                ctx.textAlign = "right";
                ctx.fillText(l, startX - 8, startY + i * cellSize + cellSize / 2 + 4);
            });

            // Hücreler
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const val = conf[i][j];
                    const oran = val / maxVal;
                    const diagonal = i === j;
                    const r = diagonal ? 86 : 239, g = diagonal ? 166 : 68, b2 = diagonal ? 5 : 68;
                    ctx.fillStyle = `rgba(${r},${g},${b2},${0.15 + oran * 0.85})`;
                    ctx.strokeStyle = diagonal ? ACCENT : "rgba(255,255,255,0.1)";
                    ctx.lineWidth = diagonal ? 2 : 1;
                    const cx = startX + j * cellSize, cy = startY + i * cellSize;
                    ctx.beginPath(); ctx.roundRect(cx + 2, cy + 2, cellSize - 4, cellSize - 4, 6); ctx.fill(); ctx.stroke();
                    VizHelpers.ortaYazi(ctx, String(val), cx + cellSize / 2, cy + cellSize / 2, oran > 0.4 ? "#fff" : "#9aa0b4", 14, val > 20);
                }
            }

            // Açıklama notları
            ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter"; ctx.textAlign = "center";
            ctx.fillText("← Gerçek sınıf (satır) vs Tahmin sınıfı (sütun) →", w / 2, startY + cellSize * 3 + 22);
        }

        // Alt açıklama
        ctx.font = "12px Inter, sans-serif";
        ctx.fillStyle = "#9aa0b4"; ctx.textAlign = "center";
        const words = ADIMLAR[adim].aciklama.split(" ");
        let line = "", ly = h - 8;
        const lines = [];
        for (const word of words) {
            const test = line ? line + " " + word : word;
            if (ctx.measureText(test).width > w - 40) { lines.push(line); line = word; } else line = test;
        }
        if (line) lines.push(line);
        lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, w / 2, ly - (lines.length - 1 - i + Math.max(0, lines.length - 2)) * 15));
    }

    VizHelpers.adimKontrol("viz-grafik", ADIMLAR.length, grafikCiz);
};
