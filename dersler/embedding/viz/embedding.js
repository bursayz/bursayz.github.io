// Embedding — 3D kelime nokta bulutu (Three.js)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["3d-embedding"] = async function () {
    const sa = await VizHelpers.threeSahne("viz-embedding", 10);
    if (!sa) return;
    const { THREE, group, render } = sa;

    // El yapımı kelime kümeleri — 3 boyuta projekte edilmiş temsili embedding
    const kumeler = [
        { ad: "Hayvanlar", renk: 0x3b82f6, kelimeler: [["kedi",-2.5,1.5,0],["köpek",-2.2,1.2,0.5],["kuş",-2.8,1.8,-0.3],["at",-2.1,1.6,-0.5],["balık",-2.4,1.1,0.3]] },
        { ad: "Teknoloji", renk: 0xa855f7, kelimeler: [["bilgisayar",2.5,-1,0],["internet",2.2,-0.7,-0.4],["yazılım",2.8,-0.8,0.3],["robot",2.0,-1.2,-0.5],["yapay zeka",2.6,-0.9,0.2]] },
        { ad: "Yiyecekler", renk: 0xf59e0b, kelimeler: [["elma",-0.5,-2.5,1.5],["ekmek",-0.2,-2.2,1.2],["peynir",-0.8,-2.6,1.8],["çorba",-0.3,-2.0,1.9]] },
        { ad: "Duygular", renk: 0xef4444, kelimeler: [["mutlu",2.2,2.5,-1],["üzgün",1.8,2.8,-1.3],["kızgın",2.5,2.2,-0.7],["heyecanlı",2.0,2.6,-0.5]] }
    ];

    const ACCENT = new THREE.Color(VizHelpers.accentRenk());

    function makeSprite(text, renkHex) {
        const c = document.createElement("canvas"); c.width = 256; c.height = 64;
        const cc = c.getContext("2d");
        const col = "#" + renkHex.toString(16).padStart(6, "0");
        cc.font = "bold 30px Inter, sans-serif";
        cc.fillStyle = col;
        cc.textAlign = "center"; cc.textBaseline = "middle";
        cc.shadowColor = col; cc.shadowBlur = 6;
        cc.fillText(text, 128, 32);
        const tex = new THREE.CanvasTexture(c);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
        sp.scale.set(1.6, 0.4, 1);
        return sp;
    }

    let t = 0;
    const meshler = [];
    kumeler.forEach((kume, ki) => {
        const kRenk = new THREE.Color(kume.renk);
        kume.kelimeler.forEach(([kelime, x, y, z]) => {
            // Nokta
            const geo = new THREE.SphereGeometry(0.11, 12, 12);
            const mat = new THREE.MeshBasicMaterial({ color: kume.renk });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x, y, z);
            group.add(mesh);
            meshler.push({ mesh, orijinal: new THREE.Vector3(x, y, z), ki });
            // Etiket
            const lbl = makeSprite(kelime, kume.renk);
            lbl.position.set(x, y + 0.28, z);
            group.add(lbl);
        });
        // Küme merkezine işaret
        const cx = kume.kelimeler.reduce((s, [,x]) => s + x, 0) / kume.kelimeler.length;
        const cy = kume.kelimeler.reduce((s, [,,y]) => s + y, 0) / kume.kelimeler.length;
        const cz = kume.kelimeler.reduce((s, [,,,z]) => s + z, 0) / kume.kelimeler.length;
        const kl = makeSprite(kume.ad, kume.renk);
        kl.scale.set(2.2, 0.55, 1);
        kl.position.set(cx, cy - 0.8, cz);
        group.add(kl);
    });

    // Küme çizgileri (küme yakınlığını göster)
    function noktaCizgisi(v1, v2, renk, op) {
        const g = new THREE.BufferGeometry().setFromPoints([v1, v2]);
        const m = new THREE.LineBasicMaterial({ color: renk, transparent: true, opacity: op });
        return new THREE.Line(g, m);
    }

    // "kedi" → "köpek" benzerlik çizgisi
    group.add(noktaCizgisi(new THREE.Vector3(-2.5, 1.5, 0), new THREE.Vector3(-2.2, 1.2, 0.5), 0x3b82f6, 0.5));
    // "kedi" → "bilgisayar" uzak çizgisi
    group.add(noktaCizgisi(new THREE.Vector3(-2.5, 1.5, 0), new THREE.Vector3(2.5, -1, 0), 0xffffff, 0.06));

    // Bilgi paneli
    const infoDiv = document.createElement("div");
    infoDiv.style.cssText = "position:absolute;bottom:8px;left:8px;right:8px;font-size:0.72rem;color:var(--edu-text-dim);text-align:center;background:rgba(0,0,0,0.4);border-radius:8px;padding:0.3rem 0.6rem";
    infoDiv.textContent = "Mavi = Hayvanlar · Mor = Teknoloji · Turuncu = Yiyecek · Kırmızı = Duygu";
    const mountEl = document.getElementById("viz-embedding");
    if (mountEl) { mountEl.style.position = "relative"; mountEl.appendChild(infoDiv); }

    // Izgara
    const grid = new THREE.GridHelper(10, 20, 0x1a1f33, 0x141728);
    grid.position.y = -3.8;
    group.add(grid);

    function animasyon() {
        t += 0.005;
        meshler.forEach(({ mesh, orijinal, ki }) => {
            const pulse = Math.sin(t * 2 + ki) * 0.03;
            mesh.position.set(orijinal.x, orijinal.y + pulse, orijinal.z);
        });
        render();
        requestAnimationFrame(animasyon);
    }
    animasyon();
};
