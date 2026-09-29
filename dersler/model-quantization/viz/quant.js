// Model Quantization — FP32→INT4 ağırlık dağılım haritası
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-quant"] = function () {
    const hv = VizHelpers.canvas2D("viz-quant", 0.58);
    if (!hv) return;
    const { ctx } = hv;

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    // Normal dağılım benzeri ağırlık üret (deterministik)
    const sr = (seed => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; })(77);
    function gauss() {
        return (sr() + sr() + sr() + sr() + sr() + sr() - 3) * 0.5;
    }
    const agirliklar = Array.from({ length: 1500 }, () => gauss() * 2.2);

    const FORMATLAR = [
        { ad: "FP32 (orijinal)", bit: null, renk: "#3b82f6" },
        { ad: "FP16", bit: 16, renk: "#22d3ee" },
        { ad: "INT8 (256 seviye)", bit: 8, renk: ACCENT },
        { ad: "INT4 (16 seviye)", bit: 4, renk: "#f59e0b" }
    ];

    function quantize(vals, bit) {
        if (bit === null) return vals;
        const seviye = 2 ** bit - 1;
        const mn = Math.min(...vals), mx = Math.max(...vals);
        return vals.map(v => {
            const norm = (v - mn) / (mx - mn || 1);
            return Math.round(norm * seviye) / seviye * (mx - mn) + mn;
        });
    }

    function histogram(vals, bins, mn, mx) {
        const h = new Array(bins).fill(0);
        vals.forEach(v => {
            const i = Math.min(bins - 1, Math.max(0, Math.floor((v - mn) / (mx - mn) * bins)));
            h[i]++;
        });
        return h;
    }

    function ciz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const fmt = FORMATLAR[adim];
        const q = quantize(agirliklar, fmt.bit);

        VizHelpers.ortaYazi(ctx, fmt.ad, w / 2, 20, fmt.renk, 15, true);

        const pad = { l: 45, r: 15, t: 45, b: 55 };
        const gw = w - pad.l - pad.r, gh = h - pad.t - pad.b;
        const bins = 50;
        const mn = -6, mx = 6;
        const hist = histogram(q, bins, mn, mx);
        const maxH = Math.max(...hist);

        // Eksenler
        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gh); ctx.lineTo(pad.l + gw, pad.t + gh); ctx.stroke();

        // Histogram çubukları
        const barW = gw / bins;
        hist.forEach((sayi, i) => {
            const bh = (sayi / maxH) * gh * 0.9;
            const x = pad.l + i * barW;
            const y = pad.t + gh - bh;
            ctx.fillStyle = fmt.renk + "aa";
            ctx.fillRect(x, y, barW - 1, bh);
            ctx.strokeStyle = fmt.renk;
            ctx.strokeRect(x, y, barW - 1, bh);
        });

        // X ekseni etiketleri
        ctx.fillStyle = "#666"; ctx.font = "10px Inter"; ctx.textAlign = "center";
        for (let v = -6; v <= 6; v += 3) {
            ctx.fillText(String(v), pad.l + ((v - mn) / (mx - mn)) * gw, pad.t + gh + 16);
        }
        VizHelpers.ortaYazi(ctx, "Ağırlık değeri →", pad.l + gw / 2, h - 20, "#9aa0b4", 11);

        // Bilgi
        const seviyeSayisi = fmt.bit === null ? "∞ (sürekli)" : (2 ** fmt.bit);
        const benzersiz = new Set(q.map(v => v.toFixed(4))).size;
        const hata = fmt.bit === null ? 0 :
            agirliklar.reduce((s, v, i) => s + (v - q[i]) ** 2, 0) / agirliklar.length;

        ctx.fillStyle = "#9aa0b4"; ctx.font = "11.5px Inter"; ctx.textAlign = "center";
        ctx.fillText(`Benzersiz değer: ${benzersiz}/${seviyeSayisi} seviye · Ortalama kare hata (MSE): ${hata.toFixed(4)}`, w / 2, pad.t + gh + 34);
        if (fmt.bit === 4) {
            ctx.fillStyle = "#f59e0b";
            ctx.fillText("Dikkat: sadece 16 'basamak' — dağılım merdivene dönüştü ama şekil korundu!", w / 2, pad.t + gh + 52);
        }
    }

    const kontrol = VizHelpers.adimKontrol("viz-quant", FORMATLAR.length, ciz);
    window.addEventListener("resize", () => hv.redraw());
};
