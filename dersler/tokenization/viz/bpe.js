// Tokenization — Canlı BPE görselleştirmesi
window.DERS_VIZ = window.DERS_VIZ || {};

window.DERS_VIZ["2d-bpe"] = function () {
    const input = document.getElementById("bpe-input");
    const output = document.getElementById("bpe-output");
    if (!input || !output) return;

    // Basit eğitimli BPE tokenizer simülasyonu
    // Yaygın Türkçe/İngilizce alt-kelime grupları
    const YAYGIN_TOKENLAR = [
        "yapay", "zeka", "öğren", "iyor", "lar", "ler", "mek", "mak", "geliştir",
        "topluluk", "bursa", "model", "eğit", "sinir", "ağ", "derin", "öğrenme",
        "veri", "girdi", "çıktı", "token", "ve", "ile", "için", "bir", "bu",
        "the", "and", "ing", "tion", "er", "is", "it", "in", "on", "at",
        "learn", "model", "train", "neural", "network", "deep", "ai"
    ];

    const RENKLER = ["#56a605","#3b82f6","#f59e0b","#a855f7","#ef4444","#22d3ee","#84cc16","#fb923c"];

    function tokenize(metin) {
        if (!metin.trim()) return [];
        const tokenlar = [];
        let i = 0, id = 1000;
        metin = metin.toLowerCase();
        while (i < metin.length) {
            let eslesti = false;
            for (const t of YAYGIN_TOKENLAR) {
                if (metin.startsWith(t, i)) {
                    tokenlar.push({ parca: metin.slice(i, i + t.length), id: id++, uzunluk: t.length, tip: "ortak" });
                    i += t.length;
                    eslesti = true;
                    break;
                }
            }
            if (!eslesti) {
                // Boşluk veya tek karakter
                const ch = metin[i];
                tokenlar.push({ parca: ch === " " ? "␣" : ch, id: id++, uzunluk: 1, tip: ch === " " ? "bosluk" : "tek" });
                i++;
            }
        }
        return tokenlar;
    }

    function render() {
        const metin = input.value;
        const tokenlar = tokenize(metin);
        if (!tokenlar.length) { output.innerHTML = "<em style='color:var(--edu-text-dim)'>Metin girin...</em>"; return; }
        const ACCENT = VizHelpers.accentRenk();
        let html = `<div style="color:var(--edu-text-dim);font-size:0.75rem;margin-bottom:0.5rem">${tokenlar.length} token üretildi:</div><div style="display:flex;flex-wrap:wrap;gap:4px">`;
        tokenlar.forEach((t, i) => {
            const renk = RENKLER[i % RENKLER.length];
            html += `<span style="
                background:${renk}22;border:1px solid ${renk}55;border-radius:5px;
                padding:2px 7px;font-family:'JetBrains Mono',monospace;font-size:0.82rem;
                color:${renk};
            " title="Token ID: ${t.id}">${t.parca}</span>`;
        });
        html += "</div>";

        // ID listesi
        html += `<div style="margin-top:0.8rem;padding:0.6rem;background:rgba(0,0,0,0.25);border-radius:6px;
                 font-family:'JetBrains Mono',monospace;font-size:0.78rem;color:#93c5fd">
                 token IDs: [${tokenlar.map(t => t.id).join(", ")}]</div>`;
        output.innerHTML = html;
    }

    input.addEventListener("input", render);
    render();
};
