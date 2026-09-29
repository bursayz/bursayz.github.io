/**
 * Bursa YZGT — İlerleme Sistemi
 * localStorage tabanlı, GitHub Gist senkron destekli.
 * Veri şeması:
 * {
 *   dogruluk: { [slug]: { gecti: bool, skor: number, tarih: "ISO" } },
 *   okunanlar: { [slug]: "ISO tarih" },
 *   baslangic: "ISO tarih"
 * }
 */

const PROGRESS_KEY = "bursayz_progress_v1";
const GIST_FILENAME = "bursayz-egitim-progress.json";
const GECME_ESIGI = 70; // %

const Progress = {
    data: null,

    load() {
        try {
            const raw = localStorage.getItem(PROGRESS_KEY);
            this.data = raw ? JSON.parse(raw) : this._bosVeri();
        } catch {
            this.data = this._bosVeri();
        }
        if (!this.data.dogruluk) this.data.dogruluk = {};
        if (!this.data.okunanlar) this.data.okunanlar = {};
        return this.data;
    },

    _bosVeri() {
        return { dogruluk: {}, okunanlar: {}, baslangic: new Date().toISOString() };
    },

    save() {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(this.data));
        // Gist'e arka planda senkron (giriş yapıldıysa)
        if (typeof GitHubAuth !== "undefined" && GitHubAuth.isLoggedIn()) {
            GitHubAuth.syncProgress().catch(() => {});
        }
    },

    quizSonucKaydet(slug, dogruSayisi, toplamSoru) {
        const yuzde = Math.round((dogruSayisi / toplamSoru) * 100);
        const gecti = yuzde >= GECME_ESIGI;
        const onceki = this.data.dogruluk[slug];
        // En iyi skoru tut
        if (!onceki || !onceki.gecti || yuzde > onceki.skor) {
            this.data.dogruluk[slug] = { gecti: gecti || (onceki && onceki.gecti), skor: Math.max(yuzde, onceki ? onceki.skor : 0), tarih: new Date().toISOString() };
        }
        this.save();
        return { yuzde, gecti: this.data.dogruluk[slug].gecti };
    },

    okunduIsaretle(slug) {
        this.data.okunanlar[slug] = new Date().toISOString();
        this.save();
    },

    quizGectiMi(slug) {
        return !!(this.data.dogruluk[slug] && this.data.dogruluk[slug].gecti);
    },

    dersDurum(slug) {
        const q = this.data.dogruluk[slug];
        if (q && q.gecti) return "tamamlandi";
        if (q || this.data.okunanlar[slug]) return "devam";
        return "baslanmadi";
    },

    genelIlerleme() {
        const toplam = DERSLER.length;
        const tamamlanan = DERSLER.filter(d => this.quizGectiMi(d.slug)).length;
        return { toplam, tamamlanan, yuzde: toplam ? Math.round((tamamlanan / toplam) * 100) : 0 };
    },

    seriIlerleme(seriAdi) {
        const dersler = seriDersleri(seriAdi);
        const tamam = dersler.filter(d => this.quizGectiMi(d.slug)).length;
        return { toplam: dersler.length, tamamlanan: tamam };
    },

    kazanilanRozetler() {
        const rozetler = [];
        for (const [seriAdi, seri] of Object.entries(SERILER)) {
            const i = this.seriIlerleme(seriAdi);
            if (i.toplam > 0 && i.tamamlanan === i.toplam) rozetler.push(seri.ad);
        }
        return rozetler;
    },

    toplamQuizSayisi() {
        return Object.keys(this.data.dogruluk).length;
    },

    siradakiTavsiye() {
        // İlk tamamlanmamış dersi öner
        for (const d of DERSLER) {
            if (!this.quizGectiMi(d.slug)) return d;
        }
        return null;
    },

    tumunuSifirla() {
        this.data = this._bosVeri();
        localStorage.removeItem(PROGRESS_KEY);
        if (typeof GitHubAuth !== "undefined" && GitHubAuth.isLoggedIn()) {
            GitHubAuth.syncProgress().catch(() => {});
        }
    },

    // Gist'ten gelen veriyi yerelle birleştir (en güncel/en iyi skor kazanır)
    merge(remote) {
        if (!remote) return;
        for (const [slug, r] of Object.entries(remote.dogruluk || {})) {
            const l = this.data.dogruluk[slug];
            if (!l || r.skor > l.skor || (r.gecti && !l.gecti)) this.data.dogruluk[slug] = r;
        }
        for (const [slug, t] of Object.entries(remote.okunanlar || {})) {
            const l = this.data.okunanlar[slug];
            if (!l || t > l) this.data.okunanlar[slug] = t;
        }
        this.save();
    }
};

Progress.load();
