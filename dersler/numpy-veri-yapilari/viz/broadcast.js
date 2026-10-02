// NumPy — Broadcasting animasyonu
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-broadcast"] = function () {
    const hv = VizHelpers.canvas2D("viz-broadcast", 0.55);
    if (!hv) return;

    const MATRIS = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
    const VADD = 10;

    // Adımlar: hangi hücreler "işleniyor"
    const ADIMLAR = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) ADIMLAR.push({ i, j });

    const ACCENT = VizHelpers.accentRenk();

    function ciz(adim) {
        const { ctx, w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const { i: curI, j: curJ } = ADIMLAR[Math.min(adim, ADIMLAR.length - 1)];

        // Hücre boyutu canvas genişliğine göre ölçeklenir (mobilde taşmaz)
        const bosluk = 40;                       // iki matris arasındaki ok payı
        const hucW = Math.max(26, Math.min(60, Math.floor((w - 20 - bosluk) / 6)));
        const hucH = Math.round(hucW * 0.84);
        const matrisGen = hucW * 3;
        const basX = Math.max(6, (w - (matrisGen * 2 + bosluk)) / 2);
        const basY = Math.max(38, Math.round((h - hucH * 3) / 2) - 6);
        const matrisX = basX, sonucX = matrisX + matrisGen + bosluk;

        // Başlıklar
        VizHelpers.ortaYazi(ctx, "Girdi Matrisi", matrisX + hucW * 1.5, basY - 20, "#93c5fd", 12, true);
        VizHelpers.ortaYazi(ctx, "+ broadcast (" + VADD + ")", w / 2, basY - 20, ACCENT, 12, true);
        VizHelpers.ortaYazi(ctx, "Sonuç", sonucX + hucW * 1.5, basY - 20, "#f59e0b", 12, true);

        // Matris çizimi
        function matrisCiz(mat, x, y, aktifI, aktifJ, degerler) {
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const px = x + j * hucW;
                    const py = y + i * hucH;
                    const aktif = i === aktifI && j === aktifJ;
                    ctx.fillStyle = aktif ? "rgba(86,166,5,0.25)" : "rgba(255,255,255,0.03)";
                    ctx.strokeStyle = aktif ? ACCENT : "rgba(255,255,255,0.12)";
                    ctx.lineWidth = aktif ? 2 : 1;
                    ctx.beginPath(); ctx.roundRect(px, py, hucW - 4, hucH - 4, 6); ctx.fill(); ctx.stroke();
                    const v = degerler ? degerler[i][j] : mat[i][j];
                    VizHelpers.ortaYazi(ctx, String(v), px + (hucW - 4) / 2, py + (hucH - 4) / 2, aktif ? ACCENT : "#cbd0dd", 14, aktif);
                }
            }
        }

        matrisCiz(MATRIS, matrisX, basY, curI, curJ, null);

        // "+10" işlemi gösterimi
        const opX = matrisX + hucW * 3 + 12;
        VizHelpers.ortaYazi(ctx, "+" + VADD, opX + 15, basY + curI * hucH + (hucH - 4) / 2, ACCENT, 16, true);

        // Ok
        const okY = basY + curI * hucH + (hucH - 4) / 2;
        const okBas = matrisX + hucW * 3;
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(okBas, okY); ctx.lineTo(okBas + 28, okY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(okBas + 28, okY); ctx.lineTo(okBas + 22, okY - 5); ctx.lineTo(okBas + 22, okY + 5); ctx.closePath();
        ctx.fillStyle = ACCENT; ctx.fill();

        // Sonuç matrisi — o adıma kadar işlenen hücreler doldurulmuş
        const sonuc = MATRIS.map((row, i) => row.map((v, j) => {
            const idx = ADIMLAR.findIndex(a => a.i === i && a.j === j);
            return idx <= adim ? v + VADD : "?";
        }));
        matrisCiz(sonuc, sonucX, basY, curI, curJ, sonuc);

        // Açıklama — uzun metin HTML olarak (dar ekranda satır satır sarılır)
        VizHelpers.altYazi("viz-broadcast",
            `Adım ${adim + 1}/9: matris[${curI}][${curJ}] = ${MATRIS[curI][curJ]} + ${VADD} = ${MATRIS[curI][curJ] + VADD}. NumPy, '${VADD}' sayısını matrişin her elemanına otomatik uygular.`);
    }

    VizHelpers.adimKontrol("viz-broadcast", ADIMLAR.length, ciz);
};
