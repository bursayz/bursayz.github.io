// LoRA & QLoRA — Matris ayrışımı animasyonu (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-lora"] = function () {
    const hv = VizHelpers.canvas2D("viz-lora", 0.55);
    if (!hv) return;
    const { ctx } = hv;

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    const ADIMLAR = [
        {
            baslik: "Tam Fine-Tuning: Dev Matrisi Eğit",
            aciklama: "W (4096×4096): her hücre ayrı parametre. 16.7M parametre, ~80GB VRAM gerekir. Sadece dev şirketler yapabilir."
        },
        {
            baslik: "LoRA İçgörüsü: ΔW Düşük Ranklıdır",
            aciklama: "Değişim matrisi ΔW aslında 'düşük ranklı' — 4096 boyut yerine sadece 16 boyutta yaşar. Bunu kullanırsak..."
        },
        {
            baslik: "LoRA Çözümü: ΔW = A × B",
            aciklama: "A: (4096×16), B: (16×4096) → toplam 131K parametre. W donuk, sadece A ve B eğitilir. %99.2 daha az parametre, neredeyse aynı performans!"
        }
    ];

    function dikdortgen(x, y, w, h, renk, label, alt, op = 0.08) {
        ctx.fillStyle = renk + "22";
        ctx.strokeStyle = renk;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#e8eaf0";
        ctx.font = "bold 13px Inter";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(label, x + w / 2, y + h / 2 - (alt ? 8 : 0));
        if (alt) {
            ctx.fillStyle = renk;
            ctx.font = "10px Inter";
            ctx.fillText(alt, x + w / 2, y + h / 2 + 10);
        }
    }

    function ok(x1, y1, x2, y2, renk) {
        ctx.strokeStyle = renk; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        const a = Math.atan2(y2 - y1, x2 - x1);
        ctx.fillStyle = renk;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 8 * Math.cos(a - 0.4), y2 - 8 * Math.sin(a - 0.4));
        ctx.lineTo(x2 - 8 * Math.cos(a + 0.4), y2 - 8 * Math.sin(a + 0.4));
        ctx.closePath(); ctx.fill();
    }

    function ciz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const A = ADIMLAR[adim];
        VizHelpers.ortaYazi(ctx, A.baslik, w / 2, 20, ACCENT2, 14, true);

        const cy = h * 0.42;

        if (adim === 0) {
            // Dev W matrisi
            const mw = Math.min(180, w * 0.35), mh = 140;
            const mx = w / 2 - mw / 2;
            dikdortgen(mx, cy - mh / 2, mw, mh, ACCENT, "W", "4096 × 4096");
            // Parametre taraması animasyonu
            const t = (Date.now() / 600) % 1;
            const scanY = cy - mh / 2 + t * mh;
            ctx.fillStyle = "rgba(168,85,247,0.25)";
            ctx.fillRect(mx, scanY, mw, 4);
            VizHelpers.ortaYazi(ctx, "16.7M parametre — hepsi eğitilmeli", w / 2, cy + mh / 2 + 28, "#ef4444", 12, true);
            VizHelpers.ortaYazi(ctx, "~80 GB VRAM gerekir (gradyan + optimizer)", w / 2, cy + mh / 2 + 46, "#9aa0b4", 11);
        } else if (adim === 1) {
            // W büyük, ΔW küçük, rank işareti
            const mw = Math.min(150, w * 0.28), mh = 120;
            dikdortgen(w * 0.18, cy - mh / 2, mw, mh, "#64748b", "W (donuk)", "4096×4096");
            dikdortgen(w * 0.55, cy - mh / 2 + 20, mw * 0.55, mh * 0.55, "#f59e0b", "ΔW", "düşük rank!");
            ok(w * 0.18 + mw + 10, cy, w * 0.55 - 8, cy, "#f59e0b");
            VizHelpers.ortaYazi(ctx, "Araştırma bulgusu: eğitimdeki değişim", w / 2, cy + mh / 2 + 30, "#9aa0b4", 12);
            VizHelpers.ortaYazi(ctx, "düşük boyutlu bir alt uzayda yaşar (rank ≪ 4096)", w / 2, cy + mh / 2 + 48, "#f59e0b", 12, true);
        } else {
            // W + A×B
            const mw = Math.min(130, w * 0.22);
            dikdortgen(w * 0.06, cy - 60, mw, 120, "#64748b", "W", "donuk 4096²");
            VizHelpers.ortaYazi(ctx, "+", w * 0.06 + mw + 22, cy, ACCENT2, 28, true);
            dikdortgen(w * 0.30, cy - 60, mw * 0.62, 120, ACCENT, "A", "4096 × r");
            VizHelpers.ortaYazi(ctx, "×", w * 0.30 + mw * 0.62 + 18, cy, ACCENT2, 24, true);
            dikdortgen(w * 0.49, cy - 30, mw * 0.62, 30, "#f59e0b", "B", "r × 4096");
            const eqX = w * 0.78;
            VizHelpers.ortaYazi(ctx, "=", eqX - 24, cy, ACCENT2, 28, true);
            dikdortgen(eqX, cy - 60, mw * 0.9, 120, "#22c55e", "y = Wx + BAx", "çıktı");
            VizHelpers.ortaYazi(ctx, `r = 16: toplam 2×4096×16 = 131K parametre`, w / 2, cy + 95, ACCENT2, 12, true);
            VizHelpers.ortaYazi(ctx, "Sadece A ve B eğitilir — W donuk kalır!", w / 2, cy + 114, "#9aa0b4", 11);
        }

        // Açıklama
        ctx.fillStyle = "#9aa0b4"; ctx.font = "12px Inter"; ctx.textAlign = "center";
        const words = A.aciklama.split(" ");
        let line = "", lines = [];
        for (const word of words) {
            const t = line ? line + " " + word : word;
            if (ctx.measureText(t).width > w - 60) { lines.push(line); line = word; } else line = t;
        }
        lines.push(line);
        lines.forEach((l, i) => ctx.fillText(l, w / 2, h - 30 + i * 17 - (lines.length - 1) * 17));
    }

    VizHelpers.adimKontrol("viz-lora", ADIMLAR.length, ciz);
    // Adım 0'da animasyon için tick
    setInterval(() => {
        const secili = document.querySelector("#viz-lora")?.closest(".viz-kutu")?.querySelector("span")?.textContent;
        if (secili && secili.includes("1/3")) ciz(0);
    }, 120);
};
