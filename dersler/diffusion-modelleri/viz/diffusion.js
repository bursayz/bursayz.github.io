// Diffusion — 3D gürültüden görüntüye animasyon
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["3d-diffusion"] = async function () {
    const sa = await VizHelpers.threeSahne("viz-diffusion", 9);
    if (!sa) return;
    const { THREE, group, render } = sa;

    const ACCENT = new THREE.Color(VizHelpers.accentRenk());
    const N = 24; // 24x24 görüntü grid'i
    const nokta = [];

    // Örnek resim: kedi yüzü benzeri basit desen
    function desen(x, y) {
        const cx = x - N / 2, cy = y - N / 2;
        const r = Math.sqrt(cx * cx + cy * cy);
        // Dairesel kafa
        if (r < 8) {
            // Gözler
            if (Math.sqrt((cx - 3) ** 2 + (cy + 2) ** 2) < 1.5 ||
                Math.sqrt((cx + 3) ** 2 + (cy + 2) ** 2) < 1.5) return 1;
            // Burun
            if (Math.abs(cx) < 1 && Math.abs(cy - 1) < 1.5) return 0.8;
            // Ağız
            if (cy > 3 && cy < 5 && Math.abs(cx) < 3 && Math.abs(cx) > 1) return 0.7;
            return 0.35; // Yüz dolgusu
        }
        // Kulak üçgenleri
        if (cy < -5 && cy > -10) {
            if (cx > 3 && cx < 8 && (cy > -8 + Math.abs(cx - 5))) return 0.9;
            if (cx < -3 && cx > -8 && (cy > -8 + Math.abs(cx + 5))) return 0.9;
        }
        return 0;
    }

    // Nokta bulutu oluştur
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(N * N * 3);
    const colors = new Float32Array(N * N * 3);
    const sizes = new Float32Array(N * N);

    const orijinal = [];
    let vi = 0;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const v = desen(i, j);
            orijinal.push(v);
            positions[vi] = (j - N/2) * 0.22;
            positions[vi + 1] = -(i - N/2) * 0.22;
            positions[vi + 2] = (Math.random() - 0.5) * 0.2;
            colors[vi] = ACCENT.r; colors[vi+1] = ACCENT.g; colors[vi+2] = ACCENT.b;
            sizes[vi] = v > 0.5 ? 0.12 : 0.07;
            vi += 3;
        }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.PointsMaterial({
        size: 0.09, vertexColors: true, transparent: true, opacity: 0.9,
        sizeAttenuation: true
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);

    group.add(new THREE.AmbientLight(0xffffff, 0.8));

    // Diffusion parametreleri
    const betas = [];
    for (let t = 0; t < 1000; t++) betas.push(0.0001 + (0.02 - 0.0001) * t / 999);

    let t = 999; // Saf gürültüden başla
    let yon = -2;  // Denoise: t azalır
    const posAttr = geo.getAttribute("position");
    const orijPos = positions.slice(); // Hedef

    // Gürültü hedeflerini üret (deterministik)
    const sr = (seed => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; })(123);

    function animasyon() {
        t += yon;
        if (t < 0) t = 999;
        if (t > 999) t = 0;

        const progress = 1 - t / 1000; // 0 → gürültü, 1 → temiz

        for (let i = 0; i < N * N; i++) {
            const pi = i * 3;
            // progress'e göre blend: rastgele (0) → orijinal (1)
            const gurultuX = (sr() - 0.5) * 4;
            const gurultuY = (sr() - 0.5) * 4;
            const gurultuZ = (sr() - 0.5) * 4;
            const orijinalV = orijinal[i];
            const blendX = orijPos[pi], blendY = orijPos[pi + 1], blendZ = orijPos[pi + 2];

            posAttr.setX(i, blendX * progress + gurultuX * (1 - progress));
            posAttr.setY(i, blendY * progress + gurultuY * (1 - progress));
            posAttr.setZ(i, blendZ * progress + gurultuZ * (1 - progress));
        }
        posAttr.needsUpdate = true;

        // Renk yoğunluğu progress'e bağlı
        const opac = 0.3 + progress * 0.6;
        mat.opacity = opac;

        render();
        requestAnimationFrame(animasyon);
    }
    animasyon();

    // Alt bilgi
    const info = document.createElement("div");
    info.style.cssText = "position:absolute;bottom:8px;left:8px;right:8px;text-align:center;font-size:0.72rem;color:var(--edu-text-dim);background:rgba(0,0,0,0.4);border-radius:8px;padding:0.3rem";
    info.textContent = "Geriye doğru denoising: t=999 (saf gürültü) → t=0 (orijinal desen) — model bu yolculuğu öğrenir";
    const mountEl = document.getElementById("viz-diffusion");
    if (mountEl) { mountEl.style.position = "relative"; mountEl.appendChild(info); }
};
