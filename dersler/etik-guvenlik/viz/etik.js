// Etik — Risk değerlendirme karar ağacı (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-etik"] = function () {
    const hv = VizHelpers.canvas2D("viz-etik", 0.6);
    if (!hv) return;
    const { ctx } = hv;
    const ACCENT2 = VizHelpers.accent2();

    const ADIMLAR = [
        {
            soru: "1️⃣ Model kişisel veri ile mi çalışıyor?",
            detay: "Evet → KVKK/GDPR değerlendirmesi şart. Rıza var mı? PII temizliği yapıldı mı?\nHayır → Sonraki soruya."
        },
        {
            soru: "2️⃣ Karar insan hayatını/hakkını etkiliyor mu? (işe alım, kredi, sağlık, hukuk)",
            detay: "Evet → 'Yüksek riskli' bölge: insan onayı zorunlu, bias ölçümü şart, model kartı yazılmalı.\nHayır → Sonraki soruya."
        },
        {
            soru: "3️⃣ Çıktılar kimliği belli kişileri taklit ediyor mu? (deepfake riski)",
            detay: "Evet → Rıza + içerik etiketleme (watermark) zorunlu. Yasadışı kullanım senaryolarını engelleyebilir misiniz?\nHayır → Sonraki soruya."
        },
        {
            soru: "4️⃣ Halüsinasyon zarar verebilir mi? (tıbbi/hukuki tavsiye)",
            detay: "Evet → RAG + kaynak gösterimi + 'bilmediğinde dur' eğitimi + gözden geçirme aşaması.\nHayır → Sonraki soruya."
        },
        {
            soru: "5️⃣ Kullanıcılar zarar görebilir mi? (çocuklar, kırılgan gruplar)",
            detay: "Evet → İçerik filtreleri, yaş kontrolü, güvenlik sınırları (guardrails) test edilmeli.\nHayır → İzleme planı + model kartı ile yayınlanabilir ✅"
        }
    ];

    function kutu(x, y, w, h, metin, renk, dolgu = "12") {
        ctx.fillStyle = renk + "18";
        ctx.strokeStyle = renk;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#e8eaf0";
        ctx.font = `bold ${dolgu}px Inter`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        // Metni sar
        const words = metin.split(" ");
        let line = "", lines = [];
        for (const word of words) {
            const t = line ? line + " " + word : word;
            if (ctx.measureText(t).width > w - 20) { lines.push(line); line = word; } else line = t;
        }
        if (line) lines.push(line);
        const lh = h / (lines.length + 1);
        lines.forEach((l, i) => ctx.fillText(l, x + w / 2, y + lh * (i + 1)));
    }

    function ok(x1, y1, x2, y2) {
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath(); ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 6, y2 - 10); ctx.lineTo(x2 + 6, y2 - 10);
        ctx.closePath(); ctx.fill();
    }

    function ciz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const A = ADIMLAR[adim];

        // Üstte önceki adımlar (soluk)
        ADIMLAR.forEach((a, i) => {
            if (i >= adim) return;
            ctx.globalAlpha = 0.25;
            const bw = Math.min(w * 0.75, 520);
            kutu((w - bw) / 2, 15 + i * 24, bw, 20, a.soru.replace(/^\d️⃣ /, "").slice(0, 45) + "...", "#64748b", "9");
            ctx.globalAlpha = 1;
        });

        // Aktif soru (büyük)
        const bw = Math.min(w * 0.85, 560), bh = 70;
        const bx = (w - bw) / 2, by = 20 + adim * 24 + 15;
        kutu(bx, by, bw, bh, A.soru, "#a855f7");

        // Detay paneli
        const dy = by + bh + 14;
        ctx.fillStyle = "rgba(255,255,255,0.03)";
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath(); ctx.roundRect(bx, dy, bw, 74, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#cbd0dd"; ctx.font = "11.5px Inter"; ctx.textAlign = "left";
        A.detay.split("\n").forEach((satir, i) => {
            // Satırı sar
            const words = satir.split(" ");
            let line = "", yy = dy + 18 + i * 34;
            let count = 0;
            for (const word of words) {
                const t = line ? line + " " + word : word;
                if (ctx.measureText(t).width > bw - 24) { ctx.fillText(line, bx + 12, yy); yy += 14; line = word; count++; } else line = t;
            }
            if (line) ctx.fillText(line, bx + 12, yy);
        });

        // Soru sayısı göstergesi
        ctx.fillStyle = ACCENT2; ctx.font = "bold 13px Inter"; ctx.textAlign = "center";
        ctx.fillText(`Değerlendirme: ${adim + 1} / ${ADIMLAR.length}`, w / 2, h - 14);
    }

    VizHelpers.adimKontrol("viz-etik", ADIMLAR.length, ciz);
    window.addEventListener("resize", () => ciz(0));
};
