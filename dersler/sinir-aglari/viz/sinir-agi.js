// Sinir Ağları — 3D sinir ağı sinyal akışı (Three.js)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["3d-sinir-agi"] = async function () {
    const sa = await VizHelpers.threeSahne("viz-sinir-agi", 9);
    if (!sa) return;
    const { THREE, group, render } = sa;

    // Katman tanımları: [giriş(3), gizli1(5), gizli2(4), çıkış(2)]
    const katmanlar = [3, 5, 4, 2];
    const KATMAN_ARALIK = 2.8;
    const noronlar = [];   // { mesh, x, y, z, aktivasyon, katman }
    const baglantilar = []; // { line, guc, meshA, meshB }

    const accentColor = new THREE.Color(VizHelpers.accentRenk());

    const basX = -(katmanlar.length - 1) * KATMAN_ARALIK / 2;

    // Nöronları oluştur
    katmanlar.forEach((noronSayisi, ki) => {
        const nX = basX + ki * KATMAN_ARALIK;
        const aralikY = 1.1;
        const basY = -(noronSayisi - 1) * aralikY / 2;
        const noronKatman = [];
        for (let i = 0; i < noronSayisi; i++) {
            const nY = basY + i * aralikY;
            const geo = new THREE.SphereGeometry(0.28, 20, 20);
            const mat = new THREE.MeshStandardMaterial({
                color: 0x223, roughness: 0.4, metalness: 0.2
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(nX, nY, 0);
            group.add(mesh);
            const noron = { mesh, x: nX, y: nY, z: 0, aktivasyon: 0, katman: ki };
            noronlar.push(noron);
            noronKatman.push(noron);
        }
    });

    // Bağlantıları oluştur
    let idx = 0;
    const katmanBasi = [0];
    katmanlar.forEach((n, ki) => { if (ki > 0) katmanBasi.push(katmanBasi[ki-1] + katmanlar[ki-1]); });

    for (let ki = 0; ki < katmanlar.length - 1; ki++) {
        const katA = noronlar.slice(katmanBasi[ki], katmanBasi[ki] + katmanlar[ki]);
        const katB = noronlar.slice(katmanBasi[ki+1], katmanBasi[ki+1] + katmanlar[ki+1]);
        for (const a of katA) {
            for (const b of katB) {
                const guc = 0.3 + Math.random() * 0.7;  // Ağırlık (0.3-1.0)
                const lineGeo = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(a.x, a.y, a.z),
                    new THREE.Vector3(b.x, b.y, b.z)
                ]);
                const lineMat = new THREE.LineBasicMaterial({
                    color: 0x2a3555,
                    transparent: true,
                    opacity: 0.3 + guc * 0.3
                });
                const line = new THREE.Line(lineGeo, lineMat);
                line.userData.guc = guc;
                group.add(line);
                baglantilar.push({ line, guc, a, b });
            }
        }
    }

    // Ambient + Directional ışık
    group.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dl = new THREE.DirectionalLight(0xffffff, 1);
    dl.position.set(5, 5, 5);
    group.add(dl);

    // Katman etiketleri
    function makeLabel(text) {
        const c = document.createElement("canvas"); c.width = 256; c.height = 48;
        const cc = c.getContext("2d");
        cc.font = "bold 20px Inter, sans-serif"; cc.fillStyle = "#9aa0b4"; cc.textAlign = "center";
        cc.fillText(text, 128, 32);
        const tex = new THREE.CanvasTexture(c);
        const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
        sp.scale.set(2.0, 0.375, 1);
        return sp;
    }

    const etiketler = ["Girdi", "Gizli 1", "Gizli 2", "Çıktı"];
    katmanlar.forEach((n, ki) => {
        const lbl = makeLabel(etiketler[ki]);
        lbl.position.set(basX + ki * KATMAN_ARALIK, -(n - 1) * 1.1 / 2 - 1.1, 0);
        group.add(lbl);
    });

    // Sinyal animasyonu
    let t = 0;
    let dalga = 0;   // Aktivasyon dalgası pozisyonu

    const paket = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: accentColor })
    );
    group.add(paket);

    function animasyon() {
        t += 0.02;
        dalga = (t * 1.2) % (katmanlar.length + 1);

        // Dalga pozisyonuna göre nöron aktivasyonu
        noronlar.forEach(n => {
            const katPoz = n.katman;
            const fark = Math.abs(dalga - katPoz);
            const akt = Math.max(0, 1 - fark);
            n.aktivasyon = n.aktivasyon * 0.85 + akt * 0.15;

            const c = n.mesh.material.color;
            const akt2 = n.aktivasyon;
            c.setRGB(
                0.1 + akt2 * (accentColor.r - 0.1),
                0.1 + akt2 * (accentColor.g - 0.1),
                0.3 + akt2 * (accentColor.b - 0.3)
            );
            n.mesh.material.emissive.setRGB(c.r * 0.5, c.g * 0.5, c.b * 0.5);
            n.mesh.scale.setScalar(1 + akt2 * 0.3);
        });

        // Bağlantıları güncelle
        baglantilar.forEach(bg => {
            const aktA = bg.a.aktivasyon;
            const aktB = bg.b.aktivasyon;
            const op = (aktA + aktB) / 2 * bg.guc * 0.9 + 0.1;
            bg.line.material.opacity = op;
            bg.line.material.color.setRGB(
                0.16 + bg.guc * accentColor.r * 0.5,
                0.2 + bg.guc * accentColor.g * 0.5,
                0.33 + bg.guc * accentColor.b * 0.5
            );
        });

        // Paket (sinyal) katmanlar arasında ilerlesin
        const toplamMesafe = (katmanlar.length - 1) * KATMAN_ARALIK;
        const pakX = basX + (dalga / (katmanlar.length)) * toplamMesafe;
        paket.position.set(pakX, Math.sin(t * 2) * 0.5, 0);

        render();
        requestAnimationFrame(animasyon);
    }
    animasyon();
};
