// Görüntü Sınıflandırma — İnteraktif rakam çizme & sınıflandırma
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-cizim-tahmin"] = function () {
    const mount = document.getElementById("viz-cizim-tahmin");
    if (!mount) return;

    const GRID = 28;
    const cellSize = 14; // 28*14 = 392 px

    // Sol: çizim canvası, Sağ: tahmin paneli
    mount.innerHTML = `
        <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;align-items:flex-start;padding:4px">
            <div style="position:relative">
                <canvas id="draw-canvas" width="${GRID*cellSize}" height="${GRID*cellSize}"
                    style="background:#111;border-radius:8px;cursor:crosshair;touch-action:none;display:block"></canvas>
                <div id="draw-hint" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
                     color:rgba(255,255,255,0.25);font-size:0.85rem;pointer-events:none;text-align:center">
                    Rakam çizin (0-9)<br>🖱️ veya 👆
                </div>
            </div>
            <div style="flex:1;min-width:220px">
                <canvas id="pred-canvas" width="240" height="280" style="width:100%;display:block"></canvas>
            </div>
        </div>
        <div style="display:flex;gap:8px;justify-content:center;padding:6px 0 2px">
            <button id="clear-btn" style="padding:6px 14px;border-radius:8px;background:rgba(255,255,255,0.07);
                border:1px solid var(--edu-border);color:var(--edu-text);cursor:pointer;font-size:0.82rem;font-family:Inter">
                Temizle
            </button>
        </div>`;

    const dc = document.getElementById("draw-canvas");
    const pc = document.getElementById("pred-canvas");
    const dctx = dc.getContext("2d");
    const pctx = pc.getContext("2d");
    const hint = document.getElementById("draw-hint");

    // Basit eğitilmiş rakam tanıma (kural tabanlı simülasyon — gerçek model eğitilemez ama sezgi verir)
    const grid = Array.from({length: GRID}, () => Array(GRID).fill(0));

    let ciziyorum = false;
    let sonX = -1, sonY = -1;
    let noktaSayisi = 0;

    function ciz(x, y) {
        const gx = Math.floor(x / cellSize), gy = Math.floor(y / cellSize);
        const cap = sonX >= 0 && sonY >= 0 && Math.abs(gx - sonX) <= 1 && Math.abs(gy - sonY) <= 1;
        // Bresenham benzeri düz çizgi
        if (!cap && sonX >= 0) {
            const adimlar = Math.max(Math.abs(gx - sonX), Math.abs(gy - sonY));
            for (let i = 0; i <= adimlar; i++) {
                const ix = Math.round(sonX + (gx - sonX) * i / adimlar);
                const iy = Math.round(sonY + (gy - sonY) * i / adimlar);
                if (ix >= 0 && ix < GRID && iy >= 0 && iy < GRID) {
                    grid[iy][ix] = 1;
                    // Komşuları da hafiflet
                    [[1,0],[-1,0],[0,1],[0,-1]].forEach(([dx,dy]) => {
                        const nx = ix+dx, ny = iy+dy;
                        if (nx>=0 && nx<GRID && ny>=0 && ny<GRID) grid[ny][nx] = Math.max(grid[ny][nx], 0.5);
                    });
                }
            }
        } else {
            grid[gy]?.[gx] !== undefined && (grid[gy][gx] = 1);
        }
        sonX = gx; sonY = gy;
        noktaSayisi++;
        if (noktaSayisi === 3) hint.style.display = "none";
        render();
        tahminEt();
    }

    function pos(e) {
        const r = dc.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        return [t.clientX - r.left, t.clientY - r.top];
    }

    dc.addEventListener("mousedown", e => { ciziyorum = true; [...pos(e)]; const [x,y] = pos(e); ciz(x, y); });
    dc.addEventListener("mousemove", e => { if (ciziyorum) { const [x,y] = pos(e); ciz(x, y); } });
    window.addEventListener("mouseup", () => { ciziyorum = false; sonX = -1; sonY = -1; });
    dc.addEventListener("touchstart", e => { e.preventDefault(); ciziyorum = true; const [x,y] = pos(e); ciz(x, y); }, { passive: false });
    dc.addEventListener("touchmove", e => { e.preventDefault(); if (ciziyorum) { const [x,y] = pos(e); ciz(x, y); } }, { passive: false });
    dc.addEventListener("touchend", () => { ciziyorum = false; sonX = -1; sonY = -1; });

    document.getElementById("clear-btn").onclick = () => {
        for (let i = 0; i < GRID; i++) grid[i].fill(0);
        noktaSayisi = 0;
        hint.style.display = "flex";
        render();
        tahminEt();
    };

    function render() {
        dctx.clearRect(0, 0, dc.width, dc.height);
        for (let i = 0; i < GRID; i++) {
            for (let j = 0; j < GRID; j++) {
                const v = grid[i][j];
                if (v > 0) {
                    const alpha = v;
                    dctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
                    dctx.fillRect(j * cellSize + 1, i * cellSize + 1, cellSize - 2, cellSize - 2);
                }
            }
        }
    }

    // Basit rakam tahmin simülasyonu — yoğunluk desenine göre sezgisel
    function tahminEt() {
        // Kural tabanlı tahmin: her rakam için basit "imza" hesapla
        let toplam = 0, cx = 0, cy = 0, satirlar = Array(GRID).fill(0), sutunlar = Array(GRID).fill(0);
        for (let i = 0; i < GRID; i++) for (let j = 0; j < GRID; j++) {
            toplam += grid[i][j]; cx += j * grid[i][j]; cy += i * grid[i][j];
            satirlar[i] += grid[i][j]; sutunlar[j] += grid[i][j];
        }
        pctx.clearRect(0, 0, pc.width, pc.height);
        if (!toplam) {
            pctx.fillStyle = "rgba(255,255,255,0.25)";
            pctx.font = "11px Inter"; pctx.textAlign = "center";
            pctx.fillText("Rakam çizin...", pc.width / 2, pc.height / 2);
            return;
        }

        cx /= toplam; cy /= toplam;
        const sifirlik = toplam / (GRID * GRID);
        const skorlar = [
            // Basit imza tabanlı tahmin (eğitsel amaçlı kaba model)
            { rakam: 0, skor: Math.abs(sifirlik - 0.45) < 0.2 ? 0.8 : 0.1 },
            { rakam: 1, skor: sutunlar[Math.round(cx)] > toplam * 0.5 ? 0.85 : 0.1 },
            { rakam: 2, skor: satirlar[5] > 0 && satirlar[20] > 0 ? 0.7 : 0.15 },
            { rakam: 3, skor: cy < 18 ? 0.72 : 0.2 },
            { rakam: 4, skor: satirlar[14] > toplam * 0.3 ? 0.75 : 0.15 },
            { rakam: 5, skor: satirlar[7] > 0 && satirlar[21] > 0 ? 0.68 : 0.18 },
            { rakam: 6, skor: cy > 15 && cx < 14 ? 0.74 : 0.2 },
            { rakam: 7, skor: satirlar[4] > toplam * 0.4 ? 0.78 : 0.12 },
            { rakam: 8, skor: cx > 10 && cx < 18 && cy > 10 && cy < 18 ? 0.72 : 0.2 },
            { rakam: 9, skor: cy < 18 && cx > 11 ? 0.75 : 0.12 }
        ].map(s => ({ ...s, skor: s.skor + Math.random() * 0.05 }));
        skorlar.sort((a, b) => b.skor - a.skor);
        const toplamSkor = skorlar.reduce((s, r) => s + r.skor, 0);

        // Olasılıkları normalize et ve çiz
        const maxY = 30 + 22 * 10;
        pctx.font = "bold 12px Inter"; pctx.fillStyle = "#c084fc"; pctx.textAlign = "left";
        pctx.fillText("Tahmin Olasılıkları", 10, 18);
        skorlar.forEach((s, i) => {
            const oran = s.skor / toplamSkor;
            const y = 28 + i * 22;
            const w = (pc.width - 70) * oran;
            pctx.fillStyle = i === 0 ? "#56a605" : "rgba(255,255,255,0.07)";
            pctx.fillRect(30, y, Math.max(4, w), 16);
            pctx.fillStyle = i === 0 ? "#0b0d14" : "#9aa0b4";
            pctx.font = "bold 11px 'JetBrains Mono', monospace";
            pctx.textAlign = "right"; pctx.fillText(String(s.rakam), 24, y + 12);
            pctx.fillStyle = i === 0 ? "#56a605" : "#666";
            pctx.textAlign = "left"; pctx.fillText(`%${(oran * 100).toFixed(0)}`, 36 + w, y + 12);
        });
        pctx.fillStyle = "#9aa0b4"; pctx.font = "10px Inter"; pctx.textAlign = "center";
        pctx.fillText(i18nNot, pc.width / 2, maxY);
    }

    const i18nNot = "(Kural tabanlı örnek — gerçek CNN Colab'da eğitin)";
    tahminEt();
};
