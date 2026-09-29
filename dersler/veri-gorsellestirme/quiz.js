// Quiz: Veri Görselleştirme — 8 soru
window.QUIZ_DATA = [
    {
        soru: "Model eğitimine başlamadan önce ilk yapılması gereken görselleştirme hangisidir?",
        secenekler: [
            "Modelin çıktısını 3D görselleştirmek",
            "Veri setinin dağılımını ve özelliklerini grafiklerle incelemek",
            "Eğitim kaybını çizmek",
            "Model ağırlıklarını ısı haritası olarak görmek"
        ],
        dogru: 1,
        aciklama: "Veri Önce ilkesi: model kurmadan önce veriyi görselleştirerek aykırı değerler, dengesiz sınıf dağılımı veya veri sorunları tespit edilir. Bu, ileride saatlerce hatayı modelde aramaktan sizi kurtarır."
    },
    {
        soru: "Confusion matrix (karışıklık matrisi) neyi gösterir?",
        secenekler: [
            "Modelin ne kadar hızlı çalıştığını",
            "Her sınıfın, hangi sınıfla ne kadar karıştırıldığını",
            "Veri setinin boyutunu",
            "Modelin bellek kullanımını"
        ],
        dogru: 1,
        aciklama: "Confusion matrix'i şöyle okursunuz: diyagonal (sol üst → sağ alt) doğru tahminler; dışındaki hücreler ise hangi sınıfın hangi sınıfla karıştırıldığını gösterir. Model 'kedi' ile 'kaplanı' karıştırıyorsa burada görürsünüz."
    },
    {
        soru: "Eğitim kaybı düşerken doğrulama (validation) kaybı yükseliyorsa bu ne anlama gelir?",
        secenekler: [
            "Model mükemmel öğreniyor",
            "Overfitting: model eğitim verisini ezberliyor, genellemeyi kaybediyor",
            "Veri seti çok küçük",
            "Learning rate çok yüksek"
        ],
        dogru: 1,
        aciklama: "Bu durum overfitting'in klasik işaretidir. M5 dersinde detaylıca göreceğiz: model ezberlemiş, yeni veriye genelleme yapamıyor. Doğrulama kaybı eğitim kaybından yükselmeye başladığı nokta 'erken durdurma' noktasıdır."
    },
    {
        soru: "Yanıltıcı bir grafik hangi özellik gösterir?",
        secenekler: [
            "Çok fazla renk içermesi",
            "Y ekseninin 0'dan başlamaması ve küçük farkları dramatik göstermesi",
            "Başlık eksikliği",
            "Çok büyük boyutta olması"
        ],
        dogru: 1,
        aciklama: "Y eksenini 0'dan başlatmamak (örneğin 95-100 aralığında başlatmak), %2'lik farkı %100 gibi gösterir. Okurken her zaman eksen aralığına bakın; kendi grafiklerinizde 0'dan başlatın."
    },
    {
        soru: "Isı haritası (heatmap) YZ'da en çok nerede kullanılır?",
        secenekler: [
            "Sadece güzel görüntüler üretmek için",
            "Confusion matrix ve attention matrisi gibi sayı tablolarını renklerle görselleştirmek için",
            "Metinleri renklendirmek için",
            "Video işleme için"
        ],
        dogru: 1,
        aciklama: "Isı haritasında her hücre bir sayı, rengi ise o sayının büyüklüğünü temsil eder. Attention matrisleri (L3 dersi) ve karışıklık matrisleri (bu ders) bu yöntemle görselleştirilir."
    },
    {
        soru: "plt.scatter() hangi amaçla kullanılır?",
        secenekler: [
            "Zaman serisi göstermek",
            "İki değişken arasındaki ilişkiyi (korelasyonu) nokta bulutuyla göstermek",
            "Kategori sıralaması yapmak",
            "Model ağırlıklarını görselleştirmek"
        ],
        dogru: 1,
        aciklama: "Dağılım grafiği (scatter plot), iki sayısal değişken arasındaki ilişkiyi gösterir. Örneğin 'boy ile ağırlık arasında ilişki var mı?' — noktalar sağ üst köşeye yöneliyorsa pozitif korelasyon vardır."
    },
    {
        soru: "Bir modelin hangi sınıfı diğeriyle karıştırdığını bulmak için hangi görselleştirme kullanılır?",
        secenekler: ["Çizgi grafiği", "Sütun grafiği", "Isı haritası (confusion matrix)", "Dağılım grafiği"],
        dogru: 2,
        aciklama: "Confusion matrix ısı haritası formatında görselleştirilir: satır = gerçek sınıf, sütun = tahmin edilen sınıf, renk yoğunluğu = sayı. Hangi sınıfın hangi sınıfla karıştırıldığı buradan okunur."
    },
    {
        soru: "np.linspace(0, 10, 100) ne üretir?",
        secenekler: [
            "0'dan 100'e kadar 10 sayı",
            "0 ile 10 arasında (10 dahil) eşit aralıklı 100 sayı",
            "0 ile 100 arasında 10 rastgele sayı",
            "100 adet 0 veya 10 değeri"
        ],
        dogru: 1,
        aciklama: "linspace(başlangıç, bitiş, adet): 0 ile 10 arasında (10 dahil) eşit aralıklı 100 sayı üretir: [0, 0.101, 0.202, ..., 10.0]. Grafik çizerken X eksenini oluşturmak için sıkça kullanılır."
    }
];
