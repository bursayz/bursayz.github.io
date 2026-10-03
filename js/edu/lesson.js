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
            <a href="../../egitim.html">Eğitimler</a>
            <span class="ayirac">›</span>
            <a href="../../egitim.html#seri-${ders.seri}">${seri.ad} Serisi</a>
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
            html += `<a class="geri" href="../../egitim.html">
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
            html += `<a class="ileri" href="../../egitim.html">
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

        // Mini Python renklendirmesi (token tabanlı, kütüphanesiz)
        if (dil === "python" || dil === "py") {
            // Önce plain text al (bozuk HTML'den kurtul)
            const src = code.textContent;

            const COMMENT_RE = /#[^\n]*/g;
            const STRING_RE = /('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g;
            const KEYWORDS_RE = /\b(import|from|def|return|if|else|elif|for|while|in|not|and|or|class|with|as|None|True|False|print|len|range|lambda|try|except|raise|pass|break|continue)\b/g;
            const NUMBER_RE = /\b\d+\.?\d*\b/g;

            const tokens = [];
            for (const t of src.matchAll(COMMENT_RE)) tokens.push({ start: t.index, end: t.index + t[0].length, type: 'comment', text: t[0] });
            for (const t of src.matchAll(STRING_RE)) tokens.push({ start: t.index, end: t.index + t[0].length, type: 'string', text: t[0] });
            for (const t of src.matchAll(KEYWORDS_RE)) tokens.push({ start: t.index, end: t.index + t[0].length, type: 'keyword', text: t[0] });
            for (const t of src.matchAll(NUMBER_RE)) tokens.push({ start: t.index, end: t.index + t[0].length, type: 'number', text: t[0] });

            // Öncelik: comment > string > keyword > number (uzunluk > başlangıç)
            tokens.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

            let out = '', prevEnd = 0;
            for (const tk of tokens) {
                if (tk.start >= prevEnd) {
                    out += src.slice(prevEnd, tk.start);
                    out += `<span class="tok-${tk.type}">${tk.text}</span>`;
                    prevEnd = tk.end;
                }
            }
            out += src.slice(prevEnd);
            code.innerHTML = out;
        }
    });

    // --- Geniş tablolar: mobilde taşmasın diye kaydırılabilir sarmalayıcı ---
    document.querySelectorAll(".ders-icerik table, .kaynaklar-kutu table").forEach(tab => {
        if (tab.parentElement && tab.parentElement.classList.contains("tablo-kaydir")) return;
        const sarmalayici = document.createElement("div");
        sarmalayici.className = "tablo-kaydir";
        tab.parentNode.insertBefore(sarmalayici, tab);
        sarmalayici.appendChild(tab);
    });

    // --- Quiz ---
    QuizEngine.init(slug);

    // --- Auth butonu (sayfada varsa) ---
    if (typeof GitHubAuth !== "undefined") {
        GitHubAuth.authButonuRender("auth-slot");
    }

    // --- Görselleştirme ---
    const vizKutusu = document.querySelector(".viz-kutu");
    const VIZ_IPUCU = "Reklam engelleyiciler (uBlock Origin vb.) bazı etkileşim betiklerini engelleyebilir — bu sitede engelleyiciyi duraklatıp sayfayı yenileyin.";

    const vizHataKutusuEkle = (kutu, sebep) => {
        if (!kutu || kutu.querySelector(".viz-hata")) return;
        const hataEl = document.createElement("div");
        hataEl.className = "viz-hata";
        const neden = document.createElement("div");
        neden.className = "viz-hata-neden";
        neden.textContent = sebep;
        const ipucu = document.createElement("div");
        ipucu.className = "viz-hata-ipucu";
        ipucu.textContent = VIZ_IPUCU;
        hataEl.append(neden, ipucu);
        kutu.appendChild(hataEl);
    };
    const vizHataGoster = (hata) => {
        const sebep = (hata && (hata.message || String(hata))) || "Bilinmeyen hata";
        console.error("[viz] görselleştirme başlatılamadı:", hata);
        vizHataKutusuEkle(vizKutusu, "Bu interaktif başlatılamadı: " + String(sebep).slice(0, 160));
    };
    const vizCagir = () => {
        if (!(window.DERS_VIZ && ders.viz && window.DERS_VIZ[ders.viz])) return false;
        try {
            const sonuc = window.DERS_VIZ[ders.viz]();
            if (sonuc && typeof sonuc.catch === "function") sonuc.catch(vizHataGoster);
        } catch (e) {
            vizHataGoster(e);
        }
        return true;
    };

    if (!vizCagir() && vizKutusu) {
        // Modül script'ler (ör. tokenization'ın kendi HTML interaktifi) sonra
        // çalışır; gecikmeli kontrol edilsin ki yanlış uyarı verilmesin.
        // "Boş kutu" = başlık/noscript dışında içerik yok VE mount boş.
        setTimeout(() => {
            const kutuBos = Array.from(vizKutusu.children)
                .filter(c => !c.classList.contains("viz-baslik") && c.tagName !== "NOSCRIPT")
                .every(c => c.classList.contains("viz-mount") && c.children.length === 0);
            if (!kutuBos) return;
            if (vizCagir()) return;
            // Betik engellenmiş/kopmuşsa bir kez cache-bust ile yeniden yüklemeyi dene
            const vizScript = document.querySelector('script[src*="/viz/"]');
            if (vizScript && !vizScript.dataset.retry) {
                const yeni = document.createElement("script");
                yeni.src = vizScript.src + (vizScript.src.includes("?") ? "&" : "?") + "retry=" + Date.now();
                yeni.dataset.retry = "1";
                yeni.onload = () => {
                    if (!vizCagir()) vizHataKutusuEkle(vizKutusu, "Etkileşim betiği engellenmiş görünüyor: viz/" + (vizScript.src.split("/").pop() || ""));
                };
                yeni.onerror = () => vizHataKutusuEkle(vizKutusu, "Etkileşim betiği yüklenemedi: viz/" + (vizScript.src.split("/").pop() || ""));
                document.head.appendChild(yeni);
                return;
            }
            vizHataKutusuEkle(vizKutusu, "Etkileşim kaydı yok (" + ders.viz + ").");
        }, 600);
    }

    // Özel montajlı interaktiflerin gereksiz min-height ölü alanını temizle
    setTimeout(() => {
        document.querySelectorAll(".viz-mount").forEach(m => {
            if (m.children.length) m.style.minHeight = "";
        });
    }, 1000);

    // Sessizce boş kalan montajlara görünür mesaj (async 3D beklemesi için gecikmeli)
    setTimeout(() => {
        document.querySelectorAll(".viz-mount").forEach(m => {
            if (m.children.length) return;
            const kutu = m.closest(".viz-kutu");
            vizHataKutusuEkle(kutu, "Bu interaktif yüklenemedi — betik çalışmadı.");
        });
    }, 4000);
})();
