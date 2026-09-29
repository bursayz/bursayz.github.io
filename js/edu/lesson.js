/**
 * Bursa YZGT — Ders Sayfası Ortak Mantığı
 * Her ders sayfasının <body> etiketinde data-slug="..." bulunmalı.
 * Görevleri:
 *  - Breadcrumb + meta + alt navigasyonu otomatik üretmek
 *  - Dersi "okundu" işaretlemek
 *  - Kod bloklarına başlık + kopyala butonu eklemek ve basit Python renklendirmesi yapmak
 *  - Quiz'i başlatmak, auth butonunu render etmek
 *  - window.DERS_VIZ tanımlıysa monte etmek
 */

(function () {
    const slug = document.body.dataset.dersSlug;
    if (!slug) return;
    const ders = dersBul(slug);
    if (!ders) return;
    const seri = SERILER[ders.seri];

    document.body.classList.add(seri.seriClass);

    // --- Breadcrumb ---
    const bc = document.getElementById("ders-breadcrumb");
    if (bc) {
        bc.innerHTML = `
            <a href="../../index.html">Eğitimler</a>
            <span class="ayirac">›</span>
            <a href="../../index.html#seri-${ders.seri}">${seri.ad} Serisi</a>
            <span class="ayirac">›</span>
            <span>${ders.no} — ${ders.baslik}</span>`;
    }

    // --- Okundu işaretle (5 sn sonra — gerçekten okumaya başladıysa) ---
    setTimeout(() => Progress.okunduIsaretle(slug), 5000);

    // --- Alt navigasyon ---
    const nav = document.getElementById("ders-alt-nav");
    if (nav) {
        const onceki = oncekiDers(slug);
        const sonraki = sonrakiDers(slug);
        let html = "";
        if (onceki) {
            html += `<a class="geri" href="../${onceki.slug}/">
                <span class="nav-yon">← Önceki Ders</span>
                <span class="nav-baslik">${onceki.no} — ${onceki.baslik}</span>
            </a>`;
        } else {
            html += `<a class="geri" href="../../index.html">
                <span class="nav-yon">← Eğitim Kataloğu</span>
                <span class="nav-baslik">Tüm Dersler</span>
            </a>`;
        }
        if (sonraki) {
            html += `<a class="ileri" id="sonraki-ders-link" href="../${sonraki.slug}/">
                <span class="nav-yon">Sonraki Ders →</span>
                <span class="nav-baslik">${sonraki.no} — ${sonraki.baslik}</span>
            </a>`;
        } else {
            html += `<a class="ileri" href="../../index.html">
                <span class="nav-yon">Bitirdiniz! →</span>
                <span class="nav-baslik">Kataloğa Dön 🎉</span>
            </a>`;
        }
        nav.innerHTML = html;
    }

    // --- Kod blokları: başlık + kopyala + mini renklendirme ---
    document.querySelectorAll("pre > code").forEach(code => {
        const pre = code.parentElement;
        const wrapper = document.createElement("div");
        wrapper.className = "kod-blok";
        pre.parentNode.insertBefore(wrapper, pre);

        const baslik = document.createElement("div");
        baslik.className = "kod-baslik";
        const dil = (code.className.match(/language-(\w+)/) || [null, "python"])[1];
        baslik.innerHTML = `<span>${dil}</span>`;
        const btn = document.createElement("button");
        btn.className = "kopyala-btn";
        btn.type = "button";
        btn.textContent = "Kopyala";
        btn.addEventListener("click", () => {
            navigator.clipboard.writeText(code.textContent).then(() => {
                btn.textContent = "Kopyalandı ✓";
                setTimeout(() => (btn.textContent = "Kopyala"), 1500);
            });
        });
        baslik.appendChild(btn);
        wrapper.appendChild(baslik);
        wrapper.appendChild(pre);

        // Mini Python renklendirmesi (regex tabanlı, kütüphanesiz)
        if (dil === "python" || dil === "py") {
            let t = code.innerHTML;
            t = t
                .replace(/(#[^\n]*)/g, '<span class="tok-comment">$1</span>')
                .replace(/\b(import|from|def|return|if|else|elif|for|while|in|not|and|or|class|with|as|None|True|False|print|len|range|lambda|try|except|raise|pass|break|continue)\b/g, '<span class="tok-keyword">$1</span>')
                .replace(/(&#39;[^&]*?&#39;|&quot;.*?&quot;|"[^"\n]*?"|'[^'\n]*?')/g, '<span class="tok-string">$1</span>')
                .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>');
            code.innerHTML = t;
        }
    });

    // --- Quiz ---
    QuizEngine.init(slug);

    // --- Auth butonu (sayfada varsa) ---
    if (typeof GitHubAuth !== "undefined") {
        GitHubAuth.authButonuRender("auth-slot");
    }

    // --- Görselleştirme ---
    if (window.DERS_VIZ && window.DERS_VIZ[ders.viz]) {
        window.DERS_VIZ[ders.viz]();
    }
})();
