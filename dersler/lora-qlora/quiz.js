// Quiz: LoRA & QLoRA — 10 soru
window.QUIZ_DATA = [
    {
        soru: "LoRA'nın temel fikri nedir?",
        secenekler: [
            "Modeli küçültmek (budama)",
            "Ağırlık değişimini ΔW = A×B düşük ranklı çarpımıyla ifade etmek; W donuk kalır, sadece A ve B öğrenilir",
            "Veri boyutunu sıkıştırmak",
            "Attention yerine CNN kullanmak"
        ],
        dogru: 1,
        aciklama: "LoRA: (d×d) boyutlu ağırlık değişimi yerine (d×r)×(r×d) öğrenir, r≪d. 4096×4096 matrisi r=16 ile 131K parametreye düşürür (16.8M'ye karşı). İleri geçişte: y = Wx + (BA)x — donmuş W + öğrenilen küçük 'yama'."
    },
    {
        soru: "QLoRA, LoRA'ya ne ekler?",
        secenekler: [
            "Daha büyük rank",
            "Temel modelin 4-bit NF4'e quantization'ı — hesaplama bf16'da, saklama 4-bit'te; adaptörler bf16'da eğitilir",
            "Tüm modeli 8-bit yapar",
            "Sadece CPU'da çalışmasını sağlar"
        ],
        dogru: 1,
        aciklama: "QLoRA üç numaradan oluşur: (1) NF4 — LLM ağırlık dağılımı için bilgi-teorik optimal 4-bit tip, (2) Double Quantization — quantization sabitlerine ek 0.4 bit/param tasarruf, (3) Paged Optimizer — OOM'u önler. 7B model 12GB GPU'da eğitilebilir."
    },
    {
        soru: "LoRA adaptörleri eğitim bittiğinde neden 'birleştirilebilir' (merge)?",
        secenekler: [
            "Dosya boyutunu küçültmek için",
            "ΔW = AB bir matris olduğu için W + ΔW tek matriste birleşir — ek inference maliyeti olmadan kalıcı model üretilir",
            "Zorunlu bir adım, birleştirmeden kullanılmaz",
            "Quantization'ı geri almak için"
        ],
        dogru: 1,
        aciklama: "W + AB toplamı geçerli bir ağırlık matrisidir. merge_and_unload() bu hesabı yapar ve temiz bir model çıkarır. Alternatif: ayrı tutun (farklı görevler için farklı adaptörler tak/çıkar — 'bir model, çok kişi' senaryosu)."
    },
    {
        soru: "r=64 LoRA, 4096×4096 ağırlık matrisi için kaç eğitilebilir parametre ekler?",
        secenekler: ["64", "4.096", "524.288 (= 4096×64 + 64×4096)", "16.7 milyon"],
        dogru: 2,
        aciklama: "A: 4096×64 = 262.144, B: 64×4096 = 262.144 → toplam 524.288 parametre. Tam fine-tuning aynı matris için 16.777.216 parametre eğitirdi. %97 daha az parametreyle ~aynı görev performansı."
    },
    {
        soru: "LoRA rank (r) büyütmenin etkisi nedir?",
        secenekler: [
            "Her zaman daha iyi sonuç",
            "Daha fazla ifade gücü ama daha fazla parametre ve overfitting riski; basit görevlerde r=8 yeterli, karmaşık görevlerde r=32-64",
            "Model küçülür",
            "Inference hızlanır"
        ],
        dogru: 1,
        aciklama: "r, düşük boyutlu alt uzayın genişliği. Kısıtlı: r=4 bile style transfer için yeterli olabilir. Karmaşık mantık/kod görevi: r=32+. r=embed_dim'e yaklaşırsa LoRA anlamsızlaşır (tam fine-tuning eşdeğeri, ama verimsiz)."
    },
    {
        soru: "target_modules=[\"q_proj\",\"k_proj\",\"v_proj\",\"o_proj\"] ne demektir?",
        secenekler: [
            "Sadece girdi katmanına LoRA ekle",
            "Attention mekanizmasındaki dört projeksiyon matrisine LoRA adaptörleri ekle — en yaygın ve etkili hedef seti",
            "Modelin sadece çıktı katmanını eğit",
            "Tüm FFN katmanlarını dondur"
        ],
        dogru: 1,
        aciklama: "Attention'daki q, k, v, o projeksiyonları model davranışını en güçlü etkileyen noktalardır. Orijinal LoRA makalesi bunları hedeflemeyi önerir. Bazı çalışmalar FFN (up/down/gate) projeksiyonlarını da ekler — daha çok parametre, bazı görevlerde daha iyi."
    },
    {
        soru: "QLoRA ile 7B model eğitirken hangi hassasiyetler eş zamanlı kullanılır?",
        secenekler: [
            "Her şey FP32",
            "Ağırlıklar 4-bit (NF4), hesaplamalar bfloat16, LoRA adaptörleri bfloat16 — üç hassasiyet aynı anda",
            "Her şey 4-bit",
            "Her şey INT8"
        ],
        dogru: 1,
        aciklama: "Üç katman: (1) W temel ağırlıkları diskte/RAM'de NF4 (4-bit) saklanır, (2) forward pass sırasında bf16'ya dequantize edilir, işlem bf16'da yapılır, (3) LoRA adaptörleri eğitilebilir bf16 olarak kalır. Bellek kazancı muazzam, doğruluk kaybı minimum."
    },
    {
        soru: "lora_alpha / r oranı pratikte neyi kontrol eder?",
        secenekler: [
            "Dosya boyutunu",
            "LoRA çıkışının ölçeğini — efektif öğrenme oranını; α=2r tipik başlangıçtır",
            "Batch size'ı",
            "Token boyutunu"
        ],
        dogru: 1,
        aciklama: "LoRA çıkışı (α/r)·(BA)x şeklinde ölçeklenir. α sabitken r büyütmek adaptör etkisini küçültür. Bazı kütüphaneler (örn. rsLoRA) bu ölçeklemeyi stabilize eder. Pratik kural: α = 2×r güvenli başlangıç."
    },
    {
        soru: "QLoRA eğitiminin tam fine-tuning'e göre dezavantajı nedir?",
        secenekler: [
            "Hiçbir dezavantajı yok",
            "Dequantization overhead'i nedeniyle ~%20-30 daha yavaş; uç görevlerde (çok niş davranışlar) tam fine-tuning'in ulaştığı üst sınıra çıkamayabilir",
            "Çalışmaz, sadece teorik",
            "Sadece İngilizce destekler"
        ],
        dogru: 1,
        aciklama: "Dequantize + forward + backward zincirinde ek hesaplar vardır → LoRA'dan biraz daha yavaştır. Ancak bellek ~4 kat kazanımı ve kalite kaybının çoğu görevde göz ardı edilebilir olması nedeniyle pratikte standart yöntemdir. 70B modeli tek 48GB GPU'da eğitebilen tek yöntem."
    },
    {
        soru: "LoRA neden tam fine-tuning'den daha az katastrofik unutma yaşar?",
        secenekler: [
            "LoRA hiç unutma yapmaz",
            "Temel W donuk kaldığı için genel yetenekler korunur; değişim sadece düşük-rank adaptörlerde birikir",
            "Gradyanları sıfırladığı için",
            "Daha az veri kullandığı için"
        ],
        dogru: 1,
        aciklama: "Pretraining bilgisi W matrisindedir. LoRA W'ye dokunmaz — bilgi fiziksel olarak korunur. Değişim adaptörlerde izole kalır. Ayrıca düşük rank kısıtı değişimin 'alanını' sınırlar — model mevcut davranıştan çok uzaklaşamaz. L7'deki sorunun pratik çözümü budur."
    }
];
