// Edge/Mobil AI — Cihaz karşılaştırma haritası
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-edge"] = function () {
    const hv = VizHelpers.canvas2D("viz-edge", 0.55);
    if (!hv) return;
    const { ctx } = hv;
    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    const CIHAZLAR = [
        { ad: "Bulut A100", guc: 0.95, tasinabilirlik: 0.05, not: "Güçlü ama uzakta", renk: "#64748b" },
        { ad: "Masaüstü (RTX 4090)", guc: 0.85, tasinabilirlik: 0.25, not: "Güçlü, sabit", renk: "#3b82f6" },
        { ad: "Dizüstü/Apple Silicon", guc: 0.55, tasinabilirlik: 0.6, not: "Denge noktası", renk: "#22d3ee" },
        { ad: "Telefon (NPU)", guc: 0.35, tasinabilirlik: 0.9, not: "Her yerde, sınırlı", renk: ACCENT },
        { ad: "Raspberry Pi / MCU", guc: 0.08, tasinabilirlik: 0.95, not: "TinyML alanı", renk: "#f59e0b" }
    ];

    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);

        const pad = { l: w < 460 ? 46 : 60, r: w < 460 ? 12 : 20, t: 50, b: 55 };
        const gw = w - pad.l - pad.r, gh = h - pad.t - pad.b;

        VizHelpers.ortaYazi(ctx, "Hesaplama Gücü vs Taşınabilirlik Dengesi", w / 2, 20, ACCENT2, 13, true);

        // Eksenler
        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gh); ctx.lineTo(pad.l + gw, pad.t + gh); ctx.stroke();

        // Izgara
        for (let i = 1; i < 5; i++) {
            ctx.strokeStyle = "rgba(255,255,255,0.05)";
            ctx.beginPath(); ctx.moveTo(pad.l + gw * i / 5, pad.t); ctx.lineTo(pad.l + gw * i / 5, pad.t + gh); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pad.l, pad.t + gh * i / 5); ctx.lineTo(pad.l + gw, pad.t + gh * i / 5); ctx.stroke();
        }

        VizHelpers.ortaYazi(ctx, "→ Hesaplama Gücü (TOPS)", pad.l + gw / 2, h - 20, "#9aa0b4", 10.5);
        ctx.save();
        ctx.translate(16, pad.t + gh / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "#9aa0b4"; ctx.font = "10.5px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("→ Taşınabilirlik", 0, 0); ctx.restore();

        // Trend çizgisi (trade-off)
        ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pad.l + 10, pad.t + gh - 10);
        ctx.quadraticCurveTo(pad.l + gw / 2, pad.t + gh / 2, pad.l + gw - 10, pad.t + 10);
        ctx.stroke(); ctx.setLineDash([]);

        // Cihaz noktaları
        CIHAZLAR.forEach((c, i) => {
            const x = pad.l + c.guc * gw;
            const y = pad.t + gh - c.tasinabilirlik * gh;
            ctx.fillStyle = c.renk + "22"; ctx.strokeStyle = c.renk; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = c.renk;
            ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();

            // Etiketler canvas kenarına taşarsa font otomatik küçülür;
            // x kenara yakınsa etiket ortak alana kaydırılır
            const ty = y - 26 > pad.t - 10 ? y - 24 : y + 34;
            const lx = Math.max(46, Math.min(w - 46, x));
            VizHelpers.ortaYazi(ctx, c.ad, lx, ty, "#e8eaf0", 10.5, true);
            VizHelpers.ortaYazi(ctx, c.not, lx, ty + 13, "#9aa0b4", 9.5);
        });

        // Öneri — uzun metin HTML olarak sarılır
        VizHelpers.altYazi("viz-edge",
            "Kural: Büyük hesap buluta; mahremiyet/hız kritik işler cihaza. Hibrit (cihaz filtresi + bulut derinliği) çoğu ürünün cevabıdır.");
    }

    hv.setPaint(ciz);
    ciz();
};
