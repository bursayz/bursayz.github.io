// Quiz: Pretraining — 10 soru
window.QUIZ_DATA = [
    {
        soru: "FLOPs ≈ 6 × N × D formülünde N ve D nedir?",
        secenekler: [
            "N = veri boyutu, D = derinlik",
            "N = parametre sayısı, D = eğitim token sayısı",
            "N = nöron sayısı, D = gün",
            "N = katman sayısı, D = dropout oranı"
        ],
        dogru: 1,
        aciklama: "6N·D: her token için ileri geçiş ~2N FLOP (tahmin), geriye yayılım ~4N FLOP (öğrenme). 7B parametre × 1T token = 4.2×10²² FLOP. Bu hesap, 'bu model kaç günde eğitilir?' sorusunu tahmin etmeyi sağlar."
    },
    {
        soru: "Chinchilla (DeepMind, 2022) hangi önemli bulguyu ortaya koydu?",
        secenekler: [
            "Büyük modeller her zaman daha iyidir",
            "Çoğu LLM az veriyle aşırı büyük eğitilmişti — hesaplama-optimum oran ~20 token/parametre'dir",
            "Küçük modeller eğitilemez",
            "Veri boyutu performansı etkilemez"
        ],
        dogru: 1,
        aciklama: "Chinchilla bulgusu: aynı hesaplama bütçesiyle, daha KÜÇÜK model + daha ÇOK veri, daha BÜYÜK model + daha AZ veriden daha iyi sonuç verir. Optimum ~20 token/parametre. Llama-3 8B ~15T token (1875 token/parametre!) ile Chinchilla'nın bile üstünde eğitildi — bu yüzden inanılmaz performans gösterdi."
    },
    {
        soru: "Pretraining sonrası temel model (base model), 'Türkiye'nin başkenti nedir?' girdisine nasıl tepki verir?",
        secenekler: [
            "'Ankara' diye net cevap verir",
            "Soruyu yanıtlamaz; metni sürdürür — çünkü sadece 'sonraki token tahmini' oyununu öğrendi, asistan davranışı henüz yok",
            "Hata mesajı verir",
            "Sadece İngilizce yanıt verir"
        ],
        dogru: 1,
        aciklama: "Temel model bir 'metin tamamlama makinesi'dir: internette böyle bir sorunun ardından genellikle sınav seçenekleri, benzer sorular, forum tartışmaları gelir — onu üretir. 'Soruyu anla ve net yanıt ver' (asistan davranışı) SFT (L7) dersinde öğretilen AYRI bir aşamadır."
    },
    {
        soru: "Kayıp eğrisinde ani bir yükseliş (loss spike) gözlenirse ne yapılmalıdır?",
        secenekler: [
            "Eğitimi durdurup her şeyi silmek",
            "Son sağlıklı checkpoint'e dönüp eğitime oradan devam etmek; öğrenme oranını (LR) gözden geçirmek",
            "Önemsememek, kendiliğinden düzelir",
            "Modeli büyütmek"
        ],
        dogru: 1,
        aciklama: "Spike nedenleri: bozuk veri batch'i, LR çok yüksek, gradient patlaması veya donanım arızası. Checkpoint sistemi tam bu yüzden vardır — haftalar süren eğitimde düzenli kayıtlar. Llama-3 eğitiminde Meta, 16K GPU'luk kümede günde birkaç donanım arızasıyla karşılaştı — otomatik kurtarma olmadan eğitim bitirilemezdi bile."
    },
    {
        soru: "Veri hazırlamada 'deduplication' (kopya kaldırma) neden kritiktir?",
        secenekler: [
            "Disk alanı tasarrufu için",
            "Aynı metni tekrar tekrar gören model onu ezberler (memorization), genelleme yeteneği düşer; ayrıca hesaplama israfıdır",
            "Tokenizer'ı hızlandırmak için",
            "Yasal zorunluluk, başka sebebi yok"
        ],
        dogru: 1,
        aciklama: "İnternet verisi bolca kopya içerir (alıntılar, mirror siteler, boilerplate). Tekrarlanan metinler modelde ezber davranışını artırır ve etkin veri çeşitliliğini düşürür. Kopya kaldırma + kalite filtreleme, veri miktarı artırmaktan çok daha etkilidir. Llama-3 ekibi 3 seviyeli dedup kullandı: URL, belge, satır."
    },
    {
        soru: "Veri karışımında kod (GitHub) verisinin bulunmasının yan faydası nedir?",
        secenekler: [
            "Sadece programlama sorularını yanıtlamak",
            "Kod okuyan modeller mantıksal akıl yürütmede (reasoning) ölçülebilir iyileşme gösterir — yapısallık ve adım-adımlık öğrenir",
            "API maliyetini düşürür",
            "Tokenizasyonu kolaylaştırır"
        ],
        dogru: 1,
        aciklama: "Kod: kesin sözdizimi, uzun bağımlılık zincirleri (fonksiyon çağrıları), hata ayıklama örüntüleri ve adım-adım yordamlar içerir. Bu özellikler mantıklı düşünmeyi destekler. Codex (2021) ve sonraki çalışmalar, %10-15 kod verisinin genel akıl yürütme performansını da artırdığını gösterdi."
    },
    {
        soru: "Pratik alıştırma: 8 A100 GPU ile 30 günde (%50 verimle) Chinchilla-optimal yaklaşık kaç parametreli bir model eğitebilirsiniz?",
        secenekler: ["~1 milyar", "~5 milyar", "~70 milyar", "~500 milyar"],
        dogru: 1,
        aciklama: "Toplam FLOPs = 8×30×86400×3×10¹⁴×0.5 ≈ 3.1×10²¹. FLOPs = 6·N·D ve D=20N → FLOPs=120N² → N=√(3.1×10²¹/120) ≈ 5.1B. Yani GPT-2 Large (774M) ile GPT-3 Small (6.7B) arası. Ciddi bir model — ama birkaç hafta sabır gerektirir."
    },
    {
        soru: "Kayıp eğrisinin uzunca süre 'düzlüğe' girmesinin (plateau) olası açıklaması nedir?",
        secenekler: [
            "Model mükemmel oldu",
            "Model kapasitesi veya veri çeşitliliği tükendi — daha fazla iyileşme için daha büyük model veya daha fazla kaliteli veri gerekir",
            "Optimizer bozuldu",
            "Kesin overfitting"
        ],
        dogru: 1,
        aciklama: "Scaling laws'a göre kayıp log-log ölçekte doğrusal azalır — ama model küçük kalıp veri artarsa (veya tam tersi) yavaşlar. Eğri hâlâ yavaşça düşüyorsa devam edin; tamamen duraksamışsa ölçeği büyütün. Plateau ≠ overfitting (overfitting'de val kaybı YÜKSELİR)."
    },
    {
        soru: "Llama-3 ekibinin 404 sayfalık teknik raporunda vurgulanan üç temel 'kaldıraç' nedir? (Llama-3'ü güçlü yapan 3 ana faktör)",
        secenekler: [
            "MoE mimarisi, uzun bağlam, multimodalite",
            "Veri kalitesi, hesaplama ölçeği, mimari sadelik (managing complexity)",
            "Reinforcement learning, quantizasyon, pruning",
            "Uzun bağlam penceresi, GQA, RoPE"
        ],
        dogru: 1,
        aciklama: "Llama-3 raporunun özeti: Data (15T token, aylarca temizlik), Scale (405B parametre, 16K H100 GPU), Managing Complexity (dense Transformer — MoE kullanmadılar, pipeline'ı basit tuttular: SFT → RS → DPO). Paradoks gibi görünse de 'basitlik' en kritik avantajdı."
    },
    {
        soru: "Ön eğitim (pretraining) ile ince ayar (fine-tuning) arasındaki temel fark nedir?",
        secenekler: [
            "Hiçbir fark yok, aynı şeydir",
            "Pretraining devasa etiketsiz veriyle genel dil/dünya yeteneği kazandırır (pahalı, haftalar-aylar); ince ayar küçük etiketli veriyle davranış/görevsel beceri öğretir (ucuz, saatler)",
            "Pretraining sadece GPU ister, ince ayar CPU'da yapılır",
            "İnce ayar daha çok veri gerektirir"
        ],
        dogru: 1,
        aciklama: "Pretraining: trilyonlarca token, binlerce GPU, haftalar — genel 'dil ve dünya bilgisi'. Ince ayar: binlerce-milyonlarca örnek, bazen tek GPU bile yeter, saatler — 'bu modele nasıl davranması gerektiğini' öğretme (örn. talimat takip etme). Ölçek ve amaç tamamen farklıdır."
    }
];
