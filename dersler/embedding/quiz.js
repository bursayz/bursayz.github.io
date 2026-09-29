// Quiz: Embedding — 9 soru
window.QUIZ_DATA = [
    {
        soru: "One-hot encoding'in temel sorunu nedir?",
        secenekler: [
            "Çok yavaş olması",
            "Tüm kelimelerin birbirine eşit uzaklıkta olması — anlamsal benzerlik taşımaması",
            "Sadece İngilizce'de çalışması",
            "Çok fazla bellek kullanması"
        ],
        dogru: 1,
        aciklama: "One-hot vektörlerde dot product her zaman 0 çıkar: 'kedi'-'köpek' = 'kedi'-'masa' = 0. Anlamsal benzerlik kodlanamaz. Ayrıca 100K vocab için 100K boyutlu seyrek vektör verimsizdir. Embedding bu sorunu çözer."
    },
    {
        soru: "nn.Embedding(num_embeddings=1000, embedding_dim=64) katmanı ne oluşturur?",
        secenekler: [
            "64 katmanlı bir sinir ağı",
            "1000 kelime için her birine 64 boyutlu öğrenilebilir vektör atayan arama (lookup) tablosu",
            "1000×64 boyutunda rastgele sayı üreteci",
            "64 girişi 1000 çıkışa çeviren dense katman"
        ],
        dogru: 1,
        aciklama: "nn.Embedding aslında bir matristir: (1000, 64). Her satır bir kelimenin vektörü. embedding(token_id) → o satırı döndürür. Bu matris eğitim sırasında öğrenilir: benzer bağlamlardaki kelimeler birbirine yaklaşır."
    },
    {
        soru: "Kosinüs benzerliği -1 ile +1 arasında ölçeklenir. 'Kedi' ve 'köpek' kelimelerinin eğitimli bir modelde kosinüs benzerliğinin yüksek olmasını beklersiniz çünkü:",
        secenekler: [
            "Aynı harfle başlıyorlar",
            "Benzer anlamsal bağlamlarda geçiyorlar (ikisi de hayvan, evcil vb.)",
            "Aynı uzunlukta kelimeler",
            "Türkçe oldukları için"
        ],
        dogru: 1,
        aciklama: "Embedding öğrenimi bağlam temellidir: 'kedi' ve 'köpek' hep benzer cümlelerde görülür ('... besliyorum', '... baktım'). Model her ikisini de benzer vektörlere çeker. 'Kedi'-'bilgisayar' ise farklı bağlamlarda → düşük benzerlik."
    },
    {
        soru: "Pozisyon encoding neden gereklidir?",
        secenekler: [
            "Kelimeleri alfabetik sıraya sokmak için",
            "Transformer'ın kelime SIRASINI bilmemesi — pozisyon vektörü ekleyince sıralama bilgisi modele girer",
            "Tokenları indekslemek için",
            "Hafızayı verimli kullanmak için"
        ],
        dogru: 1,
        aciklama: "Self-attention kelimelerin konumunu bilmez — 'kedi köpeği ısırdı' ile 'köpek kediyi ısırdı' aynı embedding setini üretir. Pozisyon encoding, her tokena 'sen N. sıradasın' bilgisini ekleyerek sıralamayı modele öğretir."
    },
    {
        soru: "'kral - erkek + kadın ≈ kraliçe' vektör aritmetiği neyi gösterir?",
        secenekler: [
            "Modeller rastgele sayı üretir",
            "Embedding'ler anlamsal ilişkileri lineer geometrik ilişkiler olarak kodlar",
            "Modelin halüsinasyon ürettiğini",
            "Tokenization'ın hatalı çalıştığını"
        ],
        dogru: 1,
        aciklama: "Embedding'ler cinsiyet, sayı, zaman gibi anlamsal yönleri geometrik yönlere dönüştürür. 'erkek→kadın' vektörü neredeyse sabittir; bu vektörü 'krala' eklerseniz 'kraliçe' bölgesine çıkarsınız. Anlamın geometrik yapısı burada görülür."
    },
    {
        soru: "Embedding boyutu iki katına çıkarılırsa (örn. 64 → 128) ne olur?",
        secenekler: [
            "Kelime kapasitesi azalır",
            "Daha zengin temsil mümkündür ama parametre sayısı ve hesaplama maliyeti iki katına çıkar",
            "Değişiklik olmaz",
            "Model daha hızlı çalışır"
        ],
        dogru: 1,
        aciklama: "Boyut ne kadar büyükse model anlamın o kadar ince nüansını kodlayabilir. Ama parametre sayısı: 100K vocab × 64 boyut = 6.4M parametre; × 128 boyut = 12.8M parametre. LLM'ler embedding'e milyarlarca parametre harcar."
    },
    {
        soru: "Eğitilmemiş (rastgele başlatılmış) bir embedding matrisinde 'kedi' ve 'köpek' vektörlerinin benzerliği nasıldır?",
        secenekler: [
            "Çok yüksek (0.9+)",
            "Rastgele — yüksek veya düşük olabilir, anlamsal ilişki yoktur",
            "Her zaman 0",
            "Her zaman -1"
        ],
        dogru: 1,
        aciklama: "Embedding matrisi rastgele başlatılır. Benzerlik eğitim sırasında öğrenilir: binlerce 'kedi' ve 'köpek' örneği aynı bağlamları görürse vektörleri yakınlaşır. Eğitimli modelde ise bu benzerlik yüksek çıkar."
    },
    {
        soru: "Hugging Face'de bert-base-uncased modelinin embedding boyutu 768 ise, 30.000 kelimelik vocab kaç parametre içerir?",
        secenekler: ["30.000", "768", "23.040.000 (= 30000×768)", "768.000"],
        dogru: 2,
        aciklama: "Embedding matrisi = vocab_sayısı × embedding_boyutu = 30000 × 768 = 23.040.000 parametre. Bu sadece embedding katmanıdır! Büyük modeli düşünün: GPT-3'ün 12.288 boyutlu 50K vocab'u = 614 milyon embedding parametresi."
    },
    {
        soru: "Transformer'da kelime embeddingi ile pozisyon embeddingi nasıl birleştirilir?",
        secenekler: [
            "Çarpılır",
            "Eleman-eleman toplanır (word_emb + pos_emb)",
            "String birleştirme yapılır",
            "Pozisyon embeddingi son katmana eklenir"
        ],
        dogru: 1,
        aciklama: "İki vektör aynı boyutta olduğundan doğrudan toplanır: input = word_embedding + positional_embedding. Eğitim sırasında her ikisi de öğrenilir. Alternatif: öğrenilmiş pozisyon (nn.Embedding) veya RoPE (rotary) gibi göreli konum yöntemleri."
    }
];
