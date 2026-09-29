// Python Temelleri — Adım adım kod yürütme simülasyonu
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-kod-adim"] = function () {
    const hv = VizHelpers.canvas2D("viz-kod-adim", 0.55);
    if (!hv) return;

    const SATIRLAR = [
        "puanlar = [85, 92, 78]",
        "toplam = 0",
        "for p in puanlar:",
        "    toplam += p",
        "ortalama = toplam / 3",
        "print(ortalama)"
    ];

    const DEGISKENLER = [
        { adim: 0, satir: 0, degiskenler: {}, cikti: "", aciklama: "Başlangıç — hiçbir değişken yok." },
        { adim: 1, satir: 0, degiskenler: { puanlar: "[85, 92, 78]" }, cikti: "", aciklama: "puanlar listesi oluşturuldu." },
        { adim: 2, satir: 1, degiskenler: { puanlar: "[85, 92, 78]", toplam: "0" }, aciklama: "toplam = 0 olarak başlatıldı." },
        { adim: 3, satir: 2, degiskenler: { puanlar: "[85, 92, 78]", toplam: "0", p: "85" }, aciklama: "Döngü başladı: p = puanlar[0] = 85." },
        { adim: 4, satir: 3, degiskenler: { puanlar: "[85, 92, 78]", toplam: "85", p: "85" }, aciklama: "toplam += 85 → toplam artık 85." },
        { adim: 5, satir: 2, degiskenler: { puanlar: "[85, 92, 78]", toplam: "85", p: "92" }, aciklama: "Döngü 2. tur: p = 92." },
        { adim: 6, satir: 3, degiskenler: { puanlar: "[85, 92, 78]", toplam: "177", p: "92" }, aciklama: "toplam += 92 → toplam artık 177." },
        { adim: 7, satir: 2, degiskenler: { puanlar: "[85, 92, 78]", toplam: "177", p: "78" }, aciklama: "Döngü 3. tur: p = 78." },
        { adim: 8, satir: 3, degiskenler: { puanlar: "[85, 92, 78]", toplam: "255", p: "78" }, aciklama: "toplam += 78 → toplam artık 255." },
        { adim: 9, satir: 4, degiskenler: { puanlar: "[85, 92, 78]", toplam: "255", p: "78", ortalama: "85.0" }, aciklama: "ortalama = 255 / 3 = 85.0" },
        { adim: 10, satir: 5, degiskenler: { puanlar: "[85, 92, 78]", toplam: "255", ortalama: "85.0" }, cikti: "85.0", aciklama: "print(ortalama) → ekrana '85.0' yazıldı. Program bitti." }
    ];

    function ciz(adimIdx) {
        const { ctx, w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const s = DEGISKENLER[adimIdx];
        const ACCENT = VizHelpers.accentRenk();
        const ACCENT2 = VizHelpers.accent2();

        // Sol panel: kod satırları
        const kodW = Math.min(w * 0.52, 320);
        ctx.font = "13px 'JetBrains Mono', monospace";
        ctx.textAlign = "left";

        SATIRLAR.forEach((satir, i) => {
            const y = 30 + i * 26;
            const aktif = i === s.satir;
            if (aktif) {
                ctx.fillStyle = "rgba(86,166,5,0.15)";
                ctx.fillRect(10, y - 14, kodW - 20, 22);
                ctx.fillStyle = ACCENT;
                ctx.fillText("▶", 16, y);
            }
            ctx.fillStyle = aktif ? ACCENT2 : "#9aa0b4";
            const girinti = satir.startsWith(" ") ? 20 : 0;
            ctx.fillText(satir.trim(), 30 + girinti, y);
        });

        // Sağ panel: değişkenler ve çıktı
        const sagX = kodW + 20;
        VizHelpers.ortaYazi(ctx, "Bellek (Değişkenler)", sagX + (w - sagX) / 2 - 10, 22, ACCENT2, 12, true);

        let vY = 48;
        for (const [ad, deger] of Object.entries(s.degiskenler)) {
            ctx.fillStyle = "rgba(255,255,255,0.04)";
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.beginPath(); ctx.roundRect(sagX, vY - 15, w - sagX - 20, 24, 6); ctx.fill(); ctx.stroke();
            ctx.font = "12px 'JetBrains Mono', monospace";
            ctx.fillStyle = "#c792ea"; ctx.textAlign = "left";
            ctx.fillText(ad, sagX + 10, vY);
            ctx.fillStyle = "#c3e88d";
            ctx.fillText("= " + deger, sagX + 10 + ctx.measureText(ad).width + 8, vY);
            vY += 30;
        }

        if (s.cikti) {
            vY += 14;
            VizHelpers.ortaYazi(ctx, "Çıktı:", sagX + (w - sagX) / 2 - 10, vY, "#93c5fd", 11, true);
            ctx.fillStyle = "rgba(59,130,246,0.1)";
            ctx.strokeStyle = "rgba(59,130,246,0.3)";
            ctx.beginPath(); ctx.roundRect(sagX, vY + 8, w - sagX - 20, 28, 6); ctx.fill(); ctx.stroke();
            ctx.fillStyle = "#93c5fd";
            ctx.font = "13px 'JetBrains Mono', monospace";
            ctx.textAlign = "center";
            ctx.fillText(s.cikti, sagX + (w - sagX) / 2 - 10, vY + 26);
        }

        // Açıklama
        ctx.font = "12px Inter, sans-serif";
        ctx.fillStyle = "#9aa0b4";
        ctx.textAlign = "center";
        const words = s.aciklama.split(" ");
        let line = "", ly = h - 16;
        const lines = [];
        for (const word of words) {
            const test = line ? line + " " + word : word;
            if (ctx.measureText(test).width > w - 60) { lines.push(line); line = word; } else line = test;
        }
        if (line) lines.push(line);
        lines.forEach((l, i) => ctx.fillText(l, w / 2, ly - (lines.length - 1 - i) * 16));
    }

    VizHelpers.adimKontrol("viz-kod-adim", DEGISKENLER.length, ciz);
};
