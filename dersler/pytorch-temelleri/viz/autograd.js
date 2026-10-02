// PyTorch — Autograd hesap grafiği animasyonu
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-autograd"] = function () {
    const hv = VizHelpers.canvas2D("viz-autograd", 0.5);
    if (!hv) return;
    const { ctx } = hv;

    // Hesap grafiği: y = (x1 * w1) + (x2 * w2) + b → loss
    const duzumler = [
        { id: "x1", label: "x₁ = 2", x: 0.1, y: 0.2, renk: "#3b82f6" },
        { id: "w1", label: "w₁ = 0.5", x: 0.1, y: 0.55, renk: "#3b82f6" },
        { id: "mul1", label: "x₁·w₁ = 1", x: 0.32, y: 0.37, renk: "#f59e0b", islem: "×" },
        { id: "x2", label: "x₂ = 3", x: 0.1, y: 0.75, renk: "#3b82f6" },
        { id: "w2", label: "w₂ = 0.3", x: 0.1, y: 0.92, renk: "#3b82f6" },
        { id: "mul2", label: "x₂·w₂ = 0.9", x: 0.32, y: 0.72, renk: "#f59e0b", islem: "×" },
        { id: "b", label: "b = 0.1", x: 0.1, y: 0.44, renk: "#3b82f6" },
        { id: "add", label: "z = 2.0", x: 0.55, y: 0.54, renk: "#a855f7", islem: "+" },
        { id: "relu", label: "a = max(0,z) = 2.0", x: 0.75, y: 0.54, renk: "#56a605", islem: "ReLU" },
        { id: "loss", label: "loss = (a - hedef)²", x: 0.92, y: 0.54, renk: "#ef4444", islem: "loss" }
    ];

    const kenarlar = [
        ["x1", "mul1"], ["w1", "mul1"],
        ["x2", "mul2"], ["w2", "mul2"],
        ["mul1", "add"], ["mul2", "add"], ["b", "add"],
        ["add", "relu"], ["relu", "loss"]
    ];

    const ADIMLAR = [
        { aciklama: "İleri yayılım: değerler soldan sağa akar. Her düğüm (düğüm) bir işlem veya değeri temsil eder.", dalga: [0, 1, 2] },
        { aciklama: "backward() çağrıldığında: loss'tan başlayarak zincir kuralı uygulanır. Her kenar için yerel türev hesaplanır.", dalga: [3, 5] },
        { aciklama: "Gradyanlar sağdan sola yayılır. x₁'in gradyanı ∂loss/∂x₁ hesaplanır. Sonunda her parametrenin (w₁, w₂, b) gradyanı hazırdır.", dalga: [6, 8] },
        { aciklama: "optimizer.step() ile her parametre gradyanının tersi yönünde küçük adım atar: w ← w - lr·∂loss/∂w. Hata azalır.", dalga: [9] }
    ];

    let animT = 0;
    let adimIdx = 0;

    function bul(id) {
        return duzumler.find(d => d.id === id);
    }

    function ciz(adim) {
        adimIdx = adim;
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const acc = VizHelpers.accentRenk();
        const acc2 = VizHelpers.accent2();

        // Kenar boşluğu payı: düğüm ve etiketler canvas'a sığsın
        const NX = v => (0.07 + v * 0.86) * w;
        const NY = v => (0.14 + v * 0.7) * h;

        // Kenarlar (bağlantılar)
        kenarlar.forEach(([fromId, toId]) => {
            const from = bul(fromId), to = bul(toId);
            const fx = NX(from.x), fy = NY(from.y);
            const tx = NX(to.x), ty = NY(to.y);
            const aktif = ADIMLAR[adim].dalga.some(v => kenarlar.indexOf([fromId, toId]) >= 0 || true);
            ctx.strokeStyle = "rgba(255,255,255,0.18)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            // Ok ucu
            const angle = Math.atan2(ty - fy, tx - fx);
            const okX = tx - 22 * Math.cos(angle), okY = ty - 22 * Math.sin(angle);
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.beginPath();
            ctx.moveTo(okX, okY);
            ctx.lineTo(okX - 7 * Math.cos(angle - 0.4), okY - 7 * Math.sin(angle - 0.4));
            ctx.lineTo(okX - 7 * Math.cos(angle + 0.4), okY - 7 * Math.sin(angle + 0.4));
            ctx.closePath(); ctx.fill();
        });

        // Düğümler
        duzumler.forEach(d => {
            const x = NX(d.x), y = NY(d.y);
            const r = 20;
            const aktif = (adim >= 1 && ["w1", "w2", "b"].includes(d.id)) || adim === 0;
            ctx.fillStyle = d.renk + "33";
            ctx.strokeStyle = aktif ? d.renk : d.renk + "66";
            ctx.lineWidth = aktif ? 2 : 1;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            if (d.islem && d.islem.length <= 4) {
                ctx.fillStyle = d.renk;
                ctx.font = "bold 9px Inter, sans-serif";
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText(d.islem, x, y);
            } else {
                ctx.fillStyle = "#e8eaf0";
                ctx.font = "9px Inter, sans-serif";
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText(d.id, x, y);
            }
            // Etiket: canvas kenarına taşarsa font otomatik küçülür
            VizHelpers.ortaYazi(ctx, d.label, x, y + r + 12, d.renk, 10, false, 96);
        });

        // Açıklama
        ctx.font = "12px Inter, sans-serif";
        ctx.fillStyle = "#9aa0b4"; ctx.textAlign = "center";
        const aciklama = ADIMLAR[adim].aciklama;
        const words = aciklama.split(" ");
        let line = "", ly = h - 8;
        const lines = [];
        for (const word of words) {
            const test = line ? line + " " + word : word;
            if (ctx.measureText(test).width > w - 60) { lines.push(line); line = word; } else line = test;
        }
        if (line) lines.push(line);
        lines.slice(0, 2).forEach((l, i) => ctx.fillText(l, w / 2, ly - (lines.length - 1 - i + Math.max(0, lines.length - 2)) * 15));
    }

    VizHelpers.adimKontrol("viz-autograd", ADIMLAR.length, ciz);
};
