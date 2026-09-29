// RLHF/DPO — Tercih → Ödül → Politika döngüsü (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-rlhf"] = function () {
    const hv = VizHelpers.canvas2D("viz-rlhf", 0.55);
    if (!hv) return;
    const { ctx } = hv;

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    const ADIMLAR = [
        {
            no: 0, baslik: "Aşama 1: Tercih Verisi Toplama",
            aciklama: "Aynı prompt için model 2 cevap üretir. İnsan: 'Cevap A daha iyi' der. Binlerce çift toplanır."
        },
        {
            no: 1, baslik: "Aşama 2: Ödül Modeli Eğitimi",
            aciklama: "Tercih verisiyle bir 'skorlayıcı model' eğitilir: (prompt, cevap) → skor. Amaç: insan zevkini taklit etmek."
        },
        {
            no: 2, baslik: "Aşama 3a: PPO ile Politika Güncelleme (RLHF)",
            aciklama: "LLM cevap üret → ödül modeli puan ver → yüksek skoru teşvik et. KL cezası modelin 'sapmasını' sınırlar."
        },
        {
            no: 3, baslik: "Aşama 3b: DPO Alternatifi (daha basit)",
            aciklama: "Ödül modeli olmadan: tercih çiftlerinden doğrudan LLM güncellenir. Daha küçük, daha stabil, yeni standart."
        }
    ];

    function kutu(x, y, w, h, bg, border, baslik, alt) {
        ctx.fillStyle = bg; ctx.strokeStyle = border; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(x, y, w, h, 9); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#e8eaf0"; ctx.font = "bold 12px Inter"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(baslik, x + w / 2, y + h / 2 - (alt ? 8 : 0));
        if (alt) {
            ctx.fillStyle = "#9aa0b4"; ctx.font = "9.5px Inter";
            ctx.fillText(alt, x + w / 2, y + h / 2 + 10);
        }
    }

    function ok(x1, y1, x2, y2, renk = "rgba(255,255,255,0.4)") {
        ctx.strokeStyle = renk; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        const a = Math.atan2(y2 - y1, x2 - x1);
        ctx.fillStyle = renk;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - 7 * Math.cos(a - 0.4), y2 - 7 * Math.sin(a - 0.4));
        ctx.lineTo(x2 - 7 * Math.cos(a + 0.4), y2 - 7 * Math.sin(a + 0.4));
        ctx.closePath(); ctx.fill();
    }

    function ciz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const A = ADIMLAR[adim];
        VizHelpers.ortaYazi(ctx, A.baslik, w / 2, 20, ACCENT2, 14, true);

        const cy = h * 0.45;
        const kw = Math.min(140, w * 0.22), kh = 64;

        if (adim === 0) {
            // Tercih toplama
            kutu(w * 0.05, cy - 70, kw, kh, "#3b82f622", "#3b82f6", "Prompt", "\"Kediler neden mırıldar?\"");
            ok(w * 0.05 + kw, cy - 38, w * 0.32, cy - 65);
            kutu(w * 0.32, cy - 95, kw, kh, "#22c55e18", "#22c55e", "Cevap A ✓", "Detaylı, nazik, doğru");
            ok(w * 0.05 + kw, cy - 38, w * 0.32, cy + 15);
            kutu(w * 0.32, cy + 5, kw, kh, "#ef444418", "#ef4444", "Cevap B ✗", "\"Bilmiyorum\"");
            ok(w * 0.32 + kw, cy - 65, w * 0.60, cy - 25);
            ok(w * 0.32 + kw, cy + 35, w * 0.60, cy - 10);
            kutu(w * 0.60, cy - 55, kw, kh, ACCENT + "18", ACCENT, "👤 İnsan", "A'yı tercih etti");
            ok(w * 0.60 + kw, cy - 25, w * 0.88, cy - 25);
            kutu(w * 0.88 - 10, cy - 55, kw, kh, "#a855f722", "#a855f7", "Tercih DB", "(prompt, A, B)");
        } else if (adim === 1) {
            // Ödül modeli
            kutu(w * 0.05, cy - 30, kw, kh, "#a855f722", "#a855f7", "Tercih Verisi", "Binlerce (chosen, rejected)");
            ok(w * 0.05 + kw, cy, w * 0.32, cy);
            kutu(w * 0.32, cy - 30, kw, kh, ACCENT + "22", ACCENT, "Ödül Modeli", "B-T kaybıyla eğit");
            ok(w * 0.32 + kw, cy, w * 0.60, cy);
            kutu(w * 0.60, cy - 30, kw, kh, "#3b82f622", "#3b82f6", "Skor Üretici", "(prompt, cevap) → ℝ");
            ok(w * 0.60 + kw, cy, w * 0.85, cy);
            kutu(w * 0.85 - 8, cy - 30, kw, kh, "#22c55e22", "#22c55e", "Hazır!", "İnsan zevkini taklit");
        } else if (adim === 2) {
            // PPO döngüsü
            kutu(w * 0.08, cy - 95, kw, 56, "#3b82f622", "#3b82f6", "LLM (Politika)", "Cevap üretir");
            ok(w * 0.08 + kw, cy - 67, w * 0.35, cy - 67);
            kutu(w * 0.35, cy - 95, kw, 56, "#a855f722", "#a855f7", "Ödül Modeli", "Skor üretir");
            ok(w * 0.35 + kw, cy - 67, w * 0.62, cy - 67);
            kutu(w * 0.62, cy - 95, kw, 56, ACCENT + "22", ACCENT, "PPO Güncelleme", "Yüksek skoru teşvik et");
            // Geri besleme oku
            ok(w * 0.62 + kw / 2, cy - 39, w * 0.08 + kw / 2, cy - 39, ACCENT);
            VizHelpers.ortaYazi(ctx, "Politika güncellenir", w / 2, cy - 45, ACCENT2, 10);
            // KL cezası
            kutu(w * 0.30, cy + 20, kw * 1.2, 50, "#f59e0b18", "#f59e0b", "⚖ KL Cezası", "Referans (SFT) modelden sapmayı sınırla");
            ok(w * 0.30 + kw * 0.6, cy + 20, w * 0.08 + kw / 2, cy - 39, "#f59e0b");
        } else {
            // DPO
            kutu(w * 0.08, cy - 30, kw, kh, "#a855f722", "#a855f7", "Tercih Verisi", "(prompt, chosen, rejected)");
            ok(w * 0.08 + kw, cy, w * 0.35, cy);
            kutu(w * 0.35, cy - 30, kw, kh, ACCENT + "22", ACCENT, "DPO Kaybı", "chosen olasılığı > rejected");
            ok(w * 0.35 + kw, cy, w * 0.62, cy);
            kutu(w * 0.62, cy - 30, kw, kh, "#22c55e22", "#22c55e", "Hizalı LLM", "Ödül modeli olmadan!");
            VizHelpers.ortaYazi(ctx, "Daha az GPU, daha stabil, daha basit", w / 2, cy + 55, ACCENT2, 12, true);
        }

        // Açıklama
        ctx.fillStyle = "#9aa0b4"; ctx.font = "12px Inter"; ctx.textAlign = "center";
        const words = A.aciklama.split(" ");
        let line = "", lines = [];
        for (const word of words) {
            const t = line ? line + " " + word : word;
            if (ctx.measureText(t).width > w - 60) { lines.push(line); line = word; } else line = t;
        }
        lines.push(line);
        lines.forEach((l, i) => ctx.fillText(l, w / 2, h - 22 + i * 17 - (lines.length - 1) * 17));
    }

    VizHelpers.adimKontrol("viz-rlhf", ADIMLAR.length, ciz);
};
