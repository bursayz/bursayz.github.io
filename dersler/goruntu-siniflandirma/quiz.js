// Quiz: Görüntü Sınıflandırma — 10 soru
window.QUIZ_DATA = [
    {
        soru: "MNIST veri seti nedir?",
        secenekler: [
            "Ses kayıtlarından oluşan bir veri seti",
            "60K eğitim + 10K test örneğinden oluşan 28×28 gri el yazısı rakam (0-9) veri seti — derin öğrenmenin standart başlangıç benchmar'ı",
            "Türkçe metin veri seti",
            "Video sınıflandırma seti"
        ],
        dogru: 1,
        aciklama: "MNIST: Y. LeCun'un 1998'de kurduğu veri seti. 70K rakam resmi. 'Derin öğrenmenin Hello World'ü' denir. Basit CNN'ler %99+ doğrulukla çalışır. CIFAR-10 (32×32 renkli, 10 sınıf) bir sonraki adımdır."
    },
    {
        soru: "transforms.Normalize((0.1307,), (0.3081,)) neden kullanılır?",
        secenekler: [
            "Görüntüyü siyah-beyaz yapmak için",
            "MNIST veri setinin ortalaması (0.13) ve standart sapması (0.31) ile normalize etmek — model için en verimli başlangıç ölçeği",
            "Dosya boyutunu küçültmek için",
            "Modelin eğitimini hızlandırmak için"
        ],
        dogru: 1,
        aciklama: "ToTensor() pikselleri [0,1]'e çevirir. Normalize ise ortalamayı çıkarır, std'ye böler: girişler ortalama=0, std=1 dağılımda olur. Bu, gradyan inişinin başlangıç adımlarını dengeli yapar. 0.1307 ve 0.3081 MNIST'in önceden hesaplanmış istatistikleridir."
    },
    {
        soru: "28×28 girdi → conv(3x3,p=1) → pool(2x2) → conv(3x3,p=1) → pool(2x2) zincirinde son spatial boyut nedir?",
        secenekler: ["28×28", "14×14", "7×7", "3×3"],
        dogru: 2,
        aciklama: "Conv(3,pad=1): boyutu korur (28). Pool(2): 28→14. Conv: korur (14). Pool(2): 14→7. Sonuç: 7×7 × 64 kanal = 3136 özellik → Flatten → fc1 girişi. Spatial boyutu kanal sayısına çevirme CNN standart paternidir."
    },
    {
        soru: "model(X).argmax(dim=1) ne döndürür?",
        secenekler: [
            "En yüksek skorlu sınıfın indeksini (tahmin edilen sınıf)",
            "Olasılık dağılımını",
            "Kayıp değerini",
            "Gradyanları"
        ],
        dogru: 0,
        aciklama: "Model çıktısı (batch, 10) ham skordur (logit). argmax(dim=1) her resim için en yüksek skorun sınıf indeksini (0-9) verir. Olasılık istiyorsanız önce softmax uygulayıp sonra argmax veya max yapın — aynı sınıfı verir ama güven skorunu da görürsünüz."
    },
    {
        soru: "Test değerlendirmesinde model.eval() ve torch.no_grad() kullanılmasının nedeni nedir?",
        secenekler: [
            "Eğitimi hızlandırmak",
            "model.eval(): Dropout/BatchNorm'u tutarlı moda alır; no_grad(): gradyan takibini kapatır (bellek+hız tasarrufu) — ikisi birlikte adil test sağlar",
            "Modeli eğitime devam etmek",
            "Veri setini normalize etmek"
        ],
        dogru: 1,
        aciklama: "train() modunda Dropout rastgele çalışır (testte tutarsız sonuç), BatchNorm batch istatistiklerini kullanır (testte running statistics gerek). no_grad() olmadan backward graph oluşturulur → bellek şişer, yavaşlar. Test değerlendirmesinde ikisi de zorunludur."
    },
    {
        soru: "Confusion matrix'te 'gerçek 4, tahmin 9' hücresi yüksek ise bu ne anlama gelir?",
        secenekler: [
            "Model mükemmel çalışıyor",
            "Model 4 rakamını sıklıkla 9 zannediyor — 4 ve 9 el yazısında gerçekten benzer olabilir; bu 'mantıklı hata'dır",
            "Veri seti bozuk",
            "Eğitim hiç çalışmamış"
        ],
        dogru: 1,
        aciklama: "4 ve 9 el yazısında gerçekten benzer görünebilir (kapalı 4). Bu hata modelin körü körüne ezberlemediğini, özellikleri öğrendiğini ama bu benzer sınıfları ayırt edemediğini gösterir. Çözüm: daha fazla bu tür örnek, daha derin model, veri augmentation."
    },
    {
        soru: "CrossEntropyLoss model çıktısına softmax uygulamak gerektiğini gerektirir mi?",
        secenekler: [
            "Evet, önce Softmax katmanı eklemelisiniz",
            "Hayır — CrossEntropyLoss, LogSoftmax+NLLLoss'u kendi içinde sayısal kararlı hesaplar; ham logitleri doğrudan verin",
            "Evet, ama sadece 2 sınıf için",
            "Duruma göre değişir"
        ],
        dogru: 1,
        aciklama: "PyTorch'un CrossEntropyLoss'u 'logits bekler': 'y = log_softmax(logits) + nll' birleşik hesaplar. Softmax'ı ayrıca uygulamak hem gereksiz hesap hem gradyan stabilitesi sorunu yaratır (double softmax). Logit → argmax da aynı sonucu verir çünkü softmax monotoniktir."
    },
    {
        soru: "Colab'da ücretsiz GPU kullanarak bu MNIST modelini eğitmek ne kadar sürer?",
        secenekler: [
            "5 saat",
            "1-2 dakika (T4 GPU'da) — MNIST minik bir veri seti, 421K parametreli model anında öğrenir",
            "30 saniye CPU'da",
            "1 hafta"
        ],
        dogru: 1,
        aciklama: "MNIST + bu küçük CNN ≈ Colab T4 GPU'da 1-2 dakika (3 epoch, ~60 saniye/epoch). Bu hız MNIST'in eğitim aracı olarak mükemmelliği: hata yapabilir, tekrar deneyebilir, sonucu hemen görebilirsiniz. Büyük modellerde bu lüks olmaz."
    },
    {
        soru: "Hata analizi yaparken karışıklık matrisinin satırı ve sütunu neyi temsil eder?",
        secenekler: [
            "Satır = tahmin, sütun = gerçek",
            "Satır = gerçek sınıf, sütun = tahmin edilen sınıf",
            "İkisi keyfi seçilebilir",
            "Karışıklık matrisi sadece diyagonal gösterir"
        ],
        dogru: 1,
        aciklama: "sklearn confusion_matrix: satır = gerçek sınıf (y_true), sütun = tahmin (y_pred). Diyagonal (köşegen) doğru tahminler. Diyagonal dışı koyu hücre = hangi sınıfın hangisiyle karıştığı. T5 dersinde ısı haritasıyla göreceğimiz görselleştirme tam olarak budur."
    },
    {
        soru: "Bu MNIST modelinin (~421K parametre) GPT-4'ten (tahmini 1.7T parametre) farkı nedir?",
        secenekler: [
            "Tamamen farklı algoritmalar",
            "Aynı temel mekanik: matris çarpımı, aktivasyon, kayıp, geriye yayılım — fark mimari karmaşıklık ve ölçek; prensip aynı",
            "MNIST modeli derin öğrenme kullanmaz",
            "GPT-4 daha az parametre içerir"
        ],
        dogru: 1,
        aciklama: "Bu derste öğrendiğiniz her kavram (CNN, conv, pool, dropout, adam, loss, backward) GPT-4'te de aynen kullanılır. Fark: transformer mimarisi vs CNN + milyar kat ölçek + trilyonlarca token veri. Temel mekanik aynıdır — bunu kavradıysanız derin öğrenmeyi öğrendiniz demektir."
    }
];
