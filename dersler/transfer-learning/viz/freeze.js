// Transfer Learning — Katman dondurma/çözme görselleştirmesi
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-freeze"] = function () {
    const hv = VizHelpers.canvas2D("viz-freeze", 0.5);
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

        const startY = 50, boxW = Math.min(110, (w - 40) / KATMANLAR.length - 8), boxH = 70;
        const totalW = KATMANLAR.length * boxW + (KATMANLAR.length - 1) * 8;
        const startX = (w - totalW) / 2;

        KATMANLAR.forEach((k, i) => {
            const x = startX + i * (boxW + 8);
            const frozen = k.freeze;
            const pulse = frozen ? 0 : Math.sin(t * 2 + i) * 0.08;

            ctx.fillStyle = frozen
                ? "rgba(100,116,139,0.12)"
                : `rgba(${ACCENT.r * 255},${ACCENT.g * 255},${ACCENT.b * 255},${0.15 + pulse})`;
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

        // Alt bilgi
        const infoY = startY + boxH + 40;
        ctx.fillStyle = ACCENT2; ctx.font = "bold 12px Inter"; ctx.textAlign = "center";
        ctx.fillText("❄ = requires_grad=False (öğrenmez)  🔥 = requires_grad=True (öğrenir)", w / 2, infoY);
        ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter";
        ctx.fillText("Ön katmanlar genel bilgi taşır → donuk. Son katmanlar görev-özel → eğitilebilir (düşük LR ile).", w / 2, infoY + 22);
        ctx.fillText("fc katmanı tamamen yenidir → rastgeledir, en yüksek LR ile eğitilir.", w / 2, infoY + 40);
    }

    ciz();
    setInterval(ciz, 80);
};
