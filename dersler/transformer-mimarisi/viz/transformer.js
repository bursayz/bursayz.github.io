// Transformer Mimarisi — 3D transformer bloğu veri akışı (Three.js)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["3d-transformer"] = async function () {
    const sa = await VizHelpers.threeSahne("viz-transformer", 11);
    if (!sa) return;
    const { THREE, group, render } = sa;

    const ACCENT = new THREE.Color(VizHelpers.accentRenk()); // mor (#a855f7)

    // Katmanlar: alttan üste
    const katmanlar = [
        { ad: "Token + Pozisyon Embedding", y: -3.0, renk: 0x3b82f6 },
        { ad: "LayerNorm", y: -1.9, renk: 0x64748b },
        { ad: "Multi-Head Attention", y: -0.8, renk: 0xa855f7 },
        { ad: "+ Residual", y: 0.1, renk: 0xf59e0b },
        { ad: "LayerNorm", y: 1.1, renk: 0x64748b },
        { ad: "Feed-Forward (GELU)", y: 2.2, renk: 0x22d3ee },
        { ad: "+ Residual → Sonraki Blok", y: 3.3, renk: 0xf59e0b }
    ];

    function makeLabel(text, renkHex, buyuk = false) {
        const c = document.createElement("canvas"); c.width = 512; c.height = 56;
        const cc = c.getContext("2d");
        cc.font = `${buyuk ? "bold" : "500"} ${buyuk ? 26 : 22}px Inter, sans-serif`;
        cc.fillStyle = "#" + renkHex.toString(16).padStart(6, "0");
        cc.textAlign = "center"; cc.textBaseline = "middle";
        cc.fillText(text, 256, 28);
        const tex = new THREE.CanvasTexture(c);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
        sp.scale.set(buyuk ? 4.4 : 3.6, buyuk ? 0.48 : 0.4, 1);
        return sp;
    }

    // Her katman için yatay plaka
    const plakalar = [];
    katmanlar.forEach(k => {
        const geo = new THREE.BoxGeometry(5.2, 0.28, 2.2);
        const mat = new THREE.MeshStandardMaterial({
            color: k.renk, transparent: true, opacity: 0.16,
            roughness: 0.5
        });
        const plaka = new THREE.Mesh(geo, mat);
        plaka.position.y = k.y;
        group.add(plaka);
        plakalar.push({ mesh: plaka, k });

        const kenar = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: k.renk, transparent: true, opacity: 0.6 })
        );
        kenar.position.y = k.y;
        group.add(kenar);
        plakalar.push({ mesh: kenar, k });

        const lbl = makeLabel(k.ad, k.renk, true);
        lbl.position.set(-4.4, k.y, 0);
        group.add(lbl);
    });

    // Token sütunları (4 token) — her biri bir ışık demeti gibi yukarı akar
    const tokenlar = [];
    const N_TOKEN = 4;
    for (let i = 0; i < N_TOKEN; i++) {
        const x = -1.8 + i * 1.2;
        const geo = new THREE.SphereGeometry(0.16, 14, 14);
        const mat = new THREE.MeshBasicMaterial({ color: ACCENT });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, katmanlar[0].y, 0);
        group.add(mesh);
        tokenlar.push({ mesh, x, offset: i * 0.35 });
    }

    // Dikey akış çizgileri
    for (let i = 0; i < N_TOKEN; i++) {
        const x = -1.8 + i * 1.2;
        const g = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(x, katmanlar[0].y - 0.6, 0),
            new THREE.Vector3(x, katmanlar[katmanlar.length - 1].y + 0.6, 0)
        ]);
        const l = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.15 }));
        group.add(l);
    }

    // Residual atlama kemerleri (yan taraftan)
    [[katmanlar[0].y, katmanlar[3].y], [katmanlar[3].y, katmanlar[6].y]].forEach(([y0, y1]) => {
        const pts = [];
        for (let t = 0; t <= 20; t++) {
            const u = t / 20;
            pts.push(new THREE.Vector3(3.1 + Math.sin(u * Math.PI) * 1.1, y0 + (y1 - y0) * u, 0));
        }
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        group.add(new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.55 })));
    });
    const resLbl = makeLabel("residual (bilgi otoyolu)", 0xf59e0b);
    resLbl.position.set(4.6, 0.1, 0);
    group.add(resLbl);

    group.add(new THREE.AmbientLight(0xffffff, 0.7));

    let t = 0;
    const toplamY = katmanlar[katmanlar.length - 1].y - katmanlar[0].y;
    function animasyon() {
        t += 0.012;
        tokenlar.forEach(tk => {
            const u = ((t + tk.offset) % 2.4) / 2.4;   // 0..1 döngü
            tk.mesh.position.y = katmanlar[0].y + u * toplamY;
            const s = 0.8 + Math.sin(u * Math.PI) * 0.5;
            tk.mesh.scale.setScalar(s);
        });
        render();
        requestAnimationFrame(animasyon);
    }
    animasyon();
};
