/**
 * Bursa YZGT — Görselleştirme Yardımcıları
 * Ders görselleştirmeleri için ortak canvas/Three.js yardımcıları.
 *
 * Tasarım notları:
 *  - Tek merkezî "boyut değişti → temizle → tekrar çiz" motoru:
 *    canvas2D(), ResizeObserver + resize/orientationchange dinler.
 *    Boyut değişmediyse canvas'a dokunulmaz (gereksiz silinme olmaz).
 *  - adimKontrol() mevcut adımı kayda yazdığı için resize sonrası
 *    interaktif bulundğu adıma geri çizilir (adım sıfırlanmaz).
 *  - Metin yardımcıları (ortaYazi/sarmaliYazi) dar ekranlarda taşan
 *    canvas yazılarını sığdırır/satar.
 */

const VizHelpers = {
    ACCENT: "#56a605",

    /** mountId -> { paint, sonW, sonH, sonDpr } */
    _kayitlar: {},

    accentRenk() {
        return getComputedStyle(document.body).getPropertyValue("--accent").trim() || this.ACCENT;
    },
    accent2() {
        return getComputedStyle(document.body).getPropertyValue("--accent-2").trim() || "#8fd94a";
    },

    _kayit(mountId) {
        let k = this._kayitlar[mountId];
        if (!k) k = this._kayitlar[mountId] = { paint: null, sonW: -1, sonH: -1, sonDpr: -1 };
        return k;
    },

    /** Boyut değiştiğinde çağrılacak çizim fonksiyonunu kaydeder */
    paintKaydet(mountId, fn) {
        this._kayit(mountId).paint = fn || null;
        return fn;
    },

    /** "Adım 1/5" gibi adım butonları oluşturur; mevcut adımı kayda yazar */
    adimKontrol(containerId, toplam, onChange) {
        const kutu = document.getElementById(containerId);
        const ctrl = document.createElement("div");
        ctrl.className = "viz-kontrol";
        if (kutu && kutu.parentElement) kutu.parentElement.appendChild(ctrl);

        const bilgi = document.createElement("span");
        bilgi.className = "viz-adim";

        const onceki = this._btn("← Önceki");
        const sonraki = this._btn("Sonraki →");
        const oynat = this._btn("▶ Oynat");
        let cur = 0, timer = null;

        // Okunabilir oynatma hızı + buton etiketleri
        const OYNAT_MS = 2600;
        const ETIKET_OYNAT = "▶ Oynat";
        const ETIKET_DURDUR = "⏸ Durdur";
        const ETIKET_TEKRAR = "↻ Tekrar";   // tüm adımlar bitince: başa sarıp tekrar oynatır

        const guncelle = () => {
            bilgi.textContent = `Adım ${cur + 1}/${toplam}`;
            onceki.disabled = cur === 0;
            sonraki.disabled = cur === toplam - 1;
            // Oynatmıyor ve son adımdaysa → tekrar oynat; değilse normal etiket
            if (!timer && toplam > 1) {
                oynat.textContent = cur >= toplam - 1 ? ETIKET_TEKRAR : ETIKET_OYNAT;
            }
            onChange(cur);
        };

        // Resize'da mevcut adıma geri çizim
        this._kayit(containerId).paint = () => onChange(cur);

        onceki.onclick = () => { if (cur > 0) { cur--; guncelle(); } };
        sonraki.onclick = () => { if (cur < toplam - 1) { cur++; guncelle(); } };
        oynat.onclick = () => {
            if (timer) { clearInterval(timer); timer = null; oynat.textContent = ETIKET_OYNAT; return; }
            if (toplam <= 1) return;
            // Son adımdaysa başa sarıp baştan oynat
            if (cur >= toplam - 1) { cur = 0; guncelle(); }
            oynat.textContent = ETIKET_DURDUR;
            timer = setInterval(() => {
                if (cur >= toplam - 1) {
                    clearInterval(timer); timer = null;
                    oynat.textContent = ETIKET_TEKRAR;
                    return;
                }
                cur++; guncelle();
            }, OYNAT_MS);
        };
        ctrl.append(onceki, bilgi, sonraki, oynat);
        guncelle();

        ctrl.adimOku = () => cur;
        ctrl.adimYaz = n => {
            const y = Math.max(0, Math.min(toplam - 1, Number(n) || 0));
            if (y !== cur) { cur = y; guncelle(); } else guncelle();
        };
        return ctrl;
    },

    _btn(txt) {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = txt;
        b.className = "viz-kontrol-btn";
        b.addEventListener("mousedown", e => e.preventDefault());
        return b;
    },

    /** DPR uyumlu canvas oluşturur; boyut değişince otomatik tekrar çizer.
     *  paint: opsiyonel ilk çizim callback'i (adimKontrol yoksa).
     *  minH: opsiyonel minimum canvas yüksekliği (uzun içerikli interaktifler). */
    canvas2D(mountId, yukseklikOrani = 0.55, paint, minH) {
        const mount = document.getElementById(mountId);
        if (!mount) return null;
        const canvas = document.createElement("canvas");
        mount.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        const kayit = this._kayit(mountId);
        if (paint) kayit.paint = paint;

        const dprHesap = () => Math.min(window.devicePixelRatio || 1, 2);
        const hHesap = w => {
            const taban = Math.max(300, minH || 0);   // dar ekranda dikey alan yeterli olsun
            return Math.round(Math.min(520, Math.max(taban, w * yukseklikOrani)));
        };

        const boyut = { w: 0, h: 0 };

        // Boyut değişmediyse canvas'a dokunma (temizlemeyi önler)
        const bagla = (zorla = false) => {
            const w = mount.clientWidth;
            if (!w) return false;
            const h = hHesap(w);
            const dpr = dprHesap();
            if (!zorla && w === kayit.sonW && h === kayit.sonH && dpr === kayit.sonDpr) return false;
            kayit.sonW = w; kayit.sonH = h; kayit.sonDpr = dpr;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = w + "px";
            canvas.style.height = h + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            boyut.w = w; boyut.h = h;
            mount.style.minHeight = "";   // HTML'deki ölü min-height alanını temizle
            return true;
        };

        let bekliyor = false;
        const tazele = () => {
            if (bekliyor) return;
            bekliyor = true;
            requestAnimationFrame(() => {
                bekliyor = false;
                if (bagla() && kayit.paint) {
                    try { kayit.paint(); }
                    catch (e) { console.error("[viz] yeniden çizim hatası:", e); }
                }
            });
        };

        window.addEventListener("resize", tazele);
        window.addEventListener("orientationchange", tazele);
        if (typeof ResizeObserver !== "undefined") {
            new ResizeObserver(tazele).observe(mount);
        }

        bagla(true);   // ilk ölçüm

        return {
            canvas, ctx,
            get w() { return boyut.w; },
            get h() { return boyut.h; },
            /** Yeniden ölç + tekrar çiz */
            redraw() {
                bekliyor = false;
                if (bagla() && kayit.paint) {
                    try { kayit.paint(); }
                    catch (e) { console.error("[viz] yeniden çizim hatası:", e); }
                }
            },
            setPaint(fn) { kayit.paint = fn; return this; }
        };
    },

    /** Three.js sahne iskeleti — mount id'ye renderer, scene, camera ve resize desteği verir */
    async threeSahne(mountId, kameraZ = 8) {
        const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js");
        const mount = document.getElementById(mountId);
        if (!mount) return null;

        const oran = 0.6;
        const olc = () => {
            const w = mount.clientWidth || 1;
            const h = Math.max(260, Math.min(480, Math.round(w * oran)));
            return { w, h };
        };
        let { w, h } = olc();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x090b10);
        const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
        camera.position.z = kameraZ;
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h);
        mount.appendChild(renderer.domElement);
        mount.style.minHeight = "";

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

        // Boyut takibi — değişmediyse renderer'a dokunma
        let sonW = w, sonH = h;
        const yenidenOlc = () => {
            const n = olc();
            if (n.w === sonW && n.h === sonH) return;
            sonW = n.w; sonH = n.h;
            camera.aspect = n.w / n.h; camera.updateProjectionMatrix();
            renderer.setSize(n.w, n.h);
        };
        let bekliyor = false;
        const tazele = () => {
            if (bekliyor) return;
            bekliyor = true;
            requestAnimationFrame(() => { bekliyor = false; yenidenOlc(); });
        };
        window.addEventListener("resize", tazele);
        window.addEventListener("orientationchange", tazele);
        if (typeof ResizeObserver !== "undefined") new ResizeObserver(tazele).observe(mount);

        const render = () => {
            rotX += (hedefX - rotX) * 0.08;
            rotY += (hedefY - rotY) * 0.08;
            group.rotation.x = rotX;
            group.rotation.y = rotY;
            renderer.render(scene, camera);
        };

        return { THREE, scene, camera, renderer, group, render, mountEl: mount };
    },

    /**
     * Metni verilen noktanın etrafına (ortalanmış) yazar; canvas'a SİĞMAZSA
     * fontu küçültür. x konumu kenara yakınsa veya `maks` verilmişse
     * kullanılabilir alan daraltılır (kenarda/kutu içinde taşan başlıklar için).
     */
    ortaYazi(ctx, metin, x, y, renk = "#e8eaf0", boyut = 13, kalin = false, maks) {
        const cw = ctx.canvas.clientWidth || ctx.canvas.width;
        // Ortalanmış metin: x'in iki yanındaki boşluğun küçük olanına sığmalı
        let genislik = Math.max(36, 2 * Math.min(x, cw - x) - 12);
        if (maks) genislik = Math.min(genislik, maks);
        const agirlik = kalin ? "700" : "500";
        let n = boyut;
        ctx.font = `${agirlik} ${n}px Inter, sans-serif`;
        while (n > 7.5 && ctx.measureText(metin).width > genislik) {
            n -= 0.5;
            ctx.font = `${agirlik} ${n}px Inter, sans-serif`;
        }
        ctx.fillStyle = renk;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(metin, x, y);
    },

    /** Metni verilen genişliğe sığdırır; kelime sığmazsa harf harf böler. */
    metniSar(ctx, metin, maksGenislik) {
        const kelimeler = String(metin).split(/\s+/);
        const satirlar = [];
        let satir = "";
        const olc = t => ctx.measureText(t).width;
        const parcala = t => {
            while (olc(t) > maksGenislik && t.length > 1) {
                let kes = t.length;
                while (kes > 1 && olc(t.slice(0, kes)) > maksGenislik) kes--;
                satirlar.push(t.slice(0, kes));
                t = t.slice(kes);
            }
            return t;
        };
        for (const k of kelimeler) {
            const dene = satir ? satir + " " + k : k;
            if (!satir || olc(dene) <= maksGenislik) satir = dene;
            else { satirlar.push(satir); satir = k; }
        }
        if (satir) satirlar.push(parcala(satir));
        // İlk kelimeler zaten taşmışsa (satır başı tek kelime) onları da böl
        for (let i = 0; i < satirlar.length; i++) {
            if (olc(satirlar[i]) > maksGenislik) {
                const parca = [];
                let t = satirlar[i];
                while (olc(t) > maksGenislik && t.length > 1) {
                    let kes = t.length;
                    while (kes > 1 && olc(t.slice(0, kes)) > maksGenislik) kes--;
                    parca.push(t.slice(0, kes));
                    t = t.slice(kes);
                }
                parca.push(t);
                satirlar.splice(i, 1, ...parca);
                i += parca.length - 1;
            }
        }
        return satirlar;
    },

    /**
     * Uzun açıklamaları canvas'a sığdırır: önce fontu küçültür, sığmazsa
     * satıra böler. Dar ekranlarda taşan alt yazılar için.
     *
     * opts:
     *   boyut (11), minBoyut (8), renk, satirArasi (boyut*1.35),
     *   hiza: "orta" | "sol" | "sag", kalin, altEkle (true = ilk satır y'de,
     *   sonrakiler altında; false = son satır y'de, öncekiler üstte)
     * Dönen değer: çizilen toplam yükseklik.
     */
    sarmaliYazi(ctx, metin, x, y, maksGenislik, opts = {}) {
        const boyut = opts.boyut || 11;
        const minBoyut = opts.minBoyut || 8;
        const renk = opts.renk || "#9aa0b4";
        const kalin = !!opts.kalin;
        const hiza = opts.hiza || "orta";
        const altEkle = opts.altEkle !== false;
        const agirlik = kalin ? "700" : "500";

        const maksSatir = opts.maksSatir || 4;
        const aile = opts.font || "Inter, sans-serif";
        let n = boyut, satirlar = [];
        const sar = () => {
            ctx.font = `${agirlik} ${n}px ${aile}`;
            return this.metniSar(ctx, metin, maksGenislik);
        };
        satirlar = sar();
        while (satirlar.length > maksSatir && n > minBoyut) {
            n -= 0.5;
            satirlar = sar();
        }
        if (!satirlar.length) return 0;
        ctx.font = `${agirlik} ${n}px ${aile}`;
        const aralik = Math.round(n * 1.4);
        const toplam = (satirlar.length - 1) * aralik;
        const ilkY = altEkle ? y : y - toplam;

        ctx.fillStyle = renk;
        ctx.textAlign = hiza === "sol" ? "left" : hiza === "sag" ? "right" : "center";
        ctx.textBaseline = "middle";
        satirlar.forEach((s, i) => ctx.fillText(s, x, ilkY + i * aralik));
        return toplam + n;
    },

    /**
     * Uzun açıklamaları canvas yerine HTML olarak canvas'ın altına yazar.
     * Metin doğal olarak sarılır; dar ekranda taşmaz/kesilmez.
     * Aynı mount içinde tek bir öğe kullanır ve metni günceller.
     * Dönen değer: güncellenen <div> öğesi.
     */
    altYazi(mountId, metin, renk) {
        const el = this._altYaziEl(mountId);
        if (!el) return null;
        el.textContent = metin == null ? "" : String(metin);
        if (renk) el.style.color = renk;
        return el;
    },

    /** altYazi için HTML sürümü — yalnızca sayfanın kendi güvenilir metinleriyle kullanın */
    altYaziHTML(mountId, html) {
        const el = this._altYaziEl(mountId);
        if (!el) return null;
        el.innerHTML = html == null ? "" : String(html);
        return el;
    },

    _altYaziEl(mountId) {
        const mount = document.getElementById(mountId);
        if (!mount) return null;
        let el = mount.querySelector(":scope > .viz-alt-yazi");
        if (!el) {
            el = document.createElement("div");
            el.className = "viz-alt-yazi";
            mount.appendChild(el);
        }
        return el;
    },

    /** altYazi'yı temizler (adım değişince içerik kalmaması gereken yerlerde) */
    altYaziTemizle(mountId) {
        const mount = document.getElementById(mountId);
        const el = mount && mount.querySelector(":scope > .viz-alt-yazi");
        if (el) el.textContent = "";
    }
};
