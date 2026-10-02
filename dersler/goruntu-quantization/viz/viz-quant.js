// Görüntü Quantization — Kalite-hız dengesi grafiği
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-viz-quant"] = function () {
    const hv = VizHelpers.canvas2D("viz-quant", 0.55);
    if (!hv) return;
    const { ctx } = hv;

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    // Her format noktası (İLLÜSTRATİF değerler; gerçek ölçüm değildir):
    // {ad, hiz (göreli), kalite (SSIM y), boyut, renk}
    const NOKTALAR = [
        { ad: "FP32", hiz: 0.15, kalite: 0.99, boyut: "4.0 GB", renk: "#64748b" },
        { ad: "FP16", hiz: 0.35, kalite: 0.985, boyut: "2.0 GB", renk: "#3b82f6" },
        { ad: "INT8", hiz: 0.65, kalite: 0.96, boyut: "1.0 GB", renk: ACCENT },
        { ad: "INT4*", hiz: 0.88, kalite: 0.88, boyut: "0.5 GB", renk: "#f59e0b" },
    ];
    // *INT4: naif PTQ kaliteyi bozar; SVDQuant gibi yöntemlerle korunabilir

    let t = 0;

    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        t += 0.01;

        VizHelpers.ortaYazi(ctx, "Görüntü Modeli Quantization: Hız vs Kalite", w / 2, 18, ACCENT2, 13, true);

        const pad = { l: 55, r: 20, t: 45, b: 60 };
        const gw = w - pad.l - pad.r, gh = h - pad.t - pad.b;
        const xMin = 0, xMax = 1, yMin = 0.82, yMax = 1.0;
        const sx = v => pad.l + ((v - xMin) / (xMax - xMin)) * gw;
        const sy = v => pad.t + gh - ((v - yMin) / (yMax - yMin)) * gh;

        // Eksenler
        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gh); ctx.lineTo(pad.l + gw, pad.t + gh); ctx.stroke();

        // Izgara
        for (let i = 0; i <= 4; i++) {
            const vy = yMin + (yMax - yMin) * i / 4;
            ctx.strokeStyle = "rgba(255,255,255,0.04)";
            ctx.beginPath(); ctx.moveTo(pad.l, sy(vy)); ctx.lineTo(pad.l + gw, sy(vy)); ctx.stroke();
            ctx.fillStyle = "#555"; ctx.font = "10px Inter"; ctx.textAlign = "right";
            ctx.fillText(vy.toFixed(2), pad.l - 6, sy(vy) + 3);
        }

        // "Tatlı bölge" dikdörtgeni
        const dsX = sx(0.45), dsY = sy(1.0), dsW = sx(0.95) - dsX, dsH = pad.t + gh - dsY - 30;
        ctx.fillStyle = "rgba(86,166,5,0.05)";
        ctx.fillRect(dsX, dsY, dsW, dsH);
        ctx.strokeStyle = ACCENT + "44"; ctx.setLineDash([4, 4]);
        ctx.strokeRect(dsX, dsY, dsW, dsH);
        ctx.setLineDash([]);
        VizHelpers.ortaYazi(ctx, "✨ Tatlı Bölge", dsX + dsW / 2, dsY + 5, ACCENT, 10, true);

        // Bağlantı çizgisi (trend)
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        NOKTALAR.forEach((n, i) => {
            const X = sx(n.hiz), Y = sy(n.kalite);
            i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
        });
        ctx.stroke(); ctx.setLineDash([]);

        // Noktalar (animasyonlu büyüme)
        NOKTALAR.forEach((n, i) => {
            const px = sx(n.hiz), py = sy(n.kalite);
            const r = 14 + Math.sin(t * 2 + i) * 2;
            ctx.fillStyle = n.renk + "33"; ctx.strokeStyle = n.renk; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = n.renk; ctx.font = "bold 11px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(n.ad, px, py);
            ctx.fillStyle = "#9aa0b4"; ctx.font = "9.5px Inter";
            ctx.fillText(n.boyut, px, py + r + 10);
        });

        // Eksen etiketleri (döndürülmüş — canvas içinde sığar)
        ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter"; ctx.textAlign = "center";
        ctx.fillText("Göreli hız →", pad.l + gw / 2, h - 18);
        ctx.save();
        ctx.translate(16, pad.t + gh / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillText("Kalite (SSIM) →", 0, 0); ctx.restore();

        // Not — uzun metin HTML olarak sarılır
        VizHelpers.altYazi("viz-quant",
            "*INT4: naif PTQ kaliteyi bozar — SVDQuant gibi yöntemlerle korunabilir. Değerler illüstratiftir.");
    }

    hv.setPaint(ciz);
    ciz();
    setInterval(ciz, 80);
};
