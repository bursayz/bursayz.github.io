// Quiz: Self-Attention — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Self-attention mekanizmasının temel amacı nedir?",
        secenekler: [
            "Modelin RAM kullanımını azaltmak",
            "Her kelimenin, dizideki diğer tüm kelimelerle ne kadar ilişkili olduğunu hesaplayarak bağlam duyarlı temsiller üretmek",
            "Metnin dilini tespit etmek",
            "Kelimeleri tek bir vektöre sıkıştırmak"
        ],
        dogru: 1,
        aciklama: "'bank' kelimesinin anlamı cümleye göre değişir. Attention, her kelimeye diğerlerini 'sorgulayarak' bu bağlamı çözer. 'nehir kenarındaki bank'ta 'nehir' kelimesi yüksek attention alır; 'para çekmek için bank'ta 'para' alır."
    },
    {
        soru: "Query (Q), Key (K), Value (V) arasındaki fark nedir?",
        secenekler: [
            "Hepsi aynı vektörün farklı adıdır",
            "Q = 'ben ne arıyorum', K = 'ben neyim/nim var', V = 'ben hangi bilgiyi sunabilirim'",
            "Q = soru, K = cevap, V = değer kategorisi",
            "Q = input, K = output, V = gizli katman"
        ],
        dogru: 1,
        aciklama: "Kütüphane analojisi: Q = arama sorgunuz ('kediler hakkında'), K = raf etiketi ('kedi kitapları'), V = kitabın içeriği. Q ile her K'yi karşılaştırırsın (skor), en uygun skorların V'sini toplarsın. Her kelime üçünü de üretir."
    },
    {
        soru: "Attention skoru hesaplanırken neden √(d_k) ile bölünür?",
        secenekler: [
            "Hesaplamayı hızlandırmak için",
            "Q·K skorlarının boyut arttıkça büyümesini dengelemek ve softmax'ın gradyanlarını stabil tutmak için",
            "Sonucu 0-1 arasına sıkıştırmak için",
            "Matematiksel bir zorunluluk, bir anlamı yok"
        ],
        dogru: 1,
        aciklama: "d_k arttıkça Q·K skorları da büyür; softmax aşırı uçlara (0 veya 1) gider → gradyanlar kaybolur. √d_k ile bölmek skorların varyansını sabit tutar. Boyut 768 ise √768 ≈ 27.7 ile böleriz."
    },
    {
        soru: "Nedensel maskeleme (causal masking) neden gereklidir?",
        secenekler: [
            "Modelin daha hızlı eğitilmesi için",
            "Metin üretimi sırasında modelin gelecekteki kelimeleri görmesini engellemek — tahmin oyunu kurallara göre oynanmalı",
            "Çıktıyı olasılığa çevirmek için",
            "Belleği verimli kullanmak için"
        ],
        dogru: 1,
        aciklama: "Autoregressive üretimde 'Kediler ...' verildiğinde sonraki kelimeyi tahmin etmeli. Eğitimde aynı kural geçerli: kelime t, yalnızca 1..t kelimelerini görsün. masked_fill(-inf) ile softmax sonrası o pozisyonların skoru 0 olur."
    },
    {
        soru: "Çok başlık dikkatte (multi-head) 4 baş varsa ve embedding boyutu 64 ise, her baş hangi boyutta çalışır?",
        secenekler: ["64", "16 (= 64 ÷ 4)", "256 (= 64 × 4)", "32"],
        dogru: 1,
        aciklama: "64 boyutlu embedding 4 eş parçaya bölünür (her biri 16 boyut). Her baş kendi Q,K,V'leri bu 16 boyutta öğrenir — farklı ilişki türlerini (özne-nesne, zaman uyumu, zamir referansı) yakalar. Son çıktılar birleştirilip 64'e projekte edilir."
    },
    {
        soru: "Attention matrisinin boyutu, uzunluğu T olan bir dizi için nedir?",
        secenekler: ["T × d (embedding boyutu)", "T × T (her kelime her kelimeyle)", "d × d", "T × 1"],
        dogru: 1,
        aciklama: "Q (T,d) × K.T (d,T) = (T,T). Her satır bir kelimenin, her sütun bakılan kelimenin dikkat skorunu tutar. 2048 tokenlık bir bağlamda 2048×2048 = 4.2M skor! Bu yüzden uzun bağlamlar hesaplama açısından pahalıdır."
    },
    {
        soru: "Attention'da softmax'ın rolü nedir?",
        secenekler: [
            "Skorları sıralamak",
            "Her kelime için dikkat ağırlıklarını toplamı 1 olan bir dağılım haline getirmek (bir kelime toplamda %100 dikkat dağıtır)",
            "Değerleri 0-1 arasına kısıtlamak",
            "En yüksek skoru seçmek"
        ],
        dogru: 1,
        aciklama: "Ham skorlar herhangi bir pozitif/negatif sayı olabilir. softmax(satır) → toplamı 1 olan olasılık dağılımı. Böylece her kelime 'dikkat payları' tahsis eder: %40 A kelimesine, %30 B kelimesine, %20 C kelimesine gibi."
    },
    {
        soru: "self-attention'da bir token'ın çıktısı nasıl hesaplanır?",
        secenekler: [
            "Sadece kendi embedding'i döndürülür",
            "En yüksek skorlu komşusunun vektörü doğrudan kopyalanır",
            "Tüm tokenların Value vektörlerinin, attention ağırlıklarıyla ağırlıklı toplamı",
            "En yüksek attention skorundaki token ID'si"
        ],
        dogru: 2,
        aciklama: "Çıktı = Σ(attention_ağırlığı_j × V_j), j=1..T. Bu ağırlıklı karışım, 'ben' kelimesinin temsilini içerik zenginliğiyle günceller. 'bank' kelimesi yüksek attention alan 'nehir' kelimesinin V vektöründen bilgi alır."
    },
    {
        soru: "Attention sadece dil modellerinde mi kullanılır?",
        secenekler: [
            "Evet, sadece NLP'de geçerlidir",
            "Hayır — Vision Transformer (ViT) görüntü patch'lerine, Whisper ses token'larına, protein modelleri aminoasit dizilerine aynı mekanizmayı uygular",
            "Sadece metinlerde kullanılabilir, görüntü için yetersizdir",
            "Sadece GPT modellerinde vardır"
        ],
        dogru: 1,
        aciklama: "Self-attention genel bir tekniktir: herhangi bir dizideki öğelerin birbiriyle ilişkisini öğrenir. ViT (2020) görüntüyü 16×16 patch'lere böldü, attention ile sınıflandırdı — CNN'i geçti. AlphaFold da protein yapısında kullanıyor."
    },
    {
        soru: "K·V çarpımı yerine Q·K.T kullanılmasının nedeni nedir?",
        secenekler: [
            "Rastgele seçim",
            "Q·K.T, her tokenin diğer her tokene olan ilgi skorunu tam matris formunda üretir; softmax sonrası V ile toplam alınır — 'sorgu anahtar eşleşmesi' ölçümü bu şekilde yapılır",
            "K.T daha küçük boyutlu olduğu için",
            "GPU avantajı için"
        ],
        dogru: 1,
        aciklama: "Q·K.T = (T,T) matrisinde [i,j] = i. tokenin j. tokene skoru. Bu tam olarak bizim istediğimiz şeydir: her kelimenin her kelimeye ne kadar 'sorduğunu'. K·V (T, d) boyutunda olur ve bu soruyu yanıtlayamaz."
    }
];
