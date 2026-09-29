// Quiz: NumPy — 9 soru
window.QUIZ_DATA = [
    {
        soru: "NumPy'ın Python listesine göre temel avantajı nedir?",
        secenekler: [
            "Daha güzel görünümlü kod",
            "İşlemleri C dilinde, toplu ve hızlı yapması",
            "Daha fazla veri tipi desteklemesi",
            "Daha kolay kurulması"
        ],
        dogru: 1,
        aciklama: "NumPy işlemleri Python yorumlayıcısından değil, derlenmiş C kodundan geçer. Tek bir komutla milyonlarca elemanlı bir diziyi tek seferde işler. Python listesi her eleman için Python döngüsü gerektirir."
    },
    {
        soru: "np.zeros((224, 224, 3)) neyi temsil eder?",
        secenekler: [
            "224 adet 3 kanallı küçük resim",
            "224×224 piksellik RGB bir resmin array şekli",
            "3 boyutta 224 katmanlı bir model",
            "224 GB yer kaplayan bir dosya"
        ],
        dogru: 1,
        aciklama: "Bilgisayarda bir resim: yükseklik × genişlik × renk kanal (RGB=3) boyutlarında bir sayı küpüdür. (224, 224, 3) şeklinde bir array, 224×224 piksellik standart bir resmi temsil eder."
    },
    {
        soru: "np.array([[1,2,3],[4,5,6]]).shape değeri nedir?",
        secenekler: ["(3, 2)", "(2, 3)", "(6,)", "(1, 6)"],
        dogru: 1,
        aciklama: "Shape: (satır sayısı, sütun sayısı) = (2, 3). İlk eleman kaç satır olduğunu, ikinci eleman kaç sütun olduğunu gösterir. YZ'de model giriş boyutları her zaman bu formatla kontrol edilir."
    },
    {
        soru: "Broadcasting ne anlama gelir?",
        secenekler: [
            "Array'i internete yayınlamak",
            "Küçük array'in, büyük array ile uyumlu çalışabilmesi için otomatik olarak 'yayılması' (her elemana aynı operasyonun uygulanması)",
            "Array'in boyutını küçültmek",
            "Array'i diske kaydetmek"
        ],
        dogru: 1,
        aciklama: "Broadcasting: 'matris + 10' yazdığınızda NumPy otomatik olarak 10'u matrişin her elemanına ekler — sanki 10, matrisle aynı boyutta bir array gibi. Bu, milyonlarca veriyi tek satırda işlemeyi sağlar."
    },
    {
        soru: "matris[:, 1] ifadesi neyi seçer?",
        secenekler: [
            "Tüm satırlar, tüm sütunlar",
            "Tüm satırlar, 1. (ikinci) sütun",
            "1. satır, tüm sütunlar",
            "Sadece matris[1,1] hücresi"
        ],
        dogru: 1,
        aciklama: "':' tüm boyutları 'hepsini al' demektir. matris[:, 1] → tüm satırlardan 1 numaralı sütunu seç. Örneğin bir resmin sadece yeşil kanalını almak için: resim[:, :, 1]."
    },
    {
        soru: "Veri normalizasyonu (veriyi standart ölçeğe çekme) neden önemlidir?",
        secenekler: [
            "Dosyaları küçültür",
            "Model eğitimini kolaylaştırır: tüm özellikleri aynı ölçeğe getirir, büyük sayıların küçükleri ezmesini önler",
            "Kod okunabilirliğini artırır",
            "Matematiksel olarak zorunludur, olmadan kod çalışmaz"
        ],
        dogru: 1,
        aciklama: "Bir veride yaş (0-100) ve maaş (0-100000) varsa, maaş sayısal olarak yaştan çok büyüktür ve model ona gereksiz ağırlık verebilir. Normalizasyon (ortalama=0, std=1) her özelliği adil ölçeğe çeker."
    },
    {
        soru: "np.array([85,92,78,95,88]) üzerine np.mean() ne döndürür?",
        secenekler: ["88", "87.6", "85", "438"],
        dogru: 1,
        aciklama: "Ortalama = toplam / adet = (85+92+78+95+88) / 5 = 438/5 = 87.6. np.median için 88, np.sum için 438 dönerdi. YZ eğitim verisini incelerken bu istatistikleri bilmek veriyi 'tanımanın' ilk adımıdır."
    },
    {
        soru: "Bir resmi grayscale'e (siyah-beyaz) çevirmek için hangi NumPy işlemi en doğrudur?",
        secenekler: [
            "resim / 255",
            "resim[:, :, 0] — sadece kırmızı kanalı almak",
            "np.mean(resim, axis=2) — RGB kanallarının ortalamasını almak",
            "resim.flatten()"
        ],
        dogru: 2,
        aciklama: "RGB resmin her pikseli 3 değerden (R,G,B) oluşur. axis=2 boyunca (renk kanalları üzerinden) ortalama almak her pikseli tek bir gri değerine indirir. resim/255 ise sadece 0-1 aralığına normalize eder."
    },
    {
        soru: "Sinir ağına veri beslerken en kritik NumPy kontrolü hangisidir?",
        secenekler: [
            "print(len(array))",
            "print(array.dtype)",
            "print(array.shape) — modelin beklediği boyutla karşılaştırmak",
            "array.sum() hesaplamak"
        ],
        dogru: 2,
        aciklama: "En yaygın YZ hatası şekil uyumsuzluğudur. Model (32, 3, 224, 224) bekliyorsa (batch=32, RGB, 224×224), siz (224, 224, 3) gönderirseniz hata alırsınız. Her zaman .shape ile doğrulayın."
    }
];
