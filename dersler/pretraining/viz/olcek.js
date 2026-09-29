// Pretraining — İnteraktif Ölçek Yasaları keşfedici
// Slider ile parametre (N) ve token (D) değiştir, kaybı gör.
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-olcek"] = function () {
    const mount = document.getElementById("viz-olcek");
    if (!mount) return;
    mount.innerHTML = "";

    const ACCENT = VizHelpers.accentRenk();
    const ACCENT2 = VizHelpers.accent2();

    // ---------- Kontroller ----------
    const kontrolAlani = document.createElement("div");
    kontrolAlani.style.cssText = "display:flex;gap:20px;flex-wrap:wrap;margin-bottom:8px;";

    function sliderOlustur(etiket, min, max, adim, deger, format) {
        const wrap = document.createElement("div");
        wrap.style.cssText = "flex:1;min-width:180px;display:flex;flex-direction:column;gap:4px;";
        const lbl = document.createElement("label");
        lbl.style.cssText = "color:#9aa0b4;font-size:11px;display:flex;justify-content:space-between;";
        const valSpan = document.createElement("span");
        valSpan.style.cssText = `color:${ACCENT};font-weight:600;font-family:'JetBrains Mono',monospace;`;
        lbl.textContent = etiket;
        lbl.appendChild(valSpan);
        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = min; slider.max = max; slider.step = adim; slider.value = deger;
        slider.style.cssText = "width:100%;accent-color:" + ACCENT + ";";
        wrap.appendChild(lbl);
        wrap.appendChild(slider);
        return { wrap, slider, valSpan, format };
    }

    const paramSlider = sliderOlustur("Parametre sayısı (N)", 6.3, 11.5, 0.05, 7.0,
        v => (10 ** v / 1e6).toFixed(0) + "M–" + (10 ** v / 1e9).toFixed(1) + "B");
    const tokenSlider = sliderOlustur("Eğitim token sayısı (D)", 9, 13, 0.05, 12.0,
        v => {
            const t = 10 ** v;
            if (t < 1e12) return (t / 1e9).toFixed(0) + "B";
            return (t / 1e12).toFixed(1) + "T";
        });
    const paramValLabel = document.createElement("div");
    const tokenValLabel = document.createElement("div");

    // Etiketleri doldur
    function guncelleEtiketler() {
        const N = 10 ** parseFloat(paramSlider.slider.value);
        const D = 10 ** parseFloat(tokenSlider.slider.value);
        paramSlider.valSpan.textContent = paramSlider.format(parseFloat(paramSlider.slider.value));
        tokenSlider.valSpan.textContent = tokenSlider.format(parseFloat(tokenSlider.slider.value));
        hesaplaVeGoster(N, D);
    }

    [paramSlider, tokenSlider].forEach(s => {
        kontrolAlani.appendChild(s.wrap);
        s.slider.addEventListener("input", guncelleEtiketler);
    });

    // Basit etiketleri de ekle
    const etiketSatir = document.createElement("div");
    etiketSatir.style.cssText = "display:flex;gap:24px;flex-wrap:wrap;font-size:12px;color:#9aa0b4;margin-bottom:4px;";
    paramValLabel.style.cssText = "font-family:'JetBrains Mono';color:" + ACCENT + ";";
    tokenValLabel.style.cssText = "font-family:'JetBrains Mono';color:" + ACCENT + ";";
    etiketSatir.appendChild(paramValLabel);
    etiketSatir.appendChild(tokenValLabel);

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;display:block;border-radius:8px;background:rgba(255,255,255,0.02);cursor:pointer;";
    canvas.title = "Tıklayın: animasyonu tekrar oynatın";

    mount.appendChild(kontrolAlani);
    mount.appendChild(etiketSatir);
    mount.appendChild(canvas);

    // ---------- Canvas ----------
    const ctx = canvas.getContext("2d");
    function boyutlandir() {
        const w = mount.clientWidth;
        const h = Math.max(260, w * 0.48);
        const dpr = window.devicePixelRatio || 1;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    boyutlandir();
    new ResizeObserver(() => { boyutlandir(); ciz(1); }).observe(mount);

    let t = 0;

    function chinchillaLoss(N, D) {
        return 1.69 + 406.4 / Math.pow(N, 0.34) + 410.7 / Math.pow(D, 0.28);
    }

    function hesaplaVeGoster(N, D) {
        const L = chinchillaLoss(N, D);
        const oran = D / N;
        const chinchillaOpt = oran >= 18 && oran <= 22;
        const durum = oran < 15
            ? { emoji: "⚠️", renk: "#f59e0b", metin: `Az veri (${oran.toFixed(1)} tok/param) — model "aç kalıyor"` }
            : oran > 30
                ? { emoji: "🔵", renk: "#3b82f6", metin: `Çok veri (${oran.toFixed(0)} tok/param) — küçük model zorlanır` }
                : { emoji: "✅", renk: "#22c55e", metin: `Chinchilla-optimal (${oran.toFixed(1)} tok/param)` };

        paramValLabel.textContent = `N = ${N >= 1e9 ? (N/1e9).toFixed(1)+"B" : (N/1e6).toFixed(0)+"M"}  |  D = ${D >= 1e12 ? (D/1e12).toFixed(1)+"T" : (D/1e9).toFixed(0)+"B"}`;
        tokenValLabel.innerHTML = `${durum.emoji} <span style="color:${durum.renk}">${durum.metin}</span>  →  Loss ≈ ${L.toFixed(3)}`;
        ciz(Math.min(1, t + 0.25));
    }

    function ciz(p) {
        const w = canvas.width / (window.devicePixelRatio || 1);
        const h = canvas.height / (window.devicePixelRatio || 1);
        ctx.clearRect(0, 0, w, h);

        const pad = { l: 52, r: 16, t: 42, b: 50 };
        const gw = w - pad.l - pad.r, gh = h - pad.t - pad.b;
        const xMin = 6.3, xMax = 11.6;
        const yMin = 1.55, yMax = 4.6;

        const sx = v => pad.l + ((v - xMin) / (xMax - xMin)) * gw;
        const sy = v => pad.t + gh - ((v - yMin) / (yMax - yMin)) * gh;

        // Başlık
        VizHelpers.ortaYazi(ctx, "Chinchilla Scaling Law — Kayıp (L) vs Parametre (N)", w / 2, 16, ACCENT2, 13, true);

        // Izgara
        ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const x = xMin + (xMax - xMin) * i / 4, y = yMin + (yMax - yMin) * i / 4;
            ctx.beginPath(); ctx.moveTo(sx(x), pad.t); ctx.lineTo(sx(x), pad.t + gh); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(pad.l, sy(y)); ctx.lineTo(pad.l + gw, sy(y)); ctx.stroke();
        }
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + gh); ctx.lineTo(pad.l + w - pad.l - pad.r, pad.t + gh); ctx.stroke();

        // Eksen etiketleri
        ctx.fillStyle = "#666"; ctx.font = "10px Inter"; ctx.textAlign = "center";
        const nEtiketler = [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5];
        const nIsimler = ["3M","10M","30M","100M","300M","1B","3B","10B","30B","100B","300B"];
        nEtiketler.forEach((v, i) => ctx.fillText(nIsimler[i], sx(v), pad.t + gh + 16));
        ctx.textAlign = "right";
        [1.8, 2.4, 3.0, 3.6, 4.2].forEach(v => ctx.fillText(v.toFixed(1), pad.l - 6, sy(v) + 3));
        VizHelpers.ortaYazi(ctx, "Parametre sayısı →", pad.l + gw / 2, h - 14, "#9aa0b4", 11);
        ctx.save();
        ctx.translate(13, pad.t + gh / 2); ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "#9aa0b4"; ctx.font = "11px Inter"; ctx.textAlign = "center";
        ctx.fillText("Kayıp (Loss) →", 0, 0);
        ctx.restore();

        // Iso-token eğrileri
        const dSerileri = [
            { ad: "D=10B tok",  deger: 10, renk: "#ef4444" },
            { ad: "D=100B tok", deger: 11, renk: "#f59e0b" },
            { ad: "D=1T tok",   deger: 12, renk: "#3b82f6" },
            { ad: "D=10T tok",  deger: 12.87, renk: "#a78bfa" },
        ];

        dSerileri.forEach(seri => {
            const D = 10 ** seri.deger;
            ctx.strokeStyle = seri.renk; ctx.lineWidth = 1.6;
            ctx.beginPath();
            let ilk = true;
            for (let i = 0; i <= 60; i++) {
                const logN = xMin + (xMax - xMin) * i / 60;
                const N = 10 ** logN;
                const loss = chinchillaLoss(N, D);
                if (loss < yMin || loss > yMax) continue;
                const X = sx(logN), Y = sy(loss);
                ilk ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
                ilk = false;
            }
            ctx.stroke();
        });

        // Kullanıcının noktası (animasyonlu)
        const logN = parseFloat(paramSlider.slider.value);
        const N = 10 ** logN;
        const D = 10 ** parseFloat(tokenSlider.slider.value);
        const L = chinchillaLoss(N, D);
        if (L >= yMin && L <= yMax) {
            const X = sx(logN), Y = sy(L);

            // Crosshair
            ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(pad.l, Y); ctx.lineTo(X, Y); ctx.lineTo(X, pad.t + gh); ctx.stroke();
            ctx.setLineDash([]);

            // Nokta (pulse)
            const pulse = p >= 1 ? 1 + Math.sin(Date.now() / 300) * 0.15 : p;
            ctx.beginPath(); ctx.arc(X, Y, 8 * pulse + 3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fill();
            ctx.beginPath(); ctx.arc(X, Y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#fff"; ctx.fill();
            ctx.beginPath(); ctx.arc(X, Y, 5, 0, Math.PI * 2);
            ctx.strokeStyle = ACCENT; ctx.lineWidth = 2.5; ctx.stroke();

            ctx.fillStyle = "#fff"; ctx.font = "bold 11px 'JetBrains Mono'";
            ctx.textAlign = "center";
            ctx.fillText(`L=${L.toFixed(3)}`, X, Y - 14);
        }

        // Lejant
        dSerileri.forEach((seri, i) => {
            const lx = pad.l + 10, ly = pad.t + 14 + i * 18;
            ctx.strokeStyle = seri.renk; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 16, ly); ctx.stroke();
            ctx.fillStyle = "#9aa0b4"; ctx.font = "10px Inter"; ctx.textAlign = "left";
            ctx.fillText(seri.ad, lx + 22, ly + 3);
        });
    }

    // İlk çizim
    guncelleEtiketler();

    // Pulse animasyon (sadece canvas tıklandığında tekrar)
    let rafAnim = null;
    function pulseDongu() {
        ciz(1);
        rafAnim = requestAnimationFrame(pulseDongu);
    }
    pulseDongu();

    canvas.addEventListener("click", () => { guncelleEtiketler(); });

    // ResizeObserver'da çakışma önlemek için
    const ro = new ResizeObserver(() => { boyutlandir(); ciz(1); });
    ro.observe(mount);
};
