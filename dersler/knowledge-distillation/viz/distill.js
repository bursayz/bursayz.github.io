// Knowledge Distillation — Öğretmen→Öğrenci bilgi akışı (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-distill"] = function () {
    const hv = VizHelpers.canvas2D("viz-distill", 0.55);
    if (!hv) return;
    const { ctx } = hv;
    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    const SINIFLAR = ["kedi", "köpek", "tilki", "kuş", "balık"];
    const ogretmenDagilim = [0.30, 0.24, 0.10, 0.12, 0.14]; // yumuşatılmış (T=4)
    const sertEtiket =      [1.00, 0.00, 0.00, 0.00, 0.00];

    // Öğrencinin dağılımı animasyonla öğretmene yaklaşır
    let ogrenci = [0.2, 0.2, 0.2, 0.2, 0.2]; // başlangıç: uniform
    const hedef = ogretmenDagilim;

    let t = 0;
    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        t += 0.01;

        VizHelpers.ortaYazi(ctx, "Dağılım Öğrenimi: Öğrenci, Öğretmenin Yumuşak Hedeflerine Yaklaşır", w / 2, 18, ACCENT2, 12.5, true);

        const grupW = (w - 60) / 3;
        const padT = 40, barMaxH = h - 130;

        // Öğrenme animasyonu
        ogrenci = ogrenci.map((v, i) => v + (hedef[i] - v) * 0.02);

        const gruplar = [
            { ad: "Sert Etiket", renk: "#64748b", data: sertEtiket, not: "(1,0,0,0,0) — benzerlik bilgisi yok" },
            { ad: "Öğretmen (T=4)", renk: ACCENT, data: ogretmenDagilim, not: "Yumuşak dağılım — sınıf ilişkileri taşır" },
            { ad: "Öğrenci (öğreniyor)", renk: "#3b82f6", data: ogrenci, not: "KL kaybı iki dağılımı yaklaştırır" }
        ];

        gruplar.forEach((g, gi) => {
            const gx = 30 + gi * grupW;
            VizHelpers.ortaYazi(ctx, g.ad, gx + grupW / 2 - 10, padT, g.renk, 12, true);

            const barW = Math.min(34, (grupW - 40) / SINIFLAR.length);
            SINIFLAR.forEach((s, i) => {
                const v = Math.max(0.01, g.data[i]);
                const bx = gx + 20 + i * barW;
                const bh = v * barMaxH * 1.6;
                const by = padT + 20 + barMaxH - bh;
                ctx.fillStyle = g.renk + (i === 0 ? "" : "88");
                ctx.beginPath(); ctx.roundRect(bx, by, barW - 8, bh, 4); ctx.fill();
                ctx.fillStyle = "#9aa0b4"; ctx.font = "9.5px Inter"; ctx.textAlign = "center";
                ctx.fillText(s, bx + (barW - 8) / 2, padT + 20 + barMaxH + 14);
                ctx.fillStyle = g.renk; ctx.font = "9px 'JetBrains Mono', monospace";
                ctx.fillText("%" + (v * 100).toFixed(0), bx + (barW - 8) / 2, by - 7);
            });

            ctx.fillStyle = "#666"; ctx.font = "9.5px Inter"; ctx.textAlign = "center";
            ctx.fillText(g.not, gx + grupW / 2 - 10, padT + 20 + barMaxH + 34);
        });

        // KL divergence göstergesi
        const kl = ogrenci.reduce((s, p, i) => s + hedef[i] * Math.log(hedef[i] / Math.max(p, 1e-9)), 0);
        const mesafe = Math.max(0, kl);
        ctx.fillStyle = "#9aa0b4"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
        ctx.fillText(`KL(öğretmen || öğrenci) = ${mesafe.toFixed(4)} ${mesafe < 0.01 ? "✓ yakınsadı!" : "— azalırken..."}`, w / 2, h - 14);

        requestAnimationFrame(ciz);
    }
    ciz();
};
