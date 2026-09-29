// Quiz: Sinir Ağları — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Bir yapay nöronun temel çalışma formülü nedir?",
        secenekler: [
            "Çıktı = girdi + sabit",
            "z = (girdiler × ağırlıkların toplamı) + bias → a = aktivasyon(z)",
            "Çıktı = en büyük girdi",
            "z = girdiler / ağırlıklar"
        ],
        dogru: 1,
        aciklama: "Yapay nöron: her girdi kendi ağırlığı ile çarpılır → toplanır → bias eklenir → aktivasyon fonksiyonundan geçirilir. z = Σ(xᵢ·wᵢ) + b, ardından a = f(z). Bu, matris çarpımının nöron seviyesindeki hali."
    },
    {
        soru: "ReLU aktivasyon fonksiyonu ne yapar?",
        secenekler: [
            "Tüm değerleri 0-1 arasına sıkıştırır",
            "Negatif değerleri 0 yapar, pozitifleri aynen geçirir",
            "Tüm değerleri doğrusal olarak ölçekler",
            "Değerlerin işaretini değiştirir"
        ],
        dogru: 1,
        aciklama: "ReLU(x) = max(0, x). Negatifse → 0, pozitifse → kendisi. Basit ama güçlü: doğrusallığı kırarak karmaşık örüntüleri öğrenmeyi mümkün kılar ve gradyanları sağlıklı tutar (sigmoid'in aksine)."
    },
    {
        soru: "Aktivasyon fonksiyonu olmadan çok katmanlı bir sinir ağı neden işe yaramaz?",
        secenekler: [
            "Bellek taşması olur",
            "Katman sayısı ne olursa olsun, sonuç yine tek doğrusal fonksiyon gibi davranır — karmaşık şekilleri öğrenemez",
            "Çok hızlı çalışır, eğitilemez",
            "Sözdizimi hatası verir"
        ],
        dogru: 1,
        aciklama: "Doğrusal fonksiyonların bileşimi de doğrusaldır: f(g(x)) = a·(b·x+c)+d = ab·x + ... hâlâ tek doğrudur. Aktivasyon fonksiyonu doğrusallığı kırar; ancak bu sayede ağ karmaşık, eğri sınırları öğrenebilir."
    },
    {
        soru: "Bias (b) parametresinin rolü nedir?",
        secenekler: [
            "Modeli yavaşlatır ama doğruluğu artırır",
            "Nöronun aktivasyon eşiğini kaydırır — girdi olmadan da çıkış üretebilme yeteneği kazandırır",
            "Ağırlıkları sıfırlar",
            "Softmax gibi olasılığa çevirir"
        ],
        dogru: 1,
        aciklama: "Bias olmadan tüm girdiler sıfır olduğunda çıktı da sıfır olur. Bias, 'modelin genel eğilimini' temsil eder: tüm girdiler nötrken bile nöronun tetiklenip tetiklenmeyeceğini ayarlar."
    },
    {
        soru: "Softmax fonksiyonu aşağıdaki hangi senaryoda kullanılır?",
        secenekler: [
            "Gizli katmanlarda aktivasyon olarak",
            "Çok sınıflı sınıflandırma çıktı katmanında olasılık dağılımı üretmek için",
            "Görüntüyü sıkıştırmak için",
            "Ağırlıkları başlatmak için"
        ],
        dogru: 1,
        aciklama: "Softmax, çıktı katmanındaki ham skorları (logit) toplamı 1 olan olasılıklara çevirir: [2.0, 1.0, 0.1] → [%66, %24, %10]. Model 'kaç sınıf varsa o kadar çıktı üretir', softmax bu çıktıları yorumlanabilir hale getirir."
    },
    {
        soru: "Derin sinir ağlarında (çok katmanlı) katmanlar neleri öğrenir?",
        secenekler: [
            "Hepsi aynı şeyi öğrenir",
            "İlk katmanlar basit özellikleri (kenar), sonraki katmanlar daha soyut özellikleri (şekil/nesne) öğrenir",
            "Sadece son katman öğrenir, önceki katmanlar sabittir",
            "Her katman bağımsız veri seti görür"
        ],
        dogru: 1,
        aciklama: "Hiyerarşik öğrenme: Görüntü ağında Katman 1 kenar detektörleri, Katman 5 şekil birleştiricileri, Katman 20 göz/kulak gibi parçalar, Katman 100+ 'bu bir yüz' gibi tam nesne temsilleri öğrenir."
    },
    {
        soru: "'İleri yayılım' (forward pass) aşağıdakilerden hangisidir?",
        secenekler: [
            "Ağırlıkların rastgele başlatılması",
            "Girdiden katman katman hesaplayarak çıktının üretilmesi (tahmin aşaması)",
            "Hataların geriye doğru yayılımı",
            "Modelin test setinde çalıştırılması"
        ],
        dogru: 1,
        aciklama: "İleri yayılım: girdi → katman 1 hesapla → aktivasyon → katman 2 hesapla → ... → çıkış. Model 'tahmin yaptığında' bu gerçekleşir. Ağırlık güncellemek için hatanın geriye yayıldığı aşama ise 'geriye yayılım'dır (backward pass)."
    },
    {
        soru: "nn.Linear(784, 128) katmanı kaç parametre içerir? (MNIST girdisi → 128 nöron)",
        secenekler: ["128", "784", "100.352 (= 784×128)", "100.480 (= 784×128 + 128 bias)"],
        dogru: 3,
        aciklama: "Ağırlık matrisi: 784 × 128 = 100.352. Bias vektörü: 128. Toplam: 100.480 parametre. Bu sadece TEK katmanın parametre sayısı — büyük modellerde milyarlarca parametre vardır. Quantization dersinde bu sayının neden önemli olduğunu göreceğiz."
    },
    {
        soru: "Sigmoid aktivasyonunun derin ağlarda dezavantajı nedir?",
        secenekler: [
            "Çok hızlı çalışması",
            "Gradyanların (türev) katmanlarda çok küçülmesi (vanishing gradient), öğrenmeyi durdurması",
            "Sadece pozitif değerlerle çalışması",
            "ReLU'dan daha yavaş olması"
        ],
        dogru: 1,
        aciklama: "Sigmoid'in türevi en fazla 0.25'tir. Her katmanda gradyan 4 kat küçülür; 10 katman sonra gradyan neredeyse sıfırlanır. İlk katmanlar hiç güncellenemez → öğrenme durur. ReLU bu sorunun üstesinden gelir: pozitif bölgede türevi her zaman 1'dir."
    }
];
