// Pruning — 3D ağırlık budama animasyonu (Three.js)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["3d-pruning"] = async function () {
    const sa = await VizHelpers.threeSahne("viz-pruning", 8);
    if (!sa) return;
    const { THREE, group, render } = sa;

    const ACCENT = VizHelpers.accentRenk();
    const katmanlar = [4, 6, 6, 3];
    const aralik = 2.4;
    const noronlar = [];

    const basX = -(katmanlar.length - 1) * aralik / 2;
    katmanlar.forEach((n, ki) => {
        const basY = -(n - 1) * 0.85 / 2;
        for (let i = 0; i < n; i++) {
            const geo = new THREE.SphereGeometry(0.2, 16, 16);
            const mat = new THREE.MeshStandardMaterial({ color: 0x8899cc, roughness: 0.35, metalness: 0.3 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(basX + ki * aralik, basY + i * 0.85, 0);
            group.add(mesh);
            noronlar.push(mesh);
        }
    });

    // Bağlantılar + ağırlıklar
    const baglantilar = [];
    let idx = 0;
    const katmanBaslari = [0];
    katmanlar.forEach((n, ki) => { if (ki > 0) katmanBaslari.push(katmanBaslari[ki - 1] + katmanlar[ki - 1]); });

    const sr = (seed => () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; })(55);

    for (let ki = 0; ki < katmanlar.length - 1; ki++) {
        const katA = noronlar.slice(katmanBaslari[ki], katmanBaslari[ki] + katmanlar[ki]);
        const katB = noronlar.slice(katmanBaslari[ki + 1], katmanBaslari[ki + 1] + katmanlar[ki + 1]);
        for (const a of katA) {
            for (const b of katB) {
                const guc = sr();  // 0-1 rastgele ağırlık büyüklüğü
                const geo = new THREE.BufferGeometry().setFromPoints([a.position, b.position]);
                const mat = new THREE.LineBasicMaterial({
                    color: guc > 0.5 ? 0x56a605 : 0x555f88,
                    transparent: true,
                    opacity: 0.15 + guc * 0.6
                });
                const line = new THREE.Line(geo, mat);
                line.userData.guc = guc;
                group.add(line);
                baglantilar.push(line);
            }
        }
    }

    group.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dl = new THREE.DirectionalLight(0xffffff, 1.2);
    dl.position.set(4, 6, 4);
    group.add(dl);

    // Bilgi etiketi
    const bilgi = document.createElement("div");
    bilgi.style.cssText = "position:absolute;top:8px;left:8px;right:8px;text-align:center;font-size:0.75rem;color:var(--edu-text-dim);background:rgba(0,0,0,0.4);border-radius:8px;padding:0.3rem";
    const mountEl = document.getElementById("viz-pruning");
    if (mountEl) { mountEl.style.position = "relative"; mountEl.appendChild(bilgi); }

    let t = 0;
    const DONGU = 6; // saniyelik budama döngüsü

    function animasyon() {
        t += 0.016;
        const faz = (t % (DONGU * 2)) / DONGU; // 0-1 budama, 1-2 geri dönme (tekrar)
        const esik = faz <= 1 ? faz * 0.65 : (2 - faz) * 0.65; // 0 → %65 → 0 seyreklik

        let budanan = 0;
        baglantilar.forEach(l => {
            const budanmis = l.userData.guc < esik;
            if (budanmis) budanan++;
            l.material.opacity = budanmis ? Math.max(0, l.material.opacity - 0.04) : Math.min(0.15 + l.userData.guc * 0.6, l.material.opacity + 0.04);
            l.material.color.setHex(budanmis ? 0xef4444 : (l.userData.guc > 0.5 ? 0x56a605 : 0x555f88));
        });

        const yuzde = Math.round(budanan / baglantilar.length * 100);
        bilgi.textContent = `Seyreklik: %${yuzde} — zayıf ağırlıklar (kırmızı) solup siliniyor. Güçlü bağlantılar (yeşil) korunuyor.`;

        // Nöronlara hafif nefes
        noronlar.forEach((n, i) => {
            const s = 1 + Math.sin(t * 1.5 + i) * 0.08;
            n.scale.setScalar(s);
        });

        render();
        requestAnimationFrame(animasyon);
    }
    animasyon();
};
