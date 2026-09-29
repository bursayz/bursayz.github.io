/**
 * Bursa YZGT — Görselleştirme Yardımcıları
 * Ders görselleştirmeleri için ortak canvas/Three.js yardımcıları.
 * Mobil dostu: devicePixelRatio destekli, dokunmatik uyumlu.
 */

const VizHelpers = {
    ACCENT: "#56a605",

    accentRenk() {
        return getComputedStyle(document.body).getPropertyValue("--accent").trim() || this.ACCENT;
    },
    accent2() {
        return getComputedStyle(document.body).getPropertyValue("--accent-2").trim() || "#8fd94a";
    },

    /** "Adım 1/5" gibi adım butonları oluşturur */
    adimKontrol(containerId, toplam, onChange) {
        const kutu = document.getElementById(containerId);
        const ctrl = document.createElement("div");
        ctrl.style.cssText = "display:flex;gap:0.45rem;align-items:center;flex-wrap:wrap;margin-top:0.7rem";
        kutu.parentElement.appendChild(ctrl);

        const bilgi = document.createElement("span");
        bilgi.style.cssText = "font-size:0.8rem;color:var(--edu-text-dim)";

        const onceki = this._btn("← Önceki");
        const sonraki = this._btn("Sonraki →");
        const oynat = this._btn("▶ Oynat");
        let cur = 0, timer = null;

        const guncelle = () => {
            bilgi.textContent = `Adım ${cur + 1}/${toplam}`;
            onceki.disabled = cur === 0;
            sonraki.disabled = cur === toplam - 1;
            onChange(cur);
        };
        onceki.onclick = () => { if (cur > 0) { cur--; guncelle(); } };
        sonraki.onclick = () => { if (cur < toplam - 1) { cur++; guncelle(); } };
        oynat.onclick = () => {
            if (timer) { clearInterval(timer); timer = null; oynat.textContent = "▶ Oynat"; return; }
            oynat.textContent = "⏸ Durdur";
            timer = setInterval(() => {
                if (cur >= toplam - 1) { clearInterval(timer); timer = null; oynat.textContent = "▶ Oynat"; return; }
                cur++; guncelle();
            }, 1200);
        };
        ctrl.append(onceki, bilgi, sonraki, oynat);
        guncelle();
        return ctrl;
    },

    _btn(txt) {
        const b = document.createElement("button");
        b.textContent = txt;
        b.style.cssText = `
            padding:0.35rem 0.75rem;border-radius:0.5rem;font-size:0.78rem;font-weight:600;
            background:rgba(255,255,255,0.06);color:var(--edu-text);border:1px solid var(--edu-border);
            cursor:pointer;font-family:var(--font-sans)`;
        b.onmouseenter = () => b.style.background = "rgba(255,255,255,0.12)";
        b.onmouseleave = () => b.style.background = "rgba(255,255,255,0.06)";
        b.onmousedown = e => e.preventDefault();
        return b;
    },

    /** DPR uyumlu canvas oluşturur, ctx ve ölçüleri döndürür */
    canvas2D(mountId, yukseklikOrani = 0.55) {
        const mount = document.getElementById(mountId);
        if (!mount) return null;
        const canvas = document.createElement("canvas");
        mount.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        const bagla = () => {
            const w = mount.clientWidth;
            const h = Math.max(240, Math.round(w * yukseklikOrani));
            const dpr = window.devicePixelRatio || 1;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            return { w, h };
        };
        let boyut = bagla();
        window.addEventListener("resize", () => { boyut = bagla(); });
        return { canvas, ctx, get w() { return boyut.w; }, get h() { return boyut.h; }, redraw: () => { boyut = bagla(); } };
    },

    /** Three.js sahne iskeleti — mount id'ye renderer, scene, camera ve resize desteği verir */
    async threeSahne(mountId, kameraZ = 8) {
        const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
        const mount = document.getElementById(mountId);
        if (!mount) return null;
        const w = mount.clientWidth, h = Math.max(260, Math.round(w * 0.6));
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x090b10);
        const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
        camera.position.z = kameraZ;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        mount.appendChild(renderer.domElement);

        mount.insertAdjacentHTML("beforeend",
            `<div style="text-align:center;font-size:0.72rem;color:var(--edu-text-dim);padding:0.4rem 0 0">↔ Sürükleyerek döndürebilirsiniz</div>`);

        // Basit orbit (manuel — dokunmatik dahil)
        let donuyor = false, prevX = 0, prevY = 0, rotX = 0, rotY = 0, hedefX = 0, hedefY = 0;
        const el = renderer.domElement;
        const start = (x, y) => { donuyor = true; prevX = x; prevY = y; };
        const move = (x, y) => {
            if (!donuyor) return;
            hedefY += (x - prevX) * 0.008; hedefX += (y - prevY) * 0.008;
            hedefX = Math.max(-1.2, Math.min(1.2, hedefX));
            prevX = x; prevY = y;
        };
        el.addEventListener("mousedown", e => start(e.clientX, e.clientY));
        window.addEventListener("mousemove", e => move(e.clientX, e.clientY));
        window.addEventListener("mouseup", () => donuyor = false);
        el.addEventListener("touchstart", e => start(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        el.addEventListener("touchmove", e => move(e.touches[0].clientX, e.touches[0].clientY), { passive: true });
        el.addEventListener("touchend", () => donuyor = false);

        const group = new THREE.Group();
        scene.add(group);
        const render = () => {
            rotX += (hedefX - rotX) * 0.08;
            rotY += (hedefY - rotY) * 0.08;
            group.rotation.x = rotX;
            group.rotation.y = rotY;
            renderer.render(scene, camera);
        };

        window.addEventListener("resize", () => {
            const nw = mount.clientWidth, nh = Math.max(260, Math.round(nw * 0.6));
            camera.aspect = nw / nh; camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
        });

        return { THREE, scene, camera, renderer, group, render, mountEl: mount };
    },

    /** Metnin canvas ortasına yazılması */
    ortaYazi(ctx, metin, x, y, renk = "#e8eaf0", boyut = 13, kalin = false) {
        ctx.fillStyle = renk;
        ctx.font = `${kalin ? "700" : "500"} ${boyut}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(metin, x, y);
    }
};
