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
        // Kutu içi yazılar kutu genişliğine sığdırılır
        VizHelpers.ortaYazi(ctx, baslik, x + w / 2, y + h / 2 - (alt ? 8 : 0), "#e8eaf0", 12, true, w - 8);
        if (alt) {
            VizHelpers.ortaYazi(ctx, alt, x + w / 2, y + h / 2 + 10, "#9aa0b4", 9.5, false, w - 8);
        }
    }

    // Dar ekran için dikey akış tanımları (kutu adı, alt yazı, renk)
    const DAR_ADIMLAR = {
        0: [["Prompt", "\"Kediler neden mırıldar?\"", "#3b82f6"],
            ["Cevap A ✓", "Detaylı, nazik, doğru", "#22c55e"],
            ["Cevap B ✗", "\"Bilmiyorum\"", "#ef4444"],
            ["👤 İnsan", "A'yı tercih etti", ACCENT],
            ["Tercih DB", "(prompt, A, B)", "#a855f7"]],
        1: [["Tercih Verisi", "Binlerce (chosen, rejected)", "#a855f7"],
            ["Ödül Modeli", "B-T kaybıyla eğit", ACCENT],
            ["Skor Üretici", "(prompt, cevap) → ℝ", "#3b82f6"],
            ["Hazır!", "İnsan zevkini taklit", "#22c55e"]],
        2: [["LLM (Politika)", "Cevap üretir", "#3b82f6"],
            ["Ödül Modeli", "Skor üretir", "#a855f7"],
            ["PPO Güncelleme", "Yüksek skoru teşvik et", ACCENT],
            ["⚖ KL Cezası", "SFT modelden sapmayı sınırla", "#f59e0b"]],
        3: [["Tercih Verisi", "(prompt, chosen, rejected)", "#a855f7"],
            ["DPO Kaybı", "chosen olasılığı > rejected", ACCENT],
            ["Hizalı LLM", "Ödül modeli olmadan!", "#22c55e"]],
    };

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

        if (w < 640) {
            // Dar ekran: kutular alt alta dizilir, oklarla bağlanır
            const bw = w - 28, bh = 38, bosluk = 12;
            const dugumler = DAR_ADIMLAR[adim] || [];
            let y = 42;
            dugumler.forEach(([b, alt, renk], i) => {
                kutu(14, y, bw, bh, renk + "22", renk, b, alt);
                if (i < dugumler.length - 1) {
                    ctx.strokeStyle = renk; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(14 + bw / 2, y + bh); ctx.lineTo(14 + bw / 2, y + bh + bosluk); ctx.stroke();
                    ctx.fillStyle = renk;
                    ctx.beginPath();
                    ctx.moveTo(14 + bw / 2, y + bh + bosluk);
                    ctx.lineTo(14 + bw / 2 - 5, y + bh + bosluk - 6);
                    ctx.lineTo(14 + bw / 2 + 5, y + bh + bosluk - 6);
                    ctx.closePath(); ctx.fill();
                }
                y += bh + bosluk;
            });
            if (adim === 3) VizHelpers.ortaYazi(ctx, "Daha az GPU, daha stabil, daha basit", w / 2, y + 4, ACCENT2, 11, true);
        } else if (adim === 0) {
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

        // Açıklama — HTML olarak sarılır (dar ekranda taşmaz)
        VizHelpers.altYazi("viz-rlhf", A.aciklama);
    }

    VizHelpers.adimKontrol("viz-rlhf", ADIMLAR.length, ciz);
};
