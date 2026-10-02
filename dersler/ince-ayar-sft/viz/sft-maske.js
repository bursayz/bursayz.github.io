// SFT — Loss maskesi görselleştirmesi (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-sft-maske"] = function () {
    const hv = VizHelpers.canvas2D("viz-sft-maske", 0.55);
    if (!hv) return;
    const { ctx } = hv;

    const SEGMENTLER = [
        { parcalar: ["<|system|>", " Sen", " yardımcı", " bir", " asistansın", "."], rol: "sistem" },
        { parcalar: ["<|user|>", " Bursa", "'da", " ne", " yenir", "?", " <|eot|>"], rol: "kullanici" },
        { parcalar: ["<|assistant|>", " İskender", " kebap", " ve", " kestane", " şekeri", "!", " <|eot|>"], rol: "asistan" }
    ];

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();
    const ROLLER = {
        sistem:    { renk: "#64748b", label: "SYSTEM (maskeli ✗)" },
        kullanici: { renk: "#3b82f6", label: "USER (maskeli ✗)" },
        asistan:   { renk: ACCENT,    label: "ASSISTANT (öğrenilen ✓)" }
    };

    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);

        VizHelpers.ortaYazi(ctx, "Tek eğitim örneğindeki token akışı ve loss maskesi", w / 2, 20, ACCENT2, 13, true);

        let x = 18, y = 48;
        const kutuH = 26, bosluk = 4;

        SEGMENTLER.forEach(seg => {
            seg.parcalar.forEach(p => {
                ctx.font = "11px 'JetBrains Mono', monospace";
                const tw = ctx.measureText(p).width + 12;
                if (x + tw > w - 18) { x = 18; y += kutuH + bosluk + 6; }
                const rol = ROLLER[seg.rol];
                const maskeli = seg.rol !== "asistan";
                ctx.fillStyle = maskeli ? "rgba(255,255,255,0.03)" : rol.renk + "28";
                ctx.strokeStyle = maskeli ? "rgba(255,255,255,0.14)" : rol.renk;
                ctx.lineWidth = maskeli ? 1 : 1.6;
                ctx.beginPath(); ctx.roundRect(x, y, tw, kutuH, 5); ctx.fill(); ctx.stroke();
                ctx.fillStyle = maskeli ? "#5a607a" : ACCENT2;
                ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
                ctx.fillText(p, x + 6, y + 17);
                if (maskeli) {
                    // labels=-100 üstü çizili gösterim
                    ctx.strokeStyle = "rgba(239,68,68,0.55)";
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(x + 3, y + kutuH / 2); ctx.lineTo(x + tw - 3, y + kutuH / 2); ctx.stroke();
                }
                x += tw + bosluk;
            });
            y += kutuH + bosluk + 8;
        });

        // Lejant — dar ekranda her kayıt ayrı satıra, geniş ekranda tek satıra
        y += 14;
        if (w >= 470) {
            const lstart = Math.max(10, w / 2 - 200);
            const adim = Math.min(150, (w - lstart - 8) / 3);
            Object.entries(ROLLER).forEach(([k, r], i) => {
                const lx = lstart + i * adim;
                ctx.fillStyle = r.renk + "33"; ctx.strokeStyle = r.renk; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.roundRect(lx, y - 11, 13, 13, 3); ctx.fill(); ctx.stroke();
                ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "left";
                ctx.fillText(r.label, lx + 18, y - 1);
            });
        } else {
            Object.entries(ROLLER).forEach(([k, r], i) => {
                const lx = 12, ly = y - 1 + i * 17;
                ctx.fillStyle = r.renk + "33"; ctx.strokeStyle = r.renk; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.roundRect(lx, ly - 10, 13, 13, 3); ctx.fill(); ctx.stroke();
                ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "left";
                ctx.fillText(r.label, lx + 18, ly);
            });
            y += 34;
        }

        // Açıklama — uzun metinler HTML olarak sarılır
        VizHelpers.altYaziHTML("viz-sft-maske",
            `Üstü çizili gri kutular: <b>labels = -100</b> → kayıp hesabına katılmaz, model bunlardan sorumlu tutulmaz.<br>` +
            `Renkli kutular: <b>labels = gerçek token ID</b> → model sadece asistan cevabını üretmekten ceza/ödül alır.`);
    }

    hv.setPaint(ciz);
    ciz();
};
