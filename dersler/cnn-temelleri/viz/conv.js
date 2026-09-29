// CNN Temelleri — 2D convolution canlı simülasyonu
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-conv"] = function () {
    const hv = VizHelpers.canvas2D("viz-conv", 0.62);
    if (!hv) return;
    const { ctx } = hv;

    // 8x8 örnek resim: kedi yüzü silueti benzeri
    const RESIM = [
        [10, 10, 10, 200, 200, 10, 10, 10],
        [10, 200, 10, 200, 200, 10, 200, 10],
        [10, 10, 10, 200, 200, 10, 10, 10],
        [10, 10, 200, 200, 200, 200, 10, 10],
        [10, 10, 200, 10, 10, 200, 10, 10],
        [10, 10, 200, 200, 200, 200, 10, 10],
        [10, 10, 10, 10, 10, 10, 10, 10],
        [10, 10, 10, 10, 10, 10, 10, 10]
    ];
    const N = 8;

    const FILTRELER = {
        "Dikey Kenar (Sobel)": [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]],
        "Bulanıklaştırma": [[1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9], [1 / 9, 1 / 9, 1 / 9]],
        "Keskinleştirme": [[0, -1, 0], [-1, 5, -1], [0, -1, 0]],
        "Kimlik (identity)": [[0, 0, 0], [0, 1, 0], [0, 0, 0]]
    };

    let filtreAdi = "Dikey Kenar (Sobel)";
    let adim = 0;
    const maxAdim = (N - 2) * (N - 2); // 6x6 = 36 konum

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    // Filtre butonları
    const btnPanel = document.getElementById("conv-filtre-butonlari");
    Object.keys(FILTRELER).forEach(ad => {
        const b = VizHelpers._btn(ad);
        if (ad === filtreAdi) { b.style.background = ACCENT; b.style.color = "#0b0d14"; b.style.fontWeight = "700"; }
        b.onclick = () => { filtreAdi = ad; adim = 0; render(); guncelleSecili(); };
        b.dataset.filtre = ad;
        btnPanel.appendChild(b);
    });
    function guncelleSecili() {
        btnPanel.querySelectorAll("button").forEach(b => {
            const aktif = b.dataset.filtre === filtreAdi;
            b.style.background = aktif ? ACCENT : "rgba(255,255,255,0.06)";
            b.style.color = aktif ? "#0b0d14" : "var(--edu-text)";
            b.style.fontWeight = aktif ? "700" : "600";
        });
    }

    function uygulaKonvolusyon(p, q, kernel) {
        let toplam = 0;
        for (let i = 0; i < 3; i++)
            for (let j = 0; j < 3; j++)
                toplam += RESIM[p + i][q + j] * kernel[i][j];
        return toplam;
    }

    // Tüm konumları hesapla
    function hesaplaTum(kernel) {
        const sonuc = [];
        for (let p = 0; p < N - 2; p++) {
            const row = [];
            for (let q = 0; q < N - 2; q++) row.push(uygulaKonvolusyon(p, q, kernel));
            sonuc.push(row);
        }
        return sonuc;
    }

    function render() {
        const { w, h } = hv;
        ctx.clearRect(0, 0, w, h);
        const kernel = FILTRELER[filtreAdi];
        const sonuc = hesaplaTum(kernel);
        const p = Math.floor(adim / (N - 2));
        const q = adim % (N - 2);

        const cellK = Math.min(36, (w * 0.38) / N);
        const basX1 = 20, basY1 = 50;
        const basX2 = basX1 + N * cellK + 40;

        // Başlıklar
        VizHelpers.ortaYazi(ctx, "Girdi (8×8)", basX1 + N * cellK / 2, basY1 - 16, ACCENT2, 12, true);
        VizHelpers.ortaYazi(ctx, filtreAdi, basX2 + (N - 2) * cellK / 2, basY1 - 16, "#f59e0b", 12, true);
        VizHelpers.ortaYazi(ctx, `Konum: [${p}, ${q}]`, w / 2, h - 32, ACCENT2, 12, true);

        // Girdi resmi
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const v = RESIM[i][j] / 255;
                const inK = i >= p && i < p + 3 && j >= q && j < q + 3;
                ctx.fillStyle = `rgba(${Math.round(v * 200)}, ${Math.round(v * 230)}, ${Math.round(v * 100)}, 0.2 + v * 0.8)`;
                if (inK) ctx.fillStyle = ACCENT + Math.round(40 + v * 150).toString(16).padStart(2, "0");
                ctx.fillRect(basX1 + j * cellK, basY1 + i * cellK, cellK - 1, cellK - 1);
                ctx.fillStyle = inK ? ACCENT2 : "rgba(255,255,255,0.5)";
                ctx.font = `${Math.round(cellK * 0.32)}px 'JetBrains Mono', monospace`;
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText(String(Math.round(RESIM[i][j])), basX1 + j * cellK + cellK / 2, basY1 + i * cellK + cellK / 2);
            }
        }
        // Kernel çerçevesi
        ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2.5;
        ctx.strokeRect(basX1 + q * cellK - 1, basY1 + p * cellK - 1, cellK * 3 + 2, cellK * 3 + 2);

        // Çıktı (feature map)
        const minV = Math.min(...sonuc.flat());
        const maxV = Math.max(...sonuc.flat());
        for (let i = 0; i < N - 2; i++) {
            for (let j = 0; j < N - 2; j++) {
                const v = sonuc[i][j];
                const idx = i * (N - 2) + j;
                const aktif = idx <= adim;
                let renk;
                if (!aktif) renk = "rgba(255,255,255,0.03)";
                else {
                    const norm = (v - minV) / (maxV - minV || 1);
                    const r = Math.round(30 + norm * 220);
                    renk = `rgb(${r}, ${Math.round(60 + norm * 160)}, ${Math.round(60)})`;
                    if (v < 0 && Math.abs(v) > 20) renk = "rgba(239,68,68,0.4)";
                }
                ctx.fillStyle = renk;
                ctx.fillRect(basX2 + j * cellK, basY1 + i * cellK, cellK - 1, cellK - 1);
                if (idx === adim) {
                    ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2;
                    ctx.strokeRect(basX2 + j * cellK - 0.5, basY1 + i * cellK - 0.5, cellK, cellK);
                }
                if (aktif) {
                    ctx.fillStyle = "#e8eaf0";
                    ctx.font = `${Math.round(cellK * 0.3)}px 'JetBrains Mono', monospace`;
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText(String(Math.round(v)), basX2 + j * cellK + cellK / 2, basY1 + i * cellK + cellK / 2);
                }
            }
        }

        // Hesap detayı (aktif konum)
        const detY = basY1 + N * cellK + 16;
        const deger = sonuc[p][q];
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#9aa0b4"; ctx.textAlign = "center";
        ctx.fillText(
            `Çıktı[${p}][${q}] = Σ(bölge pikselleri × kernel) = ${Math.round(deger * 10) / 10}`,
            w / 2, detY
        );
    }

    VizHelpers.adimKontrol("viz-conv", maxAdim, (a) => { adim = a; render(); });
    window.addEventListener("resize", render);
    render();
    guncelleSecili();
};
