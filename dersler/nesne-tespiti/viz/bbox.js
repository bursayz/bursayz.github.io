// Nesne Tespiti — NMS animasyonu (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-bbox"] = function () {
    const hv = VizHelpers.canvas2D("viz-bbox", 0.6);
    if (!hv) return;
    const { ctx } = hv;

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    // Örnek resim bölgesi + 5 aday kutu (aynı kediye)
    const gercekKutu = { x: 0.2, y: 0.25, w: 0.45, h: 0.42, sinif: "kedi" };
    const adaylar = [
        { x: 0.22, y: 0.27, w: 0.42, h: 0.39, conf: 0.92, sil: false },
        { x: 0.19, y: 0.24, w: 0.47, h: 0.43, conf: 0.87, sil: false },
        { x: 0.24, y: 0.29, w: 0.40, h: 0.38, conf: 0.79, sil: false },
        { x: 0.21, y: 0.26, w: 0.44, h: 0.41, conf: 0.65, sil: false },
        { x: 0.18, y: 0.23, w: 0.48, h: 0.45, conf: 0.51, sil: false },
    ];

    // IoU hesapla
    function iou(a, b) {
        const ax1 = a.x, ay1 = a.y, ax2 = a.x + a.w, ay2 = a.y + a.h;
        const bx1 = b.x, by1 = b.y, bx2 = b.x + b.w, by2 = b.y + b.h;
        const ix1 = Math.max(ax1, bx1), iy1 = Math.max(ay1, by1);
        const ix2 = Math.min(ax2, bx2), iy2 = Math.min(ay2, by2);
        const kes = Math.max(0, ix2 - ix1) * Math.max(0, iy2 - iy1);
        const bir = a.w * a.h + b.w * b.h - kes;
        return kes / Math.max(bir, 1e-9);
    }

    // NMS adımlarını önceden hesapla — her adımda bir kutu silinir
    const adimSenaryo = [];
    const kalanlar = adaylar.map(a => ({ ...a }));
    // Adım 0: başlangıç
    adimSenaryo.push(kalanlar.map(a => a.sil));
    // Her adımda en yüksek conf'lu kalanı tut, IoU>0.5 olanları sil
    const silinen = new Set();
    while (true) {
        const kalan = kalanlar.filter((a, i) => !silinen.has(i));
        if (kalan.length <= 1) break;
        const eniyi = kalan.reduce((m, a) => a.conf > m.conf ? a : m);
        let yeniSilinen = false;
        kalanlar.forEach((a, i) => {
            if (!silinen.has(i) && a !== eniyi && iou(a, eniyi) > 0.5) {
                silinen.add(i);
                yeniSilinen = true;
            }
        });
        if (!yeniSilinen) break;
        adimSenaryo.push(kalanlar.map(a => silinen.has(kalanlar.indexOf(a)) || a.sil));
    }
    const toplamAdim = adimSenaryo.length;

    function ciz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const silDrum = adimSenaryo[Math.min(adim, toplamAdim - 1)];

        VizHelpers.ortaYazi(ctx, `NMS Adımı ${adim + 1}: En yüksek güven skorlu kutu seçilir, IoU>0.5 olanlar silinir`, w / 2, 18, ACCENT2, 12, true);

        // Resim bölgesi (basitleştirilmiş kedi silueti çizimi)
        const rx = w * 0.1, ry = 45, rw = w * 0.8, rh = h - 110;
        ctx.fillStyle = "#1a1f33";
        ctx.beginPath(); ctx.roundRect(rx, ry, rw, rh, 8); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.stroke();

        // Basit kedi figürü
        const kx = rx + gercekKutu.x * rw, ky = ry + gercekKutu.y * rh;
        const kw2 = gercekKutu.w * rw, kh2 = gercekKutu.h * rh;
        ctx.fillStyle = "rgba(86,166,5,0.1)";
        ctx.beginPath(); ctx.roundRect(kx, ky, kw2, kh2, 10); ctx.fill();
        VizHelpers.ortaYazi(ctx, "🐱", kx + kw2 / 2, ky + kh2 / 2, "#56a605", Math.min(kw2, kh2) * 0.4);
        VizHelpers.ortaYazi(ctx, "(gerçek kedi)", kx + kw2 / 2, ky + kh2 + 14, "#56a605", 10);

        // Aday kutular
        adaylar.forEach((a, i) => {
            const silik = silDrum[i];
            const x = rx + a.x * rw, y = ry + a.y * rh;
            const bw = a.w * rw, bh = a.h * rh;
            const renk = silik ? "#ef4444" : ACCENT;
            ctx.fillStyle = silik ? "rgba(239,68,68,0.05)" : "rgba(86,166,5,0.08)";
            ctx.strokeStyle = silik ? "#ef4444aa" : renk;
            ctx.lineWidth = silik ? 1 : 2.5;
            ctx.setLineDash(silik ? [4, 4] : []);
            ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 4); ctx.fill(); ctx.stroke();
            ctx.setLineDash([]);

            // Güven etiketi
            ctx.fillStyle = renk;
            ctx.fillRect(x, y - 16, ctx.measureText(`${a.conf.toFixed(2)}`).width + 24, 16);
            ctx.fillStyle = "#0b0d14";
            ctx.font = "bold 10px 'JetBrains Mono', monospace";
            ctx.textAlign = "left"; ctx.textBaseline = "middle";
            ctx.fillText(`${a.conf.toFixed(2)}${i === 0 && !silik ? " ★" : ""}`, x + 5, y - 8);
            if (silik) {
                ctx.fillStyle = "#ef4444";
                ctx.font = "bold 14px Inter";
                ctx.textAlign = "center";
                ctx.fillText("✗ elendi", x + bw / 2, y + bh / 2);
            }
        });

        // Alt açıklama
        const kalanSayisi = silDrum.filter(s => !s).length;
        ctx.fillStyle = "#9aa0b4"; ctx.font = "11.5px Inter"; ctx.textAlign = "center";
        ctx.fillText(`${kalanSayisi} kutu kaldı. Son adımda sadece en yüksek güvenli (0.92) kutu kalır → temiz tespit!`, w / 2, h - 18);
    }

    VizHelpers.adimKontrol("viz-bbox", toplamAdim, ciz);
};
