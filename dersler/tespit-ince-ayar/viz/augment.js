// Tespit İnce Ayarı — Augmentation galerisi
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-augment"] = function () {
    const hv = VizHelpers.canvas2D("viz-augment", 0.52);
    if (!hv) return;
    const { ctx } = hv;
    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    // Örnek nesne: basit dikdörtgen kedi kutusu
    function cizOrnek(x, y, w, h, transform, etiket, renk) {
        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        if (transform.flip) ctx.scale(-1, 1);
        if (transform.rot) ctx.rotate(transform.rot);
        ctx.filter = transform.filter || "none";

        // Zemin
        ctx.fillStyle = renk || "rgba(255,255,255,0.04)";
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Basit kedi figürü: gövde dikdörtgen + kafa daire + kulaklar
        ctx.fillStyle = "#c084fc";
        ctx.beginPath(); ctx.ellipse(0, 10, w * 0.28, h * 0.22, 0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(0, -h * 0.18, w * 0.18, 0, Math.PI * 2); ctx.fill();
        // Kulaklar
        ctx.beginPath();
        ctx.moveTo(-w * 0.13, -h * 0.3); ctx.lineTo(-w * 0.08, -h * 0.36); ctx.lineTo(-w * 0.03, -h * 0.31); ctx.closePath();
        ctx.moveTo(w * 0.03, -h * 0.31); ctx.lineTo(w * 0.08, -h * 0.36); ctx.lineTo(w * 0.13, -h * 0.3); ctx.closePath(); ctx.fill();
        ctx.restore();

        ctx.filter = "none";
        // Bounding box (transform buna da uygulanır)
        const boxX = x + w * 0.15 + (transform.flip ? transform.boxShift || 0 : 0);
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
        ctx.strokeRect(boxX, y + h * 0.25, w * 0.7, h * 0.45);

        ctx.fillStyle = ACCENT2; ctx.font = "bold 11px Inter"; ctx.textAlign = "center";
        ctx.fillText(etiket, x + w / 2, y + h + 16);
    }

    const t0 = Date.now();
    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const t = (Date.now() - t0) / 1000;
        const pulse = Math.sin(t * 1.5) * 0.1;

        VizHelpers.ortaYazi(ctx, "Aynı resmin 4 augmentation varyasyonu", w / 2, 18, ACCENT2, 13, true);

        const bx = w * 0.05, by = 40, bw = w * 0.2, bh = h * 0.42;
        const gap = w * 0.03;

        cizOrnek(bx, by, bw, bh, {}, "Orijinal");
        cizOrnek(bx + bw + gap, by, bw, bh, { flip: true, boxShift: 0 }, "Yatay Çevir");
        cizOrnek(bx + (bw + gap) * 2, by, bw, bh, { rot: 0.15 }, "Döndür (15°)");
        cizOrnek(bx + (bw + gap) * 3, by, bw, bh, { filter: "brightness(1.2)" }, "Parlaklık +Jitter");

        ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter"; ctx.textAlign = "center";
        ctx.fillText("Her varyasyonda bounding box koordinatları da aynı şekilde dönüştürülür — model nesneyi her açıdan/koşulda tanır.", w / 2, by + bh + 42);
        ctx.fillText("(flip, rotation, renk jitter, mosaic, copy-paste — hepsi tespit veri setine uygulanır)", w / 2, by + bh + 60);
    }

    ciz();
    setInterval(ciz, 100);
};
