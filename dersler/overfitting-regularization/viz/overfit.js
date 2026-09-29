// Overfitting görselleştirmesi — 3 senaryo yan yana
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-overfit"] = function () {
    const hv = VizHelpers.canvas2D("viz-overfit", 0.5);
    if (!hv) return;
    const { ctx } = hv;

    // Aynı veri seti, 3 farklı model karmaşıklığı
    const veri = [];
    const sr = (seed => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; })(99);
    for (let i = 0; i < 28; i++) {
        const x = 0.03 + (i / 27) * 0.94;
        const y = 0.45 + Math.sin(x * Math.PI * 1.8) * 0.22 + (sr() - 0.5) * 0.12;
        veri.push({ x, y: Math.max(0.05, Math.min(0.95, y)) });
    }

    const MODELLER = [
        {
            ad: "Underfitting",
            aciklama: "Çok basit model: doğrusal çizgi, veriyi öğrenemez. Train+Test'te kötü.",
            renk: "#ef4444",
            cizgi: (x) => 0.45 + (x - 0.5) * 0.05   // Neredeyse yatay
        },
        {
            ad: "İyi Öğrenme ✓",
            aciklama: "Doğru karmaşıklık: verinin genel örüntüsünü yakalar, gürültüyü görmezden gelir.",
            renk: "#56a605",
            cizgi: (x) => 0.45 + Math.sin(x * Math.PI * 1.8) * 0.22   // Gerçek fonksiyon
        },
        {
            ad: "Overfitting",
            aciklama: "Çok karmaşık model: her gürültü noktasını da öğrenir — zigzag yapar. Test'te başarısız.",
            renk: "#f59e0b",
            cizgi: null   // Her noktadan geçen interpolasyon (çizilirken özel)
        }
    ];

    let secilen = 1;  // Doğru öğrenme örnek olarak göster

    function ciz(adim) {
        secilen = adim;
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const m = MODELLER[adim];

        VizHelpers.ortaYazi(ctx, m.ad, w / 2, 18, m.renk, 15, true);
        VizHelpers.ortaYazi(ctx, m.aciklama, w / 2, 40, "#9aa0b4", 12);

        const pad = { l: 40, r: 20, t: 60, b: 40 };
        const gw = w - pad.l - pad.r, gh = h - pad.t - pad.b;
        const px = x => pad.l + x * gw;
        const py = y => pad.t + (1 - y) * gh;

        // Eksen arka planı
        ctx.fillStyle = "rgba(255,255,255,0.02)";
        ctx.beginPath(); ctx.roundRect(pad.l, pad.t, gw, gh, 6); ctx.fill();

        // Eksenler
        ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gh); ctx.lineTo(pad.l + gw, pad.t + gh); ctx.stroke();

        // Model çizgisi
        ctx.strokeStyle = m.renk; ctx.lineWidth = 2.5;
        ctx.beginPath();
        if (adim === 2) {
            // Overfitting: her noktadan geçen zigzag
            veri.forEach((p, i) => {
                const sx = px(p.x), sy = py(p.y);
                if (i === 0) ctx.moveTo(sx, sy);
                else if (i === veri.length - 1) ctx.lineTo(sx, sy);
                else {
                    const prev = veri[i - 1];
                    ctx.quadraticCurveTo(px(prev.x), py(prev.y), sx, sy);
                }
            });
        } else {
            for (let t = 0; t <= 100; t++) {
                const x = t / 100;
                const y = m.cizgi(x);
                const sx = px(x), sy = py(Math.max(0.02, Math.min(0.98, y)));
                t === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
            }
        }
        ctx.stroke();

        // Veri noktaları
        veri.forEach(p => {
            ctx.fillStyle = ACCENT || "#56a605";
            ctx.beginPath(); ctx.arc(px(p.x), py(p.y), 4, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(px(p.x), py(p.y), 4, 0, Math.PI * 2); ctx.stroke();
        });

        const ACCENT = VizHelpers.accentRenk();
        // Legent
        ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "left";
        ctx.fillText("─ Model", pad.l + 5, pad.t + 12);
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.arc(w - 90, pad.t + 8, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#9aa0b4";
        ctx.fillText("●  Eğitim verisi", w - 85, pad.t + 12);
    }

    VizHelpers.adimKontrol("viz-overfit", MODELLER.length, ciz);
};
