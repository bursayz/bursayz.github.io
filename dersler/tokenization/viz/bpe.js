// Tokenization — Gerçek tokenizer görselleştirmesi
// cl100k_base: gpt-tokenizer (saf-JS tiktoken portu, jsDelivr CDN)
// Kumru-2B:    vngrs/Kumru-2B tokenizer.json (Türkçe BPE, HF CDN) + viz/kumru-bpe.js
(function () {
    function baslat() {
        const input = document.getElementById("bpe-input");
        const output = document.getElementById("bpe-output");
        const secici = document.getElementById("bpe-tokenizer-sec");
        const durum = document.getElementById("bpe-durum");
        if (!input || !output || !secici) return;
        kur(input, output, secici, durum);
    }
    // Module script'ler "defer"dır; DOM hazırsa hemen, değilse DOMContentLoaded'da kur.
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", baslat, { once: true });
    } else {
        baslat();
    }
})();

function kur(input, output, secici, durum) {
    const RENKLER = ["#56a605", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444", "#22d3ee", "#84cc16", "#fb923c"];

    const TOKENIZERLAR = {
        cl100k: {
            ad: "cl100k_base (GPT-4 / GPT-3.5)",
            yukleyici: async () => {
                const mod = await import(
                    "https://cdn.jsdelivr.net/npm/gpt-tokenizer@4.0.0/esm/encoding/cl100k_base.js"
                );
                return {
                    encode: (s) => mod.encode(s),
                    tokenStr: (id) => mod.decode([id]),
                    kaynak: "gpt-tokenizer (tiktoken JS portu)",
                };
            },
        },
        kumru: {
            ad: "Kumru-2B (Türkçe BPE — vngrs)",
            yukleyici: async (ilerleme) => {
                const { loadKumruTokenizer } = await import("./kumru-bpe.js");
                const tok = await loadKumruTokenizer(
                    "https://huggingface.co/vngrs/Kumru-2B/resolve/main/tokenizer.json",
                    ilerleme
                );
                return {
                    encode: (s) => tok.encode(s),
                    tokenStr: (id) => tok.tokenToString(id),
                    kaynak: "vngrs/Kumru-2B tokenizer.json",
                };
            },
        },
    };

    // Yüklenen tokenizer'ları önbellekle (tekrar seçimde indirme yok)
    const cache = new Map(); // anahtar -> hazır tokenizer objesi
    let aktifAnahtar = null;
    let renderSirasi = 0; // yarış durumunu önle

    function durumYaz(mesaj, hata = false) {
        if (!durum) return;
        durum.textContent = mesaj || "";
        durum.style.color = hata ? "#ef4444" : "var(--edu-text-dim)";
    }

    async function tokenizerGetir(anahtar) {
        if (cache.has(anahtar)) return cache.get(anahtar);
        const t = TOKENIZERLAR[anahtar];
        const yuklenen = await t.yukleyici((yuk, toplam) => {
            if (toplam) {
                const yuzde = Math.round((yuk / toplam) * 100);
                const mb = (yuk / 1048576).toFixed(1);
                durumYaz(`Kumru tokenizer indiriliyor... ${mb} MB (%${yuzde})`);
            }
        });
        cache.set(anahtar, yuklenen);
        return yuklenen;
    }

    function tokenlariCiz(parcalalar, ids) {
        const n = ids.length;
        let html = `<div style="color:var(--edu-text-dim);font-size:0.75rem;margin-bottom:0.5rem">${n} token üretildi:</div><div style="display:flex;flex-wrap:wrap;gap:4px">`;
        for (let i = 0; i < n; i++) {
            const renk = RENKLER[i % RENKLER.length];
            const parcaGoster = parcalalar[i].replace(/ /g, "␣").replace(/\n/g, "↵");
            html += `<span style="
                background:${renk}22;border:1px solid ${renk}55;border-radius:5px;
                padding:2px 7px;font-family:'JetBrains Mono',monospace;font-size:0.82rem;
                color:${renk};
            " title="Token ID: ${ids[i]}">${parcaGoster}</span>`;
        }
        html += "</div>";
        html += `<div style="margin-top:0.8rem;padding:0.6rem;background:rgba(0,0,0,0.25);border-radius:6px;
                 font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:#93c5fd;word-break:break-all">
                 token IDs: [${ids.join(", ")}]</div>`;
        output.innerHTML = html;
    }

    async function render() {
        const anahtar = secici.value;
        aktifAnahtar = anahtar;
        const benimSira = ++renderSirasi;
        const metin = input.value;

        let tok;
        try {
            durumYaz(cache.has(anahtar) ? "" : "Tokenizer yükleniyor...");
            tok = await tokenizerGetir(anahtar);
        } catch (e) {
            if (benimSira !== renderSirasi) return;
            durumYaz("Tokenizer yüklenemedi: " + e.message, true);
            return;
        }
        // Kullanıcı beklerken başka seçime geçtiyse veya yazmaya devam ettiyse bırak
        if (benimSira !== renderSirasi || anahtar !== aktifAnahtar) return;
        durumYaz("");

        if (!metin) {
            output.innerHTML = "<em style='color:var(--edu-text-dim)'>Metin girin...</em>";
            return;
        }
        const ids = tok.encode(metin);
        const parcalalar = ids.map(tok.tokenStr);
        tokenlariCiz(parcalalar, ids);
    }

    input.addEventListener("input", render);
    secici.addEventListener("change", render);
    render();
}
