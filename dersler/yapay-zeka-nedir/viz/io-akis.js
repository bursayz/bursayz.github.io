// Yapay Zeka Nedir? — Input→Model→Output akış animasyonu (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-io-akis"] = function () {
    const mount = document.getElementById("viz-io-akis");
    if (!mount) return;
    const hv = VizHelpers.canvas2D("viz-io-akis", 0.52);
    if (!hv) return;

    const ADIMLAR = [
        { baslik: "1. Ham Girdi", aciklama: "Kullanıcıdan gelen veri — bir resim, bir cümle, bir ses kaydı..." },
        { baslik: "2. Ön İşleme", aciklama: "Veri sayılara dönüştürülür. Resimse piksel matrisi, metinse token dizisi olur." },
        { baslik: "3. Model İşler", aciklama: "Milyonlarca ağırlık (öğrenilmiş parametreler) girdi üzerinde hesaplamalar yapar." },
        { baslik: "4. Çıktı Üretilir", aciklama: "Model bir tahmin üretir: 'kedi', 'olumlu yorum', bir sonraki kelime..." },
        { baslik: "5. Değerlendirme", aciklama: "Çıktı, beklenen cevapla karşılaştırılır. Hata varsa ağırlıklar güncellenir (eğitim)." }
    ];

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    function ciz(adim) {
        const { ctx, w, h } = hv;
        ctx.clearRect(0, 0, w, h);

        const kutuW = Math.min(150, (w - 120) / 3);
        const kutuH = 80;
        const y = h * 0.35;
        const x1 = 20, x2 = (w - kutuW) / 2, x3 = w - kutuW - 20;

        // Kutular: Input / Model / Output
        const kutular = [
            { x: x1, label: "INPUT", sub: "Girdi veri", renk: "#3b82f6" },
            { x: x2, label: "MODEL", sub: "Ağırlıklar", renk: ACCENT },
            { x: x3, label: "OUTPUT", sub: "Tahmin", renk: "#f59e0b" }
        ];

        kutular.forEach((k, i) => {
            const aktif =
                (adim === 0 && i === 0) || (adim === 1 && i === 0) ||
                (adim === 2 && i === 1) || (adim === 3 && i === 2) || adim === 4;

            ctx.fillStyle = aktif ? k.renk + "22" : "rgba(255,255,255,0.03)";
            ctx.strokeStyle = aktif ? k.renk : "rgba(255,255,255,0.12)";
            ctx.lineWidth = aktif ? 2 : 1;

            // Yuvarlatılmış dikdörtgen
            const r = 10;
            ctx.beginPath();
            ctx.roundRect(k.x, y, kutuW, kutuH, r);
            ctx.fill(); ctx.stroke();

            VizHelpers.ortaYazi(ctx, k.label, k.x + kutuW / 2, y + 30, aktif ? k.renk : "#666", 13, true);
            VizHelpers.ortaYazi(ctx, k.sub, k.x + kutuW / 2, y + 52, "#9aa0b4", 11);
        });

        // Oklar
        const okY = y + kutuH / 2;
        [[x1 + kutuW, x2 - 4], [x2 + kutuW, x3 - 4]].forEach(([from, to], i) => {
            const aktif = adim >= (i === 0 ? 1 : 2);
            ctx.strokeStyle = aktif ? ACCENT : "rgba(255,255,255,0.15)";
            ctx.lineWidth = aktif ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(from, okY);
            ctx.lineTo(to, okY);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(to, okY);
            ctx.lineTo(to - 7, okY - 5);
            ctx.lineTo(to - 7, okY + 5);
            ctx.closePath();
            ctx.fillStyle = aktif ? ACCENT : "rgba(255,255,255,0.15)";
            ctx.fill();
        });

        // Adım başlığı ve açıklaması
        VizHelpers.ortaYazi(ctx, ADIMLAR[adim].baslik, w / 2, y - 30, ACCENT2, 16, true);
        const aciklama = ADIMLAR[adim].aciklama;
        // Uzun açıklamaları satırlara böl
        ctx.font = "500 12px Inter, sans-serif";
        ctx.fillStyle = "#9aa0b4";
        ctx.textAlign = "center";
        const kelimeler = aciklama.split(" ");
        let satir = "", satirY = y + kutuH + 35;
        for (const kelime of kelimeler) {
            const deneme = satir ? satir + " " + kelime : kelime;
            if (ctx.measureText(deneme).width > w - 60) {
                ctx.fillText(satir, w / 2, satirY);
                satir = kelime; satirY += 18;
            } else satir = deneme;
        }
        if (satir) ctx.fillText(satir, w / 2, satirY);
    }

    VizHelpers.adimKontrol("viz-io-akis", ADIMLAR.length, ciz);
};
