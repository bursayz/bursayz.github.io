// Quiz: Matematik Temelleri — 9 soru
window.QUIZ_DATA = [
    {
        soru: "FP32 (float32) kaç bit kullanılarak saklanır?",
        secenekler: ["8 bit", "16 bit", "32 bit", "64 bit"],
        dogru: 2,
        aciklama: "FP32, 32 bit (4 byte) kullanır. Bu, yaklaşık 4.3 milyar farklı değeri temsil edebilir. FP16 yarısı (16 bit), INT8 ise çeyreği (8 bit) kadar yer kaplar."
    },
    {
        soru: "Bir vektör geometrik olarak neyi temsil eder?",
        secenekler: [
            "Sadece bir sayı listesini",
            "Bir tablodaki satırı",
            "Bir noktaya işaret eden bir oku (yön + büyüklük)",
            "Bir dairenin çevresini"
        ],
        dogru: 2,
        aciklama: "Vektör geometrik olarak bir ok gibi düşünülür: bir başlangıç noktasından belirli yöne ve uzunlukta işaret eder. [2, 4, 1] vektörü 3 boyutlu uzayda (2,4,1) noktasına giden oktur."
    },
    {
        soru: "Matris çarpımının ('@' operatörü) sinir ağlarındaki anlamı nedir?",
        secenekler: [
            "İki tabloyu birleştirmek",
            "Her çıkış değerinin, tüm girdilerin ağırlıklı toplamını hesaplamak",
            "Veriyi sıralamak",
            "Sayıları büyükten küçüğe dizmek"
        ],
        dogru: 1,
        aciklama: "Sinir ağındaki her katman bir matristir. Matris çarpımı: çıkış[i] = Σ(girdi[j] × ağırlık[i,j]) — yani her çıktı, tüm girdilerin kendi ağırlıklarıyla çarpılıp toplanmasıdır."
    },
    {
        soru: "f(x) = x² fonksiyonunun x=3 noktasındaki türevi kaçtır?",
        secenekler: ["3", "6", "9", "2x"],
        dogru: 1,
        aciklama: "f(x) = x² fonksiyonunun türevi f'(x) = 2x'tir. x=3 için: 2×3=6. Bu, 'x'i 1 birim artırırsanız sonuç yaklaşık 6 birim artar' demektir. Model eğitiminde bu eğim bilgisi ağırlıkların nasıl ayarlanacağını söyler."
    },
    {
        soru: "Softmax fonksiyonu ne yapar?",
        secenekler: [
            "Sayıları yumuşatır (büyükleri küçültür)",
            "Modelin ham çıktılarını toplamı 1 olan olasılıklara dönüştürür",
            "Sayıları 0 ile 1 arasına sınırlar",
            "En büyük değeri seçer, diğerlerini siler"
        ],
        dogru: 1,
        aciklama: "Softmax, [2.0, 0.5, -1.0] gibi ham skorları (logit) [0.84, 0.15, 0.01] gibi olasılıklara çevirir: tüm değerler pozitif ve toplamı tam 1 olur. Böylece '%84 kedi' gibi yorumlanabilir çıktılar elde ederiz."
    },
    {
        soru: "INT8 quantization ne demektir?",
        secenekler: [
            "Modelin 8 katmanlı olması",
            "Ağırlıkların 8 bit (256 farklı değer) hassasiyetle saklanması",
            "Modelin 8 GB yer kaplaması",
            "8 farklı modelin birleştirilmesi"
        ],
        dogru: 1,
        aciklama: "INT8, ağırlıkların 8 bit (sadece 256 farklı değer) kullanılarak saklanmasıdır. FP32'ye göre 4 kat az yer kaplar ve düşük kaynaklı cihazlarda (telefonlar) çalışmayı mümkün kılar. Uzman serisinde detaylı göreceğiz."
    },
    {
        soru: "np.linalg.norm([3, 4]) değeri nedir?",
        secenekler: ["3", "4", "5", "7"],
        dogru: 2,
        aciklama: "Vektör normu = √(x² + y²) = √(9+16) = √25 = 5. Pisagor teoremi! Vektör 3 birim sağa, 4 birim yukarı gidiyor; toplam uzunluğu 5. Bu '3-4-5 dik üçgeni' geometrik sezgisiyle aynı şeydir."
    },
    {
        soru: "Yapay zeka modeli eğitiminde 'gradyan inişi' (gradient descent) neyi hedefler?",
        secenekler: [
            "Model boyutunu küçültmeyi",
            "Türev (eğim) bilgisini kullanarak hata (loss) değerini en aza indirmeyi",
            "Veriyi eğitim için hazırlamayı",
            "Ağırlıkları sıfıra yaklaştırmayı"
        ],
        dogru: 1,
        aciklama: "Gradyan inişi: her parametrenin hata üzerindeki eğimini hesapla (türev), ters yönde küçük adım at. Dağda sisli havada vadiye inmek gibi: eğime bak, aşağı yöne yürü, tekrarla. M4 dersinde detaylandıracağız."
    },
    {
        soru: "np.array([[1,2],[3,4]]) @ np.array([1,2]) işleminin sonucu nedir?",
        secenekler: ["[3, 7]", "[5, 11]", "[1, 2]", "[4, 6]"],
        dogru: 1,
        aciklama: "Satır 0: 1×1 + 2×2 = 1+4 = 5. Satır 1: 3×1 + 4×2 = 3+8 = 11. Sonuç: [5, 11]. Bu basit hesap, milyonlarca parametreli modellerdeki matris çarpımının ta kendisidir — ölçek farkı sadece."
    }
];
