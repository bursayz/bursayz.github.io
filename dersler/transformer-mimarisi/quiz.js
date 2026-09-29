// Quiz: Transformer Mimarisi — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Residual bağlantı (x + katman(x)) neyi sağlar?",
        secenekler: [
            "Modelin daha hızlı çalışmasını",
            "Orijinal bilginin katmanlar boyunca kaybolmamasını ve gradyanların ilk katmanlara akabilmesini",
            "Parametre sayısını azaltmayı",
            "Tokenizasyonu hızlandırmayı"
        ],
        dogru: 1,
        aciklama: "Residual bağlantı bir 'bilgi otoyolu'dur: orijinal x her katman çıkışına eklenir. Bu sayede (1) derin ağlarda gradyan kaybolması önlenir, (2) katmanlar orijinal bilgiyi silemez, sadece 'ekleme' yapabilir. ResNet (2016) bu fikirle 152 katmanlı ağları mümkün kıldı."
    },
    {
        soru: "Layer Normalization'ın transformer'daki rolü nedir?",
        secenekler: [
            "Kelime sayısını sınırlamak",
            "Her katman girişini ortalama=0, varyans=1 ölçeğine getirerek eğitimi stabilize etmek",
            "Attention skorlarını normalize etmek",
            "Modeli küçültmek"
        ],
        dogru: 1,
        aciklama: "Katmanlar arasında değerler büyür veya küçülürse eğitim kararsızlaşır. LayerNorm her token vektörünü normalize eder. Pre-norm (x + blok(LN(x))) mimarisi, orijinal makaledeki post-norm'dan daha kararlı eğitim sağladığı için modern GPT'lerde standarttır."
    },
    {
        soru: "Feed-forward ağ (FFN) ile attention arasındaki işbölümü nedir?",
        secenekler: [
            "İkisi de aynı işi yapar",
            "Attention tokenlar arası bilgi alışverişi yapar; FFN her tokenı bağımsız olarak işler",
            "FFN sadece ilk katmanda çalışır",
            "Attention çıktıyı üretir, FFN sadece normalizasyon yapar"
        ],
        dogru: 1,
        aciklama: "Attention = 'sosyalleşme': tokenlar birbirinden bilgi toplar. FFN = 'derin düşünme': her token topladığı bilgiyi kendi içinde 768→3072→768 şeklinde genişletip sıkıştırarak işler. FFN transformer parametrelerinin ~2/3'ünü barındırır."
    },
    {
        soru: "GPT tarzı decoder-only mimariyi BERT tarzı encoder'dan ayıran temel fark nedir?",
        secenekler: [
            "GPT'de attention yoktur",
            "GPT nedensel maskeleme kullanır (sadece geçmişe bakar), BERT çift yönlüdür (her yöne bakar)",
            "BERT metin üretemez çünkü attention kullanmaz",
            "GPT daha az katmanlıdır"
        ],
        dogru: 1,
        aciklama: "BERT anlama odaklıdır: kelime her iki yöne de bakabilir (çift yönlü) → sınıflandırma/NER görevlerinde güçlü. GPT üretim odaklıdır: nedensel maske ile sadece geçmişe bakar → bir sonraki token tahmininde (text generation) çalışır."
    },
    {
        soru: "Pre-norm mimarisinde transformer blok nasıl yazılır?",
        secenekler: [
            "x = LN(x + att(x)); x = LN(x + ffn(x))",
            "x = x + att(LN(x)); x = x + ffn(LN(x))",
            "x = att(x) + ffn(x)",
            "x = LN(att(x) + ffn(x))"
        ],
        dogru: 1,
        aciklama: "Pre-norm: LayerNorm residual bağlantının İÇİNDE uygulanır — LN(x) bloğa girer, blok çıkışı orijinal x'e eklenir. Orijinal makale post-norm kullanıyordu ama pre-norm'un derin ağlarda daha kararlı olduğu keşfedildi."
    },
    {
        soru: "GPT-2 small ile GPT-3 arasındaki temel fark nedir?",
        secenekler: [
            "Tamamen farklı mimariler",
            "Aynı mimarinin farklı ölçekleri: blok sayısı (12→96), embed boyutu (768→12288), parametre (117M→175B)",
            "GPT-3 attention kullanmaz",
            "GPT-2 Türkçe, GPT-3 İngilizce içindir"
        ],
        dogru: 1,
        aciklama: "İkisinin de mimarisi aynı transformer decoder yapısıdır. Fark ölçektedir. Bu, 'ölçek yasaları'nın (scaling laws) temelidir: daha fazla parametre + daha fazla veri → öngörülebilir şekilde daha iyi model. L6 dersinde göreceğiz."
    },
    {
        soru: "Çıktı katmanı (kafa) nn.Linear(embed_dim, vocab) ne üretir?",
        secenekler: [
            "Tek bir kelime",
            "Her pozisyon için vocab boyutunda ham skor (logit) — softmax sonrası bir sonraki token olasılık dağılımı",
            "Embedding vektörleri",
            "Attention ağırlıkları"
        ],
        dogru: 1,
        aciklama: "Son LayerNorm'dan çıkan (batch, T, embed_dim) tensor, kafa katmanıyla (batch, T, vocab'a) dönüşür. Her pozisyonda vocab boyutunda skorlar = 'bu pozisyonda hangi token gelsin' tahmini. Üretimde sadece son pozisyonun dağılımı kullanılır."
    },
    {
        soru: "Feed-forward katmanında neden önce genişletme (768→3072) sonra daraltma (3072→768) yapılır?",
        secenekler: [
            "Bellek tasarrufu için",
            "Geniş ara katman, modele daha yüksek boyutlu bir uzayda karmaşık dönüşümler öğrenme kapasitesi verir",
            "Matematiksel bir zorunluluk",
            "Token sayısını azaltmak için"
        ],
        dogru: 1,
        aciklama: "Geniş katman (tipik 4x) geçici olarak daha fazla 'çalışma alanı' sağlar: GELU aktivasyonu ile doğrusal olmayan karmaşık dönüşümler öğrenilir, sonra orijinal boyuta projekte edilir. Araştırmalar FFN'nin modelin 'bilgi deposu' gibi davrandığını gösterir."
    },
    {
        soru: "Bir transformer modelinde (T=512 token, 12 blok) self-attention kaç kez hesaplanır?",
        secenekler: [
            "1 kez",
            "12 kez (her blokta bir)",
            "512 kez",
            "12 × başlık sayısı kez (her blokta her başlık için bir, örn. 12 başlık varsa 144 kez)"
        ],
        dogru: 3,
        aciklama: "Her blok kendi multi-head attention'ını çalıştırır ve her başlık ayrı Q,K,V projeksiyonları ile kendi (T×T) attention matrisini hesaplar. 12 blok × 12 başlık = 144 attention hesabı. Üstelik üretim sırasında her yeni token için tekrarlanır (KV-cache bunu optimize eder — L10)."
    },
    {
        soru: "Token ve pozisyon embeddingleri neden TOPLANIR, çarpılmaz veya birleştirilmez (concat)?",
        secenekler: [
            "Toplama en hızlı işlemdir",
            "Aynı boyutta iki vektör toplanarak tek boyutta birleşir — concat boyutu iki katına çıkarıp hesaplamayı artırırdı; toplamada model her iki sinyali de ayırt etmeyi öğrenir",
            "Çarpma gradyanları sıfırlardı",
            "Rastgele bir tercih, alternatifler de eşit derecede iyi"
        ],
        dogru: 1,
        aciklama: "Concat [word_emb, pos_emb] → 2×embed_dim üretir ve sonraki her katmanın boyutunu büyütür. Toplama aynı boyutta kalır; sinüzoidal pozisyon sinyalleri farklı frekanslarda olduğundan model iki kaynağı toplamdan ayırt etmeyi öğrenir. Modern modeller RoPE ile bu bilgiyi attention içinde döndürme (rotation) olarak kodlar."
    }
];
