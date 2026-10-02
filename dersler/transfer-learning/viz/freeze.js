// Transfer Learning — Katman dondurma/çözme görselleştirmesi
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-freeze"] = function () {
    const hv = VizHelpers.canvas2D("viz-freeze", 0.5, null, 340);
    if (!hv) return;
    const { ctx } = hv;

    const KATMANLAR = [
        { ad: "conv1", bilgi: "Kenar/doku dedektörleri", tip: "backbone", freeze: true },
        { ad: "layer1", bilgi: "Temel şekiller", tip: "backbone", freeze: true },
        { ad: "layer2", bilgi: "Desen kombinasyonları", tip: "backbone", freeze: true },
        { ad: "layer3", bilgi: "Nesne parçaları", tip: "orta", freeze: true },
        { ad: "layer4", bilgi: "Nesne temsilleri", tip: "orta", freeze: false },
        { ad: "fc (yeni)", bilgi: "Kedi/Köpek kararı", tip: "head", freeze: false }
    ];

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();
    let t = 0;

    function ciz() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        t += 0.01;

        VizHelpers.ortaYazi(ctx, "ResNet-18 Transfer Learning — Katman Stratejisi", w / 2, 20, ACCENT2, 13, true);

        const dar = w < 560;
        const startY = dar ? 44 : 50;

        if (dar) {
            // Dar ekranda katmanlar alt alta: ikon+ad (üstte), açıklama (altta)
            const bx = 12, bw = w - 24, bh = 42, gap = 6;
            let y = startY;
            KATMANLAR.forEach((k, i) => {
                const frozen = k.freeze;
                const pulse = frozen ? 0 : Math.sin(t * 2 + i) * 0.08;
                const renk = frozen ? "#64748b" : ACCENT;
                ctx.fillStyle = frozen ? "rgba(100,116,139,0.12)" : `rgba(86,166,5,${0.15 + pulse})`;
                ctx.strokeStyle = renk;
                ctx.lineWidth = frozen ? 1 : 2;
                ctx.beginPath(); ctx.roundRect(bx, y, bw, bh, 8); ctx.fill(); ctx.stroke();

                ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
                ctx.fillStyle = renk; ctx.font = "bold 11px Inter";
                ctx.fillText(frozen ? "❄" : "🔥", bx + 8, y + 17);
                ctx.fillStyle = "#e8eaf0"; ctx.font = "bold 11px Inter";
                ctx.fillText(k.ad, bx + 24, y + 17);
                ctx.fillStyle = renk; ctx.font = "9.5px Inter"; ctx.textAlign = "right";
                ctx.fillText(frozen ? "donuk" : "eğitiliyor", bx + bw - 8, y + 17);
                ctx.fillStyle = "#9aa0b4"; ctx.font = "9.5px Inter"; ctx.textAlign = "left";
                ctx.fillText(k.bilgi, bx + 24, y + 33);
                y += bh + gap;
            });
        } else {
        const boxW = Math.min(110, (w - 40) / KATMANLAR.length - 8), boxH = 70;
        const totalW = KATMANLAR.length * boxW + (KATMANLAR.length - 1) * 8;
        const startX = (w - totalW) / 2;

        KATMANLAR.forEach((k, i) => {
            const x = startX + i * (boxW + 8);
            const frozen = k.freeze;
            const pulse = frozen ? 0 : Math.sin(t * 2 + i) * 0.08;

            ctx.fillStyle = frozen
                ? "rgba(100,116,139,0.12)"
                : `rgba(86,166,5,${0.15 + pulse})`;
            ctx.strokeStyle = frozen ? "#64748b" : ACCENT;
            ctx.lineWidth = frozen ? 1 : 2;
            ctx.beginPath(); ctx.roundRect(x, startY, boxW, boxH, 8); ctx.fill(); ctx.stroke();

            // Freeze ikonu
            ctx.fillStyle = frozen ? "#64748b" : ACCENT2;
            ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
            ctx.fillText(frozen ? "❄ Donuk" : "🔥 Eğitiliyor", x + boxW / 2, startY + 14);
            ctx.fillStyle = "#e8eaf0"; ctx.font = "bold 11px Inter";
            ctx.fillText(k.ad, x + boxW / 2, startY + 32);
            ctx.fillStyle = "#9aa0b4"; ctx.font = "9px Inter";
            const words = k.bilgi.split(" ");
            let line = "", ly = startY + 46;
            for (const word of words) {
                const t2 = line ? line + " " + word : word;
                if (ctx.measureText(t2).width > boxW - 6) { ctx.fillText(line, x + boxW / 2, ly); line = word; ly += 11; } else line = t2;
            }
            if (line) ctx.fillText(line, x + boxW / 2, ly);

            // Bağlantı oku
            if (i < KATMANLAR.length - 1) {
                ctx.strokeStyle = "rgba(255,255,255,0.2)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x + boxW, startY + boxH / 2);
                ctx.lineTo(x + boxW + 8, startY + boxH / 2);
                ctx.stroke();
            }
        });
        }

        // Alt bilgi — uzun metinler HTML olarak sarılır
        VizHelpers.altYaziHTML("viz-freeze",
            `<b>❄ = requires_grad=False (öğrenmez)</b> · <b>🔥 = requires_grad=True (öğrenir)</b><br>` +
            `Ön katmanlar genel bilgi taşır → donuk. Son katmanlar görev-özel → eğitilebilir (düşük LR ile).<br>` +
            `fc katmanı tamamen yenidir → rastgeledir, en yüksek LR ile eğitilir.`);
    }

    hv.setPaint(ciz);
    ciz();
    setInterval(ciz, 80);
};
