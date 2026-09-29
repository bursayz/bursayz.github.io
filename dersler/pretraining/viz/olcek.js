// Pretraining — Ölçek yasaları grafiği animasyonu (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-olcek"] = function () {
    const hv = VizHelpers.canvas2D("viz-olcek", 0.55);
    if (!hv) return;
    const { ctx } = hv;

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    // Log-log ölçekte kayıp eğrileri (scaling laws ~ lineer)
    // loss = a * (compute)^-alpha benzeri
    const seriler = [
        { ad: "Az veri (10B token)", renk: "#ef4444", egim: 0.28, sabit: 4.5 },
        { ad: "Orta veri (100B token)", renk: "#f59e0b", egim: 0.34, sabit: 4.2 },
        { ad: "Çok veri (1T token)", renk: "#3b82f6", egim: 0.38, sabit: 4.0 },
        { ad: "Chinchilla optimal", renk: ACCENT, egim: 0.44, sabit: 3.9 }
    ];

    let t = 0;
    function hesapla(seri, logN) {
        // log10(N) 7..11 arası (10M..100B parametre)
        return seri.sabit - seri.egim * (logN - 7);
    }

    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        t += 0.008;

        const pad = { l: 55, r: 20, t: 45, b: 55 };
        const gw = w - pad.l - pad.r, gh = h - pad.t - pad.b;
        const xMin = 7, xMax = 11.5;   // log10(parametre)
        const yMin = 1.0, yMax = 4.6;  // kayıp

        const sx = v => pad.l + ((v - xMin) / (xMax - xMin)) * gw;
        const sy = v => pad.t + gh - ((v - yMin) / (yMax - yMin)) * gh;

        // Başlık
        VizHelpers.ortaYazi(ctx, "Kayıp vs Model Boyutu (log-log) — Scaling Laws", w / 2, 18, ACCENT2, 13, true);

        // Izgara + eksenler
        ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const x = xMin + (xMax - xMin) * i / 4, y = yMin + (yMax - yMin) * i / 4;
            ctx.beginPath(); ctx.moveTo(sx(x), pad.t); ctx.lineTo(sx(x), pad.t + gh); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pad.l, sy(y)); ctx.lineTo(pad.l + gw, sy(y)); ctx.stroke();
        }
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gh); ctx.lineTo(pad.l + gw, pad.t + gh); ctx.stroke();

        // Eksen etiketleri
        ctx.fillStyle = "#666"; ctx.font = "10px Inter"; ctx.textAlign = "center";
        ["10M", "100M", "1B", "10B", "100B"].forEach((l, i) => {
            ctx.fillText(l, sx(7 + i), pad.t + gh + 16);
        });
        ctx.textAlign = "right";
        [1, 2, 3, 4].forEach(v => ctx.fillText(String(v) + ".0", pad.l - 6, sy(v) + 3));
        VizHelpers.ortaYazi(ctx, "Parametre sayısı (log ölçek) →", pad.l + gw / 2, h - 18, "#9aa0b4", 11);
        ctx.save();
        ctx.translate(14, pad.t + gh / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter"; ctx.textAlign = "center";
        ctx.fillText("Kayıp (loss) →", 0, 0);
        ctx.restore();

        // Animasyonlu eğri çizimi
        const p = Math.min(1, t);  // çizim ilerlemesi
        seriler.forEach(seri => {
            ctx.strokeStyle = seri.renk;
            ctx.lineWidth = seri.ad.includes("optimal") ? 3 : 1.8;
            ctx.setLineDash(seri.ad.includes("Az veri") ? [5, 4] : []);
            ctx.beginPath();
            const steps = Math.floor(50 * p);
            for (let i = 0; i <= steps; i++) {
                const logN = xMin + (xMax - xMin) * i / 50;
                const loss = hesapla(seri, logN);
                const X = sx(logN), Y = sy(loss);
                i === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
            }
            ctx.stroke();
            ctx.setLineDash([]);
        });

        // Lejant
        seriler.forEach((seri, i) => {
            const lx = pad.l + 12, ly = pad.t + 16 + i * 18;
            ctx.strokeStyle = seri.renk; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 20, ly); ctx.stroke();
            ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "left";
            ctx.fillText(seri.ad, lx + 26, ly + 3);
        });

        // Animasyon bitince açıklama
        if (p >= 1) {
            ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter"; ctx.textAlign = "center";
            ctx.fillText("Log-log ölçekte kayıp, hesaplama arttıkça doğrusal azalır — ama asla sıfıra inmez.", w / 2, h - 4);
        }

        if (t < 1.6) requestAnimationFrame(ciz);
        else cizSon?.();
    }
    ciz();
    // Tekrar oynatma
    hv.canvas.addEventListener("click", () => { t = 0; ciz(); });
};
