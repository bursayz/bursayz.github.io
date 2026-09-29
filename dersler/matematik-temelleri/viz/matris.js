// Matematik Temelleri — 3D Vektör × Matris görselleştirmesi (Three.js)
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["3d-matris"] = async function () {
    const sa = await VizHelpers.threeSahne("viz-matris", 7);
    if (!sa) return;
    const { THREE, group, render } = sa;

    // Eksenler
    const axes = new THREE.AxesHelper(3);
    group.add(axes);

    // Girdi vektörü (kırmızı ok)
    const girdi = new THREE.Vector3(1.5, 2.0, 1.0);
    const arrowIn = new THREE.ArrowHelper(girdi.clone().normalize(), new THREE.Vector3(0,0,0), girdi.length(), 0xff5555, 0.3, 0.15);
    group.add(arrowIn);

    // Matris (animasyonda yavaşça döner — farklı ağırlıklar etkisi)
    // Girdi vektörünü döndüren/ölçekleyen bir matris
    let t = 0;
    const arrowOut = new THREE.ArrowHelper(new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,0), 2, 0x56a605, 0.3, 0.15);
    group.add(arrowOut);

    // Girdi ucunda küre (kırmızı)
    const topIn = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff5555 }));
    topIn.position.copy(girdi);
    group.add(topIn);

    // Çıktı ucunda küre (yeşil)
    const topOut = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), new THREE.MeshBasicMaterial({ color: 0x56a605 }));
    group.add(topOut);

    // Izgara
    const grid = new THREE.GridHelper(6, 12, 0x2a2f45, 0x1a1f33);
    grid.position.y = -2;
    group.add(grid);

    function matrisCarp(t) {
        // Zamanla değişen bir matris efekti: girdi vektörünü Y ekseni etrafında döndür ve ölçekle
        const angle = t * 0.5;
        const scale = 1 + 0.3 * Math.sin(t * 0.7);
        const cos = Math.cos(angle), sin = Math.sin(angle);
        // 3D dönüşüm matrisi (Y ekseni etrafında dönüş + ölçek)
        // [cos  0  sin] [x]      [scale*(cos*x + sin*z)]
        // [0    1  0 ] [y]  →   [scale*y               ]
        // [-sin 0  cos] [z]      [scale*(-sin*x + cos*z)]
        return new THREE.Vector3(
            scale * (cos * girdi.x + sin * girdi.z),
            scale * girdi.y * 0.8,
            scale * (-sin * girdi.x + cos * girdi.z)
        );
    }

    // Etiketler yerine sahne içi sprite (canvas texture)
    function makeLabel(text, color) {
        const c = document.createElement("canvas"); c.width = 256; c.height = 64;
        const cc = c.getContext("2d");
        cc.font = "bold 28px Inter, sans-serif"; cc.fillStyle = color; cc.textAlign = "center";
        cc.fillText(text, 128, 40);
        const tex = new THREE.CanvasTexture(c);
        const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
        const sp = new THREE.Sprite(mat);
        sp.scale.set(1.8, 0.45, 1);
        return sp;
    }

    const labelIn = makeLabel("x (girdi)", "#ff8888");
    labelIn.position.copy(girdi).add(new THREE.Vector3(0, 0.5, 0));
    group.add(labelIn);

    const labelOut = makeLabel("Ax (çıktı)", "#8fd94a");
    group.add(labelOut);

    function animasyon() {
        t += 0.008;
        const cikti = matrisCarp(t);
        arrowOut.setDirection(cikti.clone().normalize());
        arrowOut.setLength(cikti.length(), 0.3, 0.15);
        topOut.position.copy(cikti);
        labelOut.position.copy(cikti).add(new THREE.Vector3(0, 0.5, 0));
        render();
        requestAnimationFrame(animasyon);
    }
    animasyon();
};
