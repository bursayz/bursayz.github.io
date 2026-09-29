// Makine Öğrenmesi Temelleri — Doğrusal regresyon animasyonu
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-regresyon"] = function () {
    const hv = VizHelpers.canvas2D("viz-regresyon", 0.55);
    if (!hv) return;
    const { ctx } = hv;

    // Sentetik veri: m² → fiyat ilişkisi (gürültülü)
    const noktalar = [];
    const seedRandom = (seed => () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
    })(42);
    for (let i = 0; i < 25; i++) {
        const x = 0.05 + seedRandom() * 0.9;
        const y = 0.1 + x * 0.75 + (seedRandom() - 0.5) * 0.18;
        noktalar.push({ x, y: Math.max(0.02, Math.min(0.95, y)) });
    }

    // Gradyan inişi animasyonu: w ve b zamanla doğru değere yaklaşır
    const FRAME_SAYISI = 60;
    let frame = 0;

    const ACCENT = VizHelpers.accentRenk();
    const anim = { calisiyor: true };

    function hesapla(w0, b0) {
        // Veri için MSE'yi minimize eden w,b (analitik çözüm yerine animasyon için yaklaşım)
        const wBas = 0.2, wBit = 0.75;
        const bBas = 0.4, bBit = 0.1;
        const t = Math.min(1, frame / FRAME_SAYISI);
        // Ease-out
        const e = 1 - Math.pow(1 - t, 3);
        return [wBas + (wBit - wBas) * e, bBas + (bBit - bBas) * e];
    }

    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);

        const pad = { l: 50, r: 20, t: 30, b: 45 };
        const gw = w - pad.l - pad.r;
        const gh = h - pad.t - pad.b;

        const [wNow, bNow] = hesapla();

        // Eksenler
        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gh); ctx.lineTo(pad.l + gw, pad.t + gh); ctx.stroke();

        VizHelpers.ortaYazi(ctx, "Fiyat (M TL)", pad.l - 20, pad.t - 14, "#9aa0b4", 11);
        VizHelpers.ortaYazi(ctx, "Alan (m²)", pad.l + gw / 2, h - 12, "#9aa0b4", 11);

        // Regresyon doğrusu
        const x1 = 0, x2 = 1;
        const y1 = bNow + wNow * x1, y2 = bNow + wNow * x2;

        const px = vx => pad.l + vx * gw;
        const py = vy => pad.t + gh - vy * gh;

        // Hata çizgileri (önce çiz ki doğrunun altında kalsın)
        for (const p of noktalar) {
            const pred = bNow + wNow * p.x;
            ctx.strokeStyle = "rgba(239,68,68,0.25)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px(p.x), py(p.y));
            ctx.lineTo(px(p.x), py(pred));
            ctx.stroke();
        }

        // Veri noktaları
        for (const p of noktalar) {
            ctx.fillStyle = ACCENT;
            ctx.beginPath(); ctx.arc(px(p.x), py(p.y), 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.arc(px(p.x), py(p.y), 4.5, 0, Math.PI * 2); ctx.stroke();
        }

        // Regresyon doğrusu
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(px(x1), py(y1)); ctx.lineTo(px(x2), py(y2)); ctx.stroke();

        // Bilgi paneli
        const mse = noktalar.reduce((s, p) => s + (bNow + wNow * p.x - p.y) ** 2, 0) / noktalar.length;
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";
        ctx.fillStyle = "#f59e0b";
        ctx.fillText(`y = ${wNow.toFixed(2)}x + ${bNow.toFixed(2)}`, pad.l + 5, pad.t - 12);
        ctx.fillStyle = "#9aa0b4";
        ctx.fillText(`MSE Kayıp: ${mse.toFixed(4)} ${frame < FRAME_SAYISI ? "(azalıyor...)" : "(yakınsadı ✓)"}`, pad.l + 5, pad.t + gh + 28);

        // Legent
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.arc(pad.l + gw - 110, pad.t + 12, 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter"; ctx.textAlign = "left";
        ctx.fillText("Gerçek veri", pad.l + gw - 100, pad.t + 16);
        ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pad.l + gw - 110, pad.t + 28); ctx.lineTo(pad.l + gw - 92, pad.t + 28); ctx.stroke();
        ctx.fillStyle = "#9aa0b4";
        ctx.fillText("Model (öğreniyor)", pad.l + gw - 88, pad.t + 32);
    }

    function animasyonDongusu() {
        if (!anim.calisiyor) return;
        ciz();
        if (frame < FRAME_SAYISI) frame++;
        requestAnimationFrame(animasyonDongusu);
    }
    animasyonDongusu();

    // Dokun/tıkla → yeniden başlat
    hv.canvas.addEventListener("click", () => { frame = 0; animasyonDongusu(); });
};
