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

        // Dar ekranda düzen değişir: token sütunu daha geniş, model sağa kayar
        const dar = w < 480;
        const solX = dar ? 12 : 20, gY = 50, solW = dar ? w * 0.50 : w * 0.32;
        VizHelpers.ortaYazi(ctx, "Bağlam (KV-Cache)", solX + solW / 2, gY - 14, "#9aa0b4", 11, true, solW);
        const tokH = dar ? 18 : 22, tokGap = dar ? 4 : 5;
        for (let i = 0; i < seqLen; i++) {
            const y = gY + i * (tokH + tokGap);
            const isNew = i === seqLen - 1 && uretimAdim > 0;
            ctx.fillStyle = isNew ? ACCENT + "33" : "rgba(255,255,255,0.05)";
            ctx.strokeStyle = isNew ? ACCENT : "rgba(255,255,255,0.15)";
            ctx.lineWidth = isNew ? 2 : 1;
            ctx.beginPath(); ctx.roundRect(solX, y, solW, tokH, 5); ctx.fill(); ctx.stroke();
            const label = i < promptTokens.length ? `"${promptTokens[i]}"` : `üretilen ${i - promptTokens.length + 1}`;
            ctx.fillStyle = isNew ? ACCENT2 : "#9aa0b4";
            ctx.font = `${dar ? 8.5 : 10}px 'JetBrains Mono', monospace`;
            ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
            ctx.fillText(`K,V[${i}] ${label}`, solX + 6, y + tokH - 6);
        }

        // Model kutusu: geniş ekranda ortada, dar ekranda token sütununun sağında
        const midY = dar ? 56 : h * 0.4;
        const midX = dar ? solX + solW + 16 : w * 0.42;
        const kutuW = dar ? w - midX - 10 : w * 0.18;
        ctx.fillStyle = "#2a2f45"; ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(midX, midY, kutuW, 90, 12); ctx.fill(); ctx.stroke();
        VizHelpers.ortaYazi(ctx, "Model", midX + kutuW / 2, midY + 30, "#e8eaf0", 14, true, kutuW - 8);
        VizHelpers.ortaYazi(ctx, "(tüm katmanlar)", midX + kutuW / 2, midY + 50, "#9aa0b4", 10, false, kutuW - 8);
        VizHelpers.ortaYazi(ctx, dar ? "YENİ token" : "Sadece YENİ token işlenir",
            midX + kutuW / 2, midY + 70, ACCENT2, 9, false, kutuW - 6);

        // Ok: cache → model
        const cacheX = solX + solW + 2;
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 2;
        ctx.fillStyle = ACCENT;
        if (midX - cacheX > 12) {
            ctx.beginPath(); ctx.moveTo(cacheX, midY + 20); ctx.lineTo(midX, midY + 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(midX, midY + 20); ctx.lineTo(midX - 7, midY + 15); ctx.lineTo(midX - 7, midY + 25); ctx.closePath(); ctx.fill();
            if (midX - cacheX > 46) VizHelpers.ortaYazi(ctx, "K,V oku", (cacheX + midX) / 2, midY + 12, ACCENT2, 9);
        }

        // Ok: model → yeni token (geniş ekranda sağa, dar ekranda aşağı)
        if (dar) {
            const tx = midX + kutuW / 2, ty = midY + 90;
            ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty + 14); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(tx, ty + 14); ctx.lineTo(tx - 5, ty + 7); ctx.lineTo(tx + 5, ty + 7); ctx.closePath(); ctx.fill();
            vizToken(midX, ty + 18, "Yeni Token", ACCENT, ACCENT2, kutuW);
        } else {
            const outX = midX + kutuW + 10;
            ctx.beginPath(); ctx.moveTo(midX + kutuW, midY + 20); ctx.lineTo(outX, midY + 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(outX, midY + 20); ctx.lineTo(outX - 7, midY + 15); ctx.lineTo(outX - 7, midY + 25); ctx.closePath(); ctx.fill();
            vizToken(outX + 5, midY + 8, "Yeni Token", ACCENT, ACCENT2, w - outX - 12);
        }

        // Bellek + hız karşılaştırması — uzun metin HTML olarak sarılır
        const bellek = seqLen * 0.5;
        VizHelpers.altYaziHTML("viz-kvcache",
            `Cache: <b>${seqLen}</b> token (${bellek.toFixed(1)} GB bellek) · KV-cache'siz: ${seqLen}² ≈ ${seqLen * seqLen} hesaplama birimi<br>` +
            `<span style="color:${ACCENT}"><b>KV-cache'li: ${seqLen} hesaplama birimi (${seqLen}x hız kazancı)</b></span>`);
    }

    function vizToken(x, y, label, renk, renk2, maksW) {
        const tw = Math.max(ctx.measureText(label).width + 30, 90);
        const gw = Math.max(60, maksW ? Math.min(tw, maksW) : tw);
        ctx.fillStyle = renk + "22"; ctx.strokeStyle = renk; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(x, y, gw, 30, 8); ctx.fill(); ctx.stroke();
        VizHelpers.ortaYazi(ctx, `"${label}"`, x + gw / 2, y + 15, renk2, 11, true, gw - 12);
    }

    VizHelpers.adimKontrol("viz-kvcache", toplamToken, ciz);
};
