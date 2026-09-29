// GPT Sıfırdan — Autoregressive metin üretim simülasyonu (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-metin-uretim"] = function () {
    const hv = VizHelpers.canvas2D("viz-metin-uretim", 0.6);
    if (!hv) return;
    const { ctx } = hv;

    const PROMPT = "Bursa'da yapay zeka";
    // Her adımın olasılık dağılımı (top-4 aday, simüle edilmiş)
    const ADIMLAR = [
        { adaylar: [["topluluğu", 0.42], ["eğitimi", 0.31], ["modeli", 0.15], ["dersleri", 0.12]], secilen: 0 },
        { adaylar: [["öğrencileri", 0.45], ["üyeleri", 0.28], ["geliştiricileri", 0.18], ["ekibi", 0.09]], secilen: 0 },
        { adaylar: [["kendi", 0.51], ["ilk", 0.22], ["yeni", 0.17], ["küçük", 0.10]], secilen: 0 },
        { adaylar: [["modellerini", 0.48], ["projelerini", 0.25], ["uygulamalarını", 0.16], ["sistemlerini", 0.11]], secilen: 0 },
        { adaylar: [["eğitiyor", 0.38], ["geliştiriyor", 0.33], ["paylaşıyor", 0.18], ["test ediyor", 0.11]], secilen: 0 },
        { adaylar: [["ve", 0.62], ["ile", 0.21], ["için", 0.10], ["ama", 0.07]], secilen: 0 },
        { adaylar: [["öğreniyor", 0.35], ["üretiyor", 0.30], ["deniyor", 0.20], ["yayınlıyor", 0.15]], secilen: 0 },
    ];

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    let uretilenTokenlar = [];

    function ciz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const A = ADIMLAR[Math.min(adim, ADIMLAR.length - 1)];
        uretilenTokenlar = ADIMLAR.slice(0, adim + 1).map(a => a.adaylar[a.secilen][0]);

        // Başlık
        VizHelpers.ortaYazi(ctx, `Adım ${adim + 1}: Bir sonraki token tahmini`, w / 2, 20, ACCENT2, 14, true);

        // Bağlam (şimdiye kadar üretilenler)
        const ctxY = 55;
        ctx.font = "13px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "#9aa0b4";
        ctx.fillText("Bağlam:", 16, ctxY);

        let cx = 16, cy = ctxY + 26;
        ctx.font = "12px 'JetBrains Mono', monospace";
        [...PROMPT.split(" "), ...uretilenTokenlar].forEach(tok => {
            const tw = ctx.measureText(" " + tok).width + 8;
            if (cx + tw > w - 16) { cx = 16; cy += 24; }
            ctx.fillStyle = "#2a2f45";
            ctx.beginPath(); ctx.roundRect(cx, cy - 14, tw, 20, 5); ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.stroke();
            ctx.fillStyle = "#cbd0dd";
            ctx.fillText(" " + tok, cx + 4, cy);
            cx += tw + 4;
        });

        // Olasılık dağılımı (yatay bar)
        const barY0 = cy + 45;
        const barMaxW = w - 160;
        VizHelpers.ortaYazi(ctx, "Modelin olasılık dağılımı (softmax çıktısı):", 100, barY0 - 12, "#9aa0b4", 11);
        ctx.textAlign = "left";

        A.adaylar.forEach(([tok, p], i) => {
            const by = barY0 + i * 32;
            const bw = p * barMaxW * 1.8;
            const secilmis = i === A.secilen;
            // Bar
            ctx.fillStyle = secilmis ? ACCENT + "cc" : "rgba(255,255,255,0.08)";
            ctx.beginPath(); ctx.roundRect(16, by, bw, 22, 5); ctx.fill();
            // Token adı
            ctx.fillStyle = secilmis ? "#0b0d14" : "#cbd0dd";
            ctx.font = "bold 12px 'JetBrains Mono', monospace";
            ctx.fillText(tok, 22, by + 15);
            // Yüzde
            ctx.fillStyle = secilmis ? ACCENT2 : "#666";
            ctx.font = "12px 'JetBrains Mono', monospace";
            ctx.fillText("%" + (p * 100).toFixed(0), 22 + bw + 8, by + 15);
        });

        // Seçim açıklaması
        const ay = barY0 + A.adaylar.length * 32 + 16;
        ctx.font = "12px Inter, sans-serif";
        ctx.fillStyle = "#9aa0b4";
        const exp = `🎲 Örnekleme (multinomial): '%${(A.adaylar[A.secilen][1] * 100).toFixed(0)}' olasılıklı '${A.adaylar[A.secilen][0]}' seçildi → bağlama eklendi → tekrar ileri geçiş.`;
        const words = exp.split(" ");
        let line = "", lines = [];
        for (const word of words) {
            const t = line ? line + " " + word : word;
            if (ctx.measureText(t).width > w - 40) { lines.push(line); line = word; } else line = t;
        }
        lines.push(line);
        lines.forEach((l, i) => ctx.fillText(l, 16, ay + i * 17));
    }

    VizHelpers.adimKontrol("viz-metin-uretim", ADIMLAR.length, ciz);
};
