// Self-Attention — 3D attention matrisi (Three.js)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["3d-attention"] = async function () {
    const sa = await VizHelpers.threeSahne("viz-attention", 9);
    if (!sa) return;
    const { THREE, group, render } = sa;

    const KELIMELER = ["kedi", "uyudu", "çünkü", "o", "yorgundu"];
    const N = KELIMELER.length;
    // Örnek attention matrisi (nedensel maskeleme uygulanmış)
    const ATN = [
        [1.00, 0,    0,    0,    0   ],
        [0.30, 0.70, 0,    0,    0   ],
        [0.20, 0.45, 0.35, 0,    0   ],
        [0.50, 0.20, 0.15, 0.15, 0   ],
        [0.35, 0.10, 0.15, 0.25, 0.15]
    ];

    const ACCENT = new THREE.Color(VizHelpers.accentRenk());
    const hucreBoyut = 0.8, aralik = hucreBoyut * 1.08;
    const meshler = [];

    // Hücreleri oluştur
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            const deger = ATN[i][j];
            const geo = new THREE.BoxGeometry(hucreBoyut, Math.max(0.05, deger * 3), hucreBoyut);
            const mat = new THREE.MeshStandardMaterial({
                color: deger > 0 ? new THREE.Color(0.2 + deger * 0.5, 0.5 + deger * 0.3, 0.1 + deger * 0.3) : 0x1a1f33,
                transparent: deger === 0,
                opacity: deger === 0 ? 0.1 : 0.9
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(j * aralik - (N-1)*aralik/2, deger * 1.5, i * aralik - (N-1)*aralik/2);
            group.add(mesh);
            meshler.push({ mesh, deger, i, j });
        }
    }

    // Kelime etiketleri
    function makeLabel(text, color = "#9aa0b4") {
        const c = document.createElement("canvas"); c.width = 128; c.height = 48;
        const cc = c.getContext("2d");
        cc.font = "bold 24px Inter, sans-serif"; cc.fillStyle = color;
        cc.textAlign = "center"; cc.textBaseline = "middle";
        cc.fillText(text, 64, 24);
        const tex = new THREE.CanvasTexture(c);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
        sp.scale.set(1.1, 0.41, 1);
        return sp;
    }

    // Satır etiketleri (sorgu soran)
    KELIMELER.forEach((kelime, i) => {
        const lbl = makeLabel("→ " + kelime, VizHelpers.accent2());
        lbl.position.set(-(N/2)*aralik - 1.3, 0, i * aralik - (N-1)*aralik/2);
        group.add(lbl);
    });
    // Sütun etiketleri (bakılan)
    KELIMELER.forEach((kelime, j) => {
        const lbl = makeLabel(kelime, "#9aa0b4");
        lbl.position.set(j * aralik - (N-1)*aralik/2, 0, -(N/2)*aralik - 1.2);
        group.add(lbl);
    });

    // Eksen açıklamaları
    const rowLbl = makeLabel("Sorgu (Query): Hangi kelime bakıyor? ↑", "#c084fc");
    rowLbl.position.set(0, 3.2, -(N/2)*aralik - 1.8);
    rowLbl.scale.set(3.5, 0.7, 1);
    group.add(rowLbl);
    const colLbl = makeLabel("Anahtar (Key): Hangi kelime görülüyor? →", "#93c5fd");
    colLbl.position.set(0, 3.2, (N/2)*aralik + 1.6);
    colLbl.scale.set(3.5, 0.7, 1);
    group.add(colLbl);

    // Hover bilgisi
    const infoDiv = document.createElement("div");
    infoDiv.style.cssText = "position:absolute;top:8px;left:8px;right:8px;font-size:0.75rem;color:var(--edu-text-dim);text-align:center;background:rgba(0,0,0,0.5);border-radius:8px;padding:0.3rem 0.6rem;pointer-events:none";
    infoDiv.textContent = "Matrisi keşfetmek için üzerine gelin";
    const mountEl = document.getElementById("viz-attention");
    if (mountEl) { mountEl.style.position = "relative"; mountEl.appendChild(infoDiv); }

    const raycast = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-10, -10);
    const renderer = sa.renderer;

    renderer.domElement.addEventListener("mousemove", e => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    renderer.domElement.addEventListener("touchmove", e => {
        const t = e.touches[0];
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((t.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((t.clientY - rect.top) / rect.height) * 2 + 1;
    }, { passive: true });

    let t = 0;
    function animasyon() {
        t += 0.005;
        raycast.setFromCamera(mouse, sa.camera);
        const hits = raycast.intersectObjects(meshler.map(m => m.mesh));
        let hoverYok = true;

        meshler.forEach(m => {
            const hit = hits.length && hits[0].object === m.mesh;
            if (hit) {
                hoverYok = false;
                infoDiv.textContent = `"${KELIMELER[m.i]}" → "${KELIMELER[m.j]}" dikkat: %${(m.deger * 100).toFixed(0)}`;
                m.mesh.material.emissive = ACCENT;
            } else {
                m.mesh.material.emissive = new THREE.Color(0x000000);
            }
            const pulse = Math.sin(t * 2 + m.i + m.j) * 0.02;
            m.mesh.position.y = m.deger * 1.5 + pulse;
        });

        if (hoverYok) infoDiv.textContent = "Matrise değen hücre: [i][j] = i kelimesinin j kelimesine verdiği dikkat ağırlığı";

        render();
        requestAnimationFrame(animasyon);
    }
    animasyon();
};
