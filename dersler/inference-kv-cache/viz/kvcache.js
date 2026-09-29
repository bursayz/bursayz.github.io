// Inference — KV-Cache büyüme animasyonu (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-kvcache"] = function () {
    const hv = VizHelpers.canvas2D("viz-kvcache", 0.55);
    if (!hv) return;
    const { ctx } = hv;

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    const promptTokens = ["Bursa", "'da", " yapay", " zeka"];
    const toplamToken = 8;

    function ciz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const uretimAdim = Math.min(adim, toplamToken - 1);
        const seqLen = promptTokens.length + uretimAdim;

        VizHelpers.ortaYazi(ctx, `Adım ${adim + 1}: ${seqLen}. token üretiliyor`, w / 2, 20, ACCENT2, 14, true);

        // Sol: Girdi dizisi
        const solX = 20, gY = 50, solW = w * 0.32;
        VizHelpers.ortaYazi(ctx, "Bağlam (KV-Cache)", solX + solW / 2, gY - 14, "#9aa0b4", 11, true);
        const tokH = 22, tokGap = 5;
        for (let i = 0; i < seqLen; i++) {
            const y = gY + i * (tokH + tokGap);
            const isNew = i === seqLen - 1 && uretimAdim > 0;
            ctx.fillStyle = isNew ? ACCENT + "33" : "rgba(255,255,255,0.05)";
            ctx.strokeStyle = isNew ? ACCENT : "rgba(255,255,255,0.15)";
            ctx.lineWidth = isNew ? 2 : 1;
            ctx.beginPath(); ctx.roundRect(solX, y, solW, tokH, 5); ctx.fill(); ctx.stroke();
            const label = i < promptTokens.length ? `"${promptTokens[i]}"` : `üretilen ${i - promptTokens.length + 1}`;
            ctx.fillStyle = isNew ? ACCENT2 : "#9aa0b4";
            ctx.font = "10px 'JetBrains Mono', monospace";
            ctx.textAlign = "left";
            ctx.fillText(`K,V[${i}] ${label}`, solX + 8, y + 15);
        }
        // Bellek kullanımı
        const bellek = seqLen * 0.5;  // GB benzeri örnek
        ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter";
        ctx.textAlign = "left";
        ctx.fillText(`Cache: ${seqLen} token (${bellek.toFixed(1)} GB bellek)`, solX, gY + seqLen * (tokH + tokGap) + 18);

        // Orta: Model
        const midX = w * 0.42, midY = h * 0.4;
        ctx.fillStyle = "#2a2f45"; ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(midX, midY, w * 0.18, 90, 12); ctx.fill(); ctx.stroke();
        VizHelpers.ortaYazi(ctx, "Model", midX + w * 0.09, midY + 30, "#e8eaf0", 14, true);
        VizHelpers.ortaYazi(ctx, "(tüm katmanlar)", midX + w * 0.09, midY + 50, "#9aa0b4", 10);
        VizHelpers.ortaYazi(ctx, "Sadece YENİ token işlenir", midX + w * 0.09, midY + 68, ACCENT2, 9);

        // Oklar: cache → model
        const cacheX = solX + solW + 10;
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cacheX, midY + 20); ctx.lineTo(midX, midY + 20); ctx.stroke();
        ctx.fillStyle = ACCENT;
        ctx.beginPath(); ctx.moveTo(midX, midY + 20); ctx.lineTo(midX - 7, midY + 15); ctx.lineTo(midX - 7, midY + 25); ctx.closePath(); ctx.fill();
        VizHelpers.ortaYazi(ctx, "K,V oku", (cacheX + midX) / 2, midY + 12, ACCENT2, 9);

        // Ok: model → yeni token
        const outX = midX + w * 0.18 + 10;
        ctx.beginPath(); ctx.moveTo(midX + w * 0.18, midY + 20); ctx.lineTo(outX, midY + 20); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(outX, midY + 20); ctx.lineTo(outX - 7, midY + 15); ctx.lineTo(outX - 7, midY + 25); ctx.closePath(); ctx.fill();

        // Sağ: Yeni token
        vizToken(outX + 5, midY + 8, "Yeni Token", ACCENT, ACCENT2);

        // Alt: zaman karşılaştırması
        const karX = 20, karY = h - 65, karW = w - 40;
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.beginPath(); ctx.roundRect(karX, karY - 15, karW, 55, 8); ctx.fill();
        ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter"; ctx.textAlign = "center";
        ctx.fillText(`KV-cache'siz: ${seqLen}² ≈ ${seqLen * seqLen} hesaplama birimi`, w / 2, karY + 5);
        ctx.fillStyle = ACCENT; ctx.font = "bold 11.5px Inter";
        ctx.fillText(`KV-cache'li:  ${seqLen} hesaplama birimi (${(seqLen * seqLen / seqLen).toFixed(0)}x hız kazancı)`, w / 2, karY + 24);
    }

    function vizToken(x, y, label, renk, renk2) {
        const tw = ctx.measureText(label).width + 30;
        ctx.fillStyle = renk + "22"; ctx.strokeStyle = renk; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(x, y, Math.max(tw, 90), 30, 8); ctx.fill(); ctx.stroke();
        ctx.fillStyle = renk2; ctx.font = "bold 11px 'JetBrains Mono', monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(`"${label}"`, x + Math.max(tw, 90) / 2, y + 15);
    }

    VizHelpers.adimKontrol("viz-kvcache", toplamToken, ciz);
};
