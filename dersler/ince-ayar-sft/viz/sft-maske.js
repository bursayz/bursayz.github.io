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

        // Lejant
        y += 14;
        const lstart = Math.max(10, w / 2 - 200);
        Object.entries(ROLLER).forEach(([k, r], i) => {
            const lx = lstart + i * 145;
            ctx.fillStyle = r.renk + "33"; ctx.strokeStyle = r.renk; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(lx, y - 11, 13, 13, 3); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "left";
            ctx.fillText(r.label, lx + 18, y - 1);
        });

        // Açıklama
        y += 26;
        ctx.fillStyle = "#9aa0b4"; ctx.font = "11.5px Inter"; ctx.textAlign = "center";
        ctx.fillText("Üstü çizili gri kutular: labels = -100 → kayıp hesabına katılmaz, model bunlardan sorumlu tutulmaz.", w / 2, y);
        ctx.fillText("Renkli kutular: labels = gerçek token ID → model sadece asistan cevabını üretmekten ceza/ödül alır.", w / 2, y + 16);
    }

    window.addEventListener("resize", ciz);
    ciz();
};
