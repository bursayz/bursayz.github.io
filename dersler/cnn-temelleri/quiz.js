// Quiz: CNN Temelleri — 10 soru
window.QUIZ_DATA = [
    {
        soru: "28×28 gri bir resim, NumPy'de hangi shape'e sahiptir?",
        secenekler: ["(784,)", "(28, 28)", "(28, 28, 3)", "(3, 28)"],
        dogru: 1,
        aciklama: "Gri resim: (yükseklik, genişlik) = (28, 28). Renkli (RGB) olsaydı üçüncü bir kanal boyutu eklenirdi: (28, 28, 3). MNIST veri seti 28×28 gri rakam resimleridir — G2 dersinde bunu eğiteceğiz."
    },
    {
        soru: "Evrişim (convolution) işleminin tam bağlı (dense) katmana göre avantajı nedir?",
        secenekler: [
            "Daha hızlı eğitilir",
            "Küçük filtre görüntünün her yerinde aynı deseni arar — hiyerarşik öğrenme ve konum kaymaya dayanıklılık sağlar; parametre paylaşımı verimlidir",
            "Daha az bellek kullanır her zaman",
            "Sadece görüntüde çalışır"
        ],
        dogru: 1,
        aciklama: "3×3 filtre = 9 parametre, 28×28 resmin her bölgesini tarar (parametre paylaşımı!). Dense katmanda 784 giriş × her nöron = devasa parametre. Convolution görüntünün uzamsal yapısını korur: komşu piksellerin ilişkisi anlamlıdır."
    },
    {
        soru: "3×3 kernel, stride=1, padding=1 ile (1, 32, 28, 28) girdinin çıktı boyutu nedir?",
        secenekler: ["(1, 32, 26, 26)", "(1, 32, 28, 28)", "(1, 32, 14, 14)", "(1, 32, 30, 30)"],
        dogru: 1,
        aciklama: "Formül: (28 + 2×1 - 3)/1 + 1 = 28. Padding=1 kenarlara sıfır ekler → çıktı boyutu korunur. Bu, 'same padding' olarak bilinir ve derin ağlarda boyut kontrolü için kullanılır."
    },
    {
        soru: "Max pooling (2×2, stride=2) ne yapar?",
        secenekler: [
            "Görüntüyü 2 kat büyütür",
            "Her 2×2 bölgeden en büyük değeri alır — özellik haritasını 2 kat küçültür, hesabı 4 kat azaltır, küçük kaydırmalara dayanıklılık verir",
            "Değerleri 0-1 arasına sıkıştırır",
            "Negatif değerleri sıfırlar"
        ],
        dogru: 1,
        aciklama: "MaxPool(2x2, s=2): her 2x2 pencerenin maksimumunu al → 28x28 → 14x14. Amaç: (1) hesaplama azalt, (2) modelin küçük kaydırmalara duyarsız olmasını sağla (kedinin kafası 2 px kaymış → aynı 'en güçlü sinyal' kalır)."
    },
    {
        soru: "CNN'de ilk katmanların (düşük seviye) öğrendiği özellikler nelerdir?",
        secenekler: [
            "Tam nesneler (kedi, araba)",
            "Kenarlar, renk geçişleri ve basit dokular",
            "Metin içeriği",
            "Olasılık dağılımları"
        ],
        dogru: 1,
        aciklama: "Hiyerarşik öğrenme: 1-2. katman kenar/doku (düşük seviye) → 3-4. katman şekil/parça (orta) → 5+. katman nesne (yüksek). Distill.pub 'Feature Visualization' çalışması bu katmanların ne öğrendiğini gösterdi — şaşırtıcı derecede yorumlanabilir."
    },
    {
        soru: "ResNet'in (2015) 152 katmanlı ağları mümkün kılan kritik yeniliği nedir?",
        secenekler: [
            "Daha büyük kernel kullanması",
            "Residual (skip) bağlantılar: y = F(x) + x — gradyanlar katmanları atlayarak geriye akar, derin ağlarda kaybolma önlenir",
            "Attention kullanması",
            "Quantization yapması"
        ],
        dogru: 1,
        aciklama: "Derin ağlarda gradyan kayboluyordu (100+ katmanda). ResNet her bloğun çıkışına girdisini ekler (L4'te transformer'da gördüğümüz aynı teknik!). Bu 'otoyol' sayesinde 1000+ katman bile eğitilebilir. Aynı yıl çıkan Highway Network de aynı fikri önermişti."
    },
    {
        soru: "Dikey kenar filtresi [[-1,0,1],[-2,0,2],[-1,0,1]] (Sobel) ne tespit eder?",
        secenekler: [
            "Köşe noktaları",
            "Dikey kenarları — piksel yoğunluğunun soldan sağa ani geçişlerini",
            "Yatay kenarları",
            "Renkli alanları"
        ],
        dogru: 1,
        aciklama: "Sobel-X: sol taraf negatif (-1,-2,-1), sağ taraf pozitif (+1,+2,+1). Dikey kenarda (koyu solda, açık sağda) toplam büyük pozitif çıkar; tersi için büyük negatif; düz bölgede sıfır. Görüntü işleme klasiklerinden."
    },
    {
        soru: "nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3) kaç parametre içerir?",
        secenekler: ["192", "576", "1.792 (= 3×64×3×3 + 64 bias)", "5.832"],
        dogru: 2,
        aciklama: "Ağırlık: giriş_kanal × çıkış_kanal × kernel² = 3×64×3×3 = 1728. Bias: 64. Toplam: 1792. Her çıkış kanalı (64 adet 'dedektör') girdi görüntüsünün 3 kanalını (RGB) tamamen tarayan ayrı 3x3x3 filtredir."
    },
    {
        soru: "Vision Transformer (ViT) görüntüyü nasıl işler?",
        secenekler: [
            "Convolution kerneli ile",
            "Görüntüyü 16x16 patch'lere (yamalar) böler, her patch'i token gibi düzleştirir, self-attention (L3-L4) uygular",
            "Piksel piksel dense katmanlarla",
            "Önceden eğitilmiş CNN ile"
        ],
        dogru: 1,
        aciklama: "ViT (2020): resmi 16×16=196 patch'e böler → her patch 'token' gibi lineer projeksiyon + pozisyon embedding → standart transformer blokları. Büyük veri setlerinde CNN'leri geçti. L3-L4 dersindeki attention burada da aynı matematikle çalışıyor!"
    },
    {
        soru: "Feature map (özellik haritası) nedir?",
        secenekler: [
            "Görüntü üzerinde filtre uygulandıktan sonra elde edilen 2D aktivasyon grid'i — 'Bu desen her yerde ne kadar var?' ısı haritası",
            "Modelin kayıp grafiği",
            "Eğitim veri setinin istatistik tablosu",
            "Katman bağlantı şeması"
        ],
        dogru: 0,
        aciklama: "Filtre görüntü üzerinde kayar → her konumda bir skor üretir → tüm skorlar yeni bir 2D ızgara (feature map) oluşturur. Parlak bölge = filtrelenen desenin varlığı. 64 filtre → 64 farklı feature map (değişik desenlerin haritaları)."
    }
];
