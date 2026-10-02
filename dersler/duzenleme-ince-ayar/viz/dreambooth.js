// Düzenleme İnce Ayarı — LoRA'nın UNet katmanlarına eklenmesi (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-dreambooth"] = function () {
    const hv = VizHelpers.canvas2D("viz-dreambooth", 0.52);
    if (!hv) return;
    const { ctx } = hv;
    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    function kutu(x, y, w, h, bg, border, baslik, alt, aktif = true, icon = "") {
        ctx.globalAlpha = aktif ? 1 : 0.35;
        ctx.fillStyle = bg; ctx.strokeStyle = border; ctx.lineWidth = aktif ? 1.8 : 1;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill(); ctx.stroke();
        // Kutu içi yazılar kutu genişliğine sığdırılır (dar ekranda taşmaz)
        VizHelpers.ortaYazi(ctx, (icon ? icon + " " : "") + baslik, x + w / 2, y + h / 2 - (alt ? 9 : 0),
            aktif ? "#e8eaf0" : "#5a607a", 12, true, w - 8);
        if (alt) {
            VizHelpers.ortaYazi(ctx, alt, x + w / 2, y + h / 2 + 9,
                aktif ? "#9aa0b4" : "#4a4f6a", 9.5, false, w - 8);
        }
        ctx.globalAlpha = 1;
    }

    function ok(x1, y1, x2, y2, renk = "rgba(255,255,255,0.3)") {
        ctx.strokeStyle = renk; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        const a = Math.atan2(y2 - y1, x2 - x1);
        ctx.fillStyle = renk;
        ctx.beginPath(); ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 7 * Math.cos(a - 0.4), y2 - 7 * Math.sin(a - 0.4));
        ctx.lineTo(x2 - 7 * Math.cos(a + 0.4), y2 - 7 * Math.sin(a + 0.4));
        ctx.closePath(); ctx.fill();
    }

    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);

        VizHelpers.ortaYazi(ctx, "LoRA Adaptörü: UNet Attention'a Eklenen Yama", w / 2, 20, ACCENT2, 13, true);

        if (w < 460) {
            // Dar ekranda yatay şema sığmaz → dikey akış
            const bw = w - 36;
            const bh = Math.max(34, Math.min(56, Math.round((h - 76) / 4 - 14)));
            const x = 18;
            const adimlar = [
                ["Latent x_t", "gürültülü resim", "#3b82f6", "#3b82f622"],
                ["Cross-Attention", "to_q/k/v proj.", ACCENT, "rgba(168,85,247,0.12)"],
                ["LoRA Patch (A×B · 16 MB)", "donuk UNet'e ek yama", "#f59e0b", "#f59e0b22"],
                ["VAE Decoder → 🖼 Üretim", "piksel uzayına — sizin nesneniz", "#22c55e", "#22c55e18"],
            ];
            let y = 44;
            adimlar.forEach(([b, a, renk, bg], i) => {
                kutu(x, y, bw, bh, bg, renk, b, a, true, "");
                if (i < adimlar.length - 1) ok(x + bw / 2, y + bh, x + bw / 2, y + bh + 12, renk);
                y += bh + 14;
            });
        } else {
        const cy = h * 0.5;
        const kw = Math.min(100, w * 0.18), kh = 65;

        // Girdi latent + text
        kutu(w * 0.02, cy - 70, kw, kh, "#3b82f622", "#3b82f6", "Latent x_t", "gürültülü resim");
        kutu(w * 0.02, cy + 10, kw, kh, "#a855f722", "#a855f7", "Prompt", "'sks kedim'");

        // Attention bloğu (merkez)
        const attnX = w * 0.28;
        kutu(attnX, cy - 30, kw + 30, kh + 15, "rgba(168,85,247,0.12)", ACCENT, "Cross-Attention", "to_q/k/v proj.");
        ok(w * 0.02 + kw, cy - 38, attnX, cy - 12);
        ok(w * 0.02 + kw, cy + 42, attnX, cy + 20);

        // LoRA patch (yan tarafta)
        const loraX = attnX + kw + 20;
        kutu(loraX, cy - 55, kw - 15, kh - 10, "#f59e0b22", "#f59e0b", "LoRA Patch", "A×B (16 MB)");
        ok(loraX - 8, cy - 22, loraX, cy - 22, "#f59e0b");

        // UNet + VAE decoder
        const outX = loraX + kw + 18;
        kutu(outX, cy - 30, kw, kh, "#22c55e18", "#22c55e", "VAE Decoder", "piksel uzayına");
        ok(attnX + kw + 30, cy - 12, outX, cy - 5);

        // Sonuç
        kutu(outX, cy + 50, kw, kh - 25, ACCENT + "18", ACCENT, "🖼 Üretim", "sizin nesneniz", true, "");
        ok(outX + kw / 2, cy + 20, outX + kw / 2, cy + 50, ACCENT);
        }

        // Alt açıklama — HTML olarak sarılır (mobilde taşmaz)
        VizHelpers.altYaziHTML("viz-dreambooth",
            `SD UNet donuk kalır (2+ GB). Sadece LoRA patch (16 MB) öğrenilir — <b>'sks'</b> tetikleyicisi sizin nesnenize bağlanır.<br>` +
            `Sonuç dosyası paylaşılabilir, Civitai'ye yüklenebilir, çıkarılıp takılabilir.`);
    }

    hv.setPaint(ciz);
    ciz();
};
