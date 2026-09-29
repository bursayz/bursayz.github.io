// Kumru-2B (vngrs/Kumru-2B) saf-JS BPE encode/decode — tarayıcıda çalışır.
// tokenizer.json yüklenir: { vocab: {token:id}, merges: [[a,b],...] }

const PATTERN = /\d|\p{N}| ?[^\s\p{L}\p{N}]+[\r\n]*|[^\r\n\p{L}\p{N}]?\p{L}+|\s*[\r\n]+|\s+(?!\S)|\s+/gu;

// GPT-2 byte-level alfabe
function byteToUnicode() {
    const bs = [];
    for (let i = "!".charCodeAt(0); i <= "~".charCodeAt(0); i++) bs.push(i);
    for (let i = "¡".charCodeAt(0); i <= "¬".charCodeAt(0); i++) bs.push(i);
    for (let i = "®".charCodeAt(0); i <= "ÿ".charCodeAt(0); i++) bs.push(i);
    const cs = bs.slice();
    let n = 0;
    for (let b = 0; b < 256; b++) {
        if (!bs.includes(b)) { bs.push(b); cs.push(256 + n); n++; }
    }
    const map = new Map();
    bs.forEach((b, i) => map.set(b, String.fromCodePoint(cs[i])));
    return map;
}
const BYTE_ENC = byteToUnicode();
const BYTE_DEC = new Map([...BYTE_ENC].map(([b, c]) => [c, b]));

const TEXT_ENC = new TextEncoder();
const TEXT_DEC = new TextDecoder("utf-8");

export class KumruTokenizer {
    constructor(tokJson) {
        this.vocab = tokJson.model.vocab;            // tokenStr -> id
        this.idToToken = new Array(Object.keys(this.vocab).length);
        for (const [tok, id] of Object.entries(this.vocab)) this.idToToken[id] = tok;

        this.merges = tokJson.model.merges.map(([a, b]) => [a, b]);
        this.bpeRanks = new Map(this.merges.map((m, i) => [m[0] + "" + m[1], i]));

        this.specials = new Map(); // "<BOS>" -> id
        for (const t of tokJson.added_tokens) if (t.special) this.specials.set(t.content, t.id);
        this.specialTokens = Object.fromEntries(this.specials);
    }

    // --- encode ---
    encode(text) {
        const parts = text.match(PATTERN) ?? [];
        const ids = [];
        for (const part of parts) {
            const bytes = TEXT_ENC.encode(part);
            const token = [...bytes].map(b => BYTE_ENC.get(b)).join("");
            for (const t of this.bpe(token)) ids.push(this.vocab[t]);
        }
        return ids;
    }

    bpe(token) {
        let word = [...token];
        if (word.length === 1) return word;
        while (true) {
            let bestRank = Infinity, bestPos = -1;
            for (let i = 0; i < word.length - 1; i++) {
                const r = this.bpeRanks.get(word[i] + word[i + 1]);
                if (r !== undefined && r < bestRank) { bestRank = r; bestPos = i; }
            }
            if (bestPos < 0) break;
            const merged = word[bestPos] + word[bestPos + 1];
            word.splice(bestPos, 2, merged);
        }
        return word;
    }

    // --- decode ---
    decode(ids) {
        let out = "";
        let byteBuf = [];
        const flush = () => {
            if (byteBuf.length) { out += TEXT_DEC.decode(Uint8Array.from(byteBuf)); byteBuf = []; }
        };
        for (const id of ids) {
            const tok = this.idToToken[id];
            if (tok === undefined) continue;
            if (tok.startsWith("<") && tok.endsWith(">") && this.specials.has(tok)) { flush(); out += tok; continue; }
            for (const ch of tok) {
                const b = BYTE_DEC.get(ch);
                if (b === undefined) { flush(); out += ch; } // güvenlik: beklenmedik char
                else byteBuf.push(b);
            }
        }
        flush();
        return out;
    }

    tokenToString(id) {
        return this.decode([id]);
    }
}

export async function loadKumruTokenizer(url, onProgress) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("tokenizer.json indirilemedi: " + res.status);
    const total = Number(res.headers.get("Content-Length")) || 0;
    let loaded = 0;
    const chunks = [];
    const reader = res.body.getReader();
    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        if (onProgress) onProgress(loaded, total);
    }
    const buf = new Uint8Array(loaded);
    let off = 0;
    for (const c of chunks) { buf.set(c, off); off += c.length; }
    return new KumruTokenizer(JSON.parse(TEXT_DEC.decode(buf)));
}
