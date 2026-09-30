// Sansürsüzleştirme — Aktivasyon uzayında red yönü ve abliteration (2D canvas)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-abliteration"] = function () {
    const hv = VizHelpers.canvas2D("viz-abliteration", 0.62);
    if (!hv) return;
    const { ctx } = hv;

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    const ADIMLAR = [
        {
            baslik: "Aktivasyon Uzayı: Zararlı vs Zararsız",
            aciklama: "Her prompt'u modele verdiğinizde, belirli bir katmandaki aktivasyon vektörü hesaplanır. Zararlı ve zararsız prompt'lar genellikle uzayda farklı bölgelerde kümelenir."
        },
        {
            baslik: "Red Yönü Hesabı (Difference-of-Means)",
            aciklama: "Zararlı prompt'ların ortalama aktivasyonu ile zararsızlarınki arasındaki fark vektörü, red davranışını temsil eden yönü verir. Bu yön, modele 'hayır' deme kapasitesinin yönüdür."
        },
        {
            baslik: "Abliteration: Yön Çıkarma",
            aciklama: "Ağırlık matrisleri bu yönde projeksiyonlanarak kırpılır (orthogonalization). Artık model bu yönde aktivasyon üretemez — red mekanizması ortadan kalkar."
        },
        {
            baslik: "Yetenek Kaybı Riski",
            aciklama: "Ancak red yönü, modelin genel yetenekleriyle kesişebilir. Agresif çıkarma, 'beni de unutur' riski taşır. İşte bu yüzden norm-preserving biprojection ve DPO telafisi gereklidir."
        }
    ];

    function nokta(x, y, renk, r = 5) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = renk;
        ctx.fill();
    }

    function vektor(x1, y1, x2, y2, renk, kalinlik = 3, ok = true) {
        ctx.strokeStyle = renk;
        ctx.lineWidth = kalinlik;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        if (ok) {
            const a = Math.atan2(y2 - y1, x2 - x1);
            ctx.fillStyle = renk;
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4));
            ctx.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4));
            ctx.closePath();
            ctx.fill();
        }
    }

    function ciz(adim) {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const A = ADIMLAR[adim];
        VizHelpers.ortaYazi(ctx, A.baslik, w / 2, 20, ACCENT2, 14, true);

        const cx = w / 2, cy = h * 0.45;
        const spread = Math.min(w * 0.22, 100);

        // Koordinat ekseni (silik)
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - w*0.35, cy); ctx.lineTo(cx + w*0.35, cy);
        ctx.moveTo(cx, cy - h*0.25); ctx.lineTo(cx, cy + h*0.25);
        ctx.stroke();

        // Zararsız küme (yeşil tonları - mevcut pozitif renk)
        const zx = cx - spread, zy = cy + 20;
        const zararsizNoktalar = [
            [zx-25, zy-15], [zx, zy-25], [zx+20, zy-10], [zx-10, zy+10], [zx+15, zy+20], [zx-30, zy+15]
        ];
        zararsizNoktalar.forEach(([x, y]) => nokta(x, y, "#56a605", 6));
        
        // Zararsız ortalama
        const zAvgX = zararsizNoktalar.reduce((a,b)=>a+b[0],0)/zararsizNoktalar.length;
        const zAvgY = zararsizNoktalar.reduce((a,b)=>a+b[1],0)/zararsizNoktalar.length;
        nokta(zAvgX, zAvgY, "#8fd94a", 8);
        ctx.beginPath();
        ctx.arc(zAvgX, zAvgY, 12, 0, Math.PI*2);
        ctx.strokeStyle = "#8fd94a";
        ctx.setLineDash([4,4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Zararlı küme (kırmızı tonları - accent)
        const zararliX = cx + spread, zararliY = cy - 20;
        const zararliNoktalar = [
            [zararliX-20, zararliY-15], [zararliX+15, zararliY-20], [zararliX+30, zararliY+10], [zararliX-10, zararliY+15], [zararliX+25, zararliY-5], [zararliX, zararliY+25]
        ];
        zararliNoktalar.forEach(([x, y]) => nokta(x, y, ACCENT, 6));
        
        // Zararlı ortalama
        const zarAvgX = zararliNoktalar.reduce((a,b)=>a+b[0],0)/zararliNoktalar.length;
        const zarAvgY = zararliNoktalar.reduce((a,b)=>a+b[1],0)/zararliNoktalar.length;
        nokta(zarAvgX, zarAvgY, ACCENT2, 8);
        ctx.beginPath();
        ctx.arc(zarAvgX, zarAvgY, 12, 0, Math.PI*2);
        ctx.strokeStyle = ACCENT2;
        ctx.setLineDash([4,4]);
        ctx.stroke();
        ctx.setLineDash([]);

        if (adim === 0) {
            // Sadece kümeleri göster
            VizHelpers.ortaYazi(ctx, "Zararsız prompt'lar", zx, zy + 45, "#8fd94a", 12, true);
            VizHelpers.ortaYazi(ctx, "Zararlı prompt'lar", zararliX, zararliY - 40, ACCENT, 12, true);
        } 
        else if (adim === 1) {
            // Difference of means vektörü
            vektor(zAvgX, zAvgY, zarAvgX, zarAvgY, "#f59e0b", 3, true);
            const midX = (zAvgX + zarAvgX) / 2;
            const midY = (zAvgY + zarAvgY) / 2;
            VizHelpers.ortaYazi(ctx, "r = μ_harmful - μ_harmless", midX, midY - 20, "#f59e0b", 12, true);
            VizHelpers.ortaYazi(ctx, "Red Yönü (Refusal Direction)", midX, midY + 25, "#f59e0b", 13, true);
        }
        else if (adim === 2) {
            // Abliteration sonrası: yön kısa kaldı (simülasyon)
            const yeniX = zAvgX + (zarAvgX - zAvgX) * 0.15;
            const yeniY = zAvgY + (zarAvgY - zAvgY) * 0.15;
            vektor(zAvgX, zAvgY, yeniX, yeniY, "rgba(239,68,68,0.4)", 2, true);
            
            // Orijinal silik vektör
            vektor(zAvgX, zAvgY, zarAvgX, zarAvgY, "rgba(156,163,175,0.3)", 1, true);
            
            // Projeksiyon düzlemi simülasyonu (dikey çizgi)
            const dirX = (zarAvgX - zAvgX);
            const dirY = (zarAvgY - zAvgY);
            const len = Math.sqrt(dirX*dirX + dirY*dirY);
            const nx = dirX/len, ny = dirY/len;
            const perpX = -ny, perpY = nx;
            const plen = Math.min(w*0.3, 120);
            
            ctx.strokeStyle = "rgba(239,68,68,0.5)";
            ctx.setLineDash([5,5]);
            ctx.beginPath();
            ctx.moveTo(zAvgX - perpX*plen, zAvgY - perpY*plen);
            ctx.lineTo(zAvgX + perpX*plen, zAvgY + perpY*plen);
            ctx.stroke();
            ctx.setLineDash([]);
            
            VizHelpers.ortaYazi(ctx, "Projeksiyon düzlemi", zAvgX + perpX*60, zAvgY + perpY*60, ACCENT, 11);
            VizHelpers.ortaYazi(ctx, "Yön kısalıyor (abliteration)", cx, cy + h*0.22, ACCENT2, 12, true);
        }
        else {
            // Yetenek kaybı gösterimi: bozulma
            vektor(zAvgX, zAvgY, zarAvgX, zarAvgY, "rgba(239,68,68,0.6)", 3, true);
            
            // Rastgele "bozulma" vektörleri
            for(let i=0; i<6; i++) {
                const ang = (i/6)*Math.PI*2 + (Date.now()/1000);
                const sx = zarAvgX + Math.cos(ang)*30;
                const sy = zarAvgY + Math.sin(ang)*30;
                vektor(zarAvgX, zarAvgY, sx, sy, "rgba(245,158,11,0.4)", 1, false);
            }
            
            VizHelpers.ortaYazi(ctx, "! Yetenek kaybı riski", zararliX, zararliY + 50, "#f59e0b", 13, true);
            VizHelpers.ortaYazi(ctx, "Genel yeteneklerle kesişim", cx, cy + h*0.22, "#9aa0b4", 11);
        }

        // Açıklama metni
        ctx.fillStyle = "#9aa0b4"; 
        ctx.font = "12px Inter"; 
        ctx.textAlign = "center";
        const words = A.aciklama.split(" ");
        let line = "", lines = [];
        for (const word of words) {
            const t = line ? line + " " + word : word;
            if (ctx.measureText(t).width > w - 60) { lines.push(line); line = word; } else line = t;
        }
        lines.push(line);
        lines.forEach((l, i) => ctx.fillText(l, w / 2, h - 35 + i * 17 - (lines.length - 1) * 17));
    }

    // Animasyon için tick (sadece yetenek kaybı adımında)
    setInterval(() => {
        const secili = document.querySelector("#viz-abliteration")?.closest(".viz-kutu")?.querySelector("span")?.textContent;
        if (secili && secili.includes("4/4")) ciz(3);
    }, 150);

    VizHelpers.adimKontrol("viz-abliteration", ADIMLAR.length, ciz);
};
