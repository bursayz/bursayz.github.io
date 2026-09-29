/**
 * Bursa YZGT — Sınav Motoru
 * Ders sayfalarındaki quizleri render eder, değerlendirir, ilerlemeyi kaydeder.
 * Quiz verisi: ders sayfasında <script> içinde window.QUIZ_DATA olarak tanımlanır
 * veya ders/<slug>/quiz.json'dan fetch edilir.
 */

const QuizEngine = {
    slug: null,
    sorular: [],
    container: null,

    async init(slug) {
        this.slug = slug;
        this.container = document.getElementById("quiz-kutu");
        if (!this.container) return;

        // Önce window.QUIZ_DATA'ya bak, yoksa quiz.json yükle
        if (window.QUIZ_DATA && window.QUIZ_DATA.length) {
            this.sorular = window.QUIZ_DATA;
        } else {
            try {
                const res = await fetch(`quiz.json`);
                if (!res.ok) throw new Error();
                this.sorular = await res.json();
            } catch {
                this.container.innerHTML = '<p class="quiz-altbilgi">Sınav henüz hazırlanıyor.</p>';
                return;
            }
        }
        this.render();
    },

    render() {
        const esik = typeof GECME_ESIGI !== "undefined" ? GECME_ESIGI : 70;
        let html = `
            <h2 id="sinav">Bölüm Sınavı</h2>
            <p class="quiz-altbilgi">${this.sorular.length} soru · Geçme notu: %${esik} · Sonraki dersin "tamamlandı" kilidini açmak için bu sınavı geçin.</p>
            <form id="quiz-form">
        `;

        this.sorular.forEach((s, si) => {
            html += `<div class="quiz-soru">
                <div class="soru-metin"><span class="soru-no">${si + 1}</span>${s.soru}</div>
                <div class="quiz-secenekler">`;
            s.secenekler.forEach((sec, ci) => {
                const harf = String.fromCharCode(97 + ci); // a, b, c...
                html += `
                    <label class="quiz-secenek" id="secenek-${si}-${ci}">
                        <input type="radio" name="soru-${si}" value="${ci}">
                        <span><b>${harf})</b>&nbsp; ${sec}</span>
                    </label>`;
            });
            html += `</div>
                <div class="quiz-cevap-notu" id="not-${si}">${s.aciklama || ""}</div>
            </div>`;
        });

        html += `
                <button type="submit" class="quiz-gonder-btn">Sınavı Değerlendir</button>
            </form>
            <div class="quiz-sonuc" id="quiz-sonuc"></div>
        `;

        this.container.innerHTML = html;

        document.getElementById("quiz-form").addEventListener("submit", (e) => {
            e.preventDefault();
            this.degerlendir();
        });

        // Daha önce geçildiyse bildir
        if (Progress.quizGectiMi(this.slug)) {
            const bilgi = document.createElement("p");
            bilgi.style.cssText = "margin-top:1rem;font-size:0.82rem;color:var(--accent-2,#8fd94a);";
            bilgi.textContent = "✓ Bu sınavı daha önce geçtiniz. Tekrar deneyebilirsiniz.";
            this.container.appendChild(bilgi);
        }
    },

    degerlendir() {
        let dogru = 0;
        let cevaplanmamis = false;

        this.sorular.forEach((s, si) => {
            const secili = document.querySelector(`input[name="soru-${si}"]:checked`);
            if (!secili) { cevaplanmamis = true; return; }
            const cevap = parseInt(secili.value, 10);
            const dogruMu = cevap === s.dogru;

            // Renk işaretleme
            s.secenekler.forEach((_, ci) => {
                const el = document.getElementById(`secenek-${si}-${ci}`);
                el.style.borderColor = "";
                el.style.opacity = "";
                if (ci === s.dogru) {
                    el.style.borderColor = "#56a605";
                    el.style.background = "rgba(86,166,5,0.1)";
                } else if (ci === cevap && !dogruMu) {
                    el.style.borderColor = "#ef4444";
                    el.style.background = "rgba(239,68,68,0.08)";
                }
            });

            if (dogruMu) dogru++;
            const not = document.getElementById(`not-${si}`);
            if (not && not.textContent.trim()) not.classList.add("goster");
        });

        if (cevaplanmamis) {
            // Tüm soruların cevaplanmasını iste
            const ilkBos = this.sorular.findIndex((s, si) => !document.querySelector(`input[name="soru-${si}"]:checked`));
            const bosEl = document.querySelector(`input[name="soru-${ilkBos}"]`);
        }

        const sonuc = Progress.quizSonucKaydet(this.slug, dogru, this.sorular.length);
        const esik = typeof GECME_ESIGI !== "undefined" ? GECME_ESIGI : 70;
        const sonucEl = document.getElementById("quiz-sonuc");

        if (sonuc.gecti) {
            sonucEl.className = "quiz-sonuc gecti";
            sonucEl.innerHTML = `
                <div class="rozet-animasyon">🏆</div>
                <div class="skor">%${sonuc.yuzde}</div>
                <p><strong>Tebrikler, geçtiniz!</strong></p>
                <p>${dogru}/${this.sorular.length} soruya doğru cevap verdiniz. Sonraki dersin kilidi açıldı.</p>
            `;
            // Alt navigasyondaki sonraki dersi aç
            const sonrakiBtn = document.getElementById("sonraki-ders-link");
            if (sonrakiBtn) sonrakiBtn.classList.remove("kilitli");
        } else {
            sonucEl.className = "quiz-sonuc kaldi";
            sonucEl.innerHTML = `
                <div class="skor">%${sonuc.yuzde}</div>
                <p><strong>Henüz geçmediniz.</strong></p>
                <p>${dogru}/${this.sorular.length} doğru. Geçmek için %${esik} gerekiyor. Cevap açıklamalarına göz atın ve tekrar deneyin.</p>
            `;
        }

        sonucEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
};
