// Quiz: PyTorch Temelleri — 9 soru
window.QUIZ_DATA = [
    {
        soru: "PyTorch Tensor ile NumPy array arasındaki temel farklar nelerdir?",
        secenekler: [
            "Hiçbir fark yok, sadece isim farklı",
            "Tensor GPU'da çalışabilir ve autograd (otomatik türev) takibi yapabilir",
            "Tensor sadece tam sayı tutabilir",
            "NumPy daha hızlıdır her durumda"
        ],
        dogru: 1,
        aciklama: "Tensor = NumPy array + autograd + GPU desteği. NumPy ile tensor arasında torch.from_numpy() ve .numpy() ile kolayca dönüşüm yapabilirsiniz. GPU'da tensor işlemleri milyonlarca parametreli modellerde yüzlerce kat hızlıdır."
    },
    {
        soru: "requires_grad=True parametresi ne yapar?",
        secenekler: [
            "Tensor'u sabit yapar, değiştirilemez",
            "Bu tensor'da yapılan işlemleri izler, backward() çağrıldığında türevleri hesaplar",
            "Tensor'u GPU'ya taşır",
            "Hassasiyeti artırır"
        ],
        dogru: 1,
        aciklama: "requires_grad=True, PyTorch'a 'bu tensor'ün gradyanını (türevini) takip et' der. Model parametreleri (ağırlıklar) bu bayrakla oluşturulur; model.backward() çağrıldığında her parametrenin .grad özelliği doldurulur."
    },
    {
        soru: "Aşağıdaki kodun çıktısı nedir?\nx = torch.tensor(4.0, requires_grad=True)\ny = x**2\ny.backward()\nprint(x.grad)",
        secenekler: ["4.0", "8.0", "16.0", "64.0"],
        dogru: 1,
        aciklama: "y = x² fonksiyonunun türevi dy/dx = 2x. x=4 için: 2×4 = 8. backward() bu türevi x.grad'a yazar. Bu, manuel türev hesaplamak yerine zincir kuralını uygulayan autograd'ın gücüdür."
    },
    {
        soru: "nn.Module'den miras alan bir sınıfta forward() neyi tanımlar?",
        secenekler: [
            "Modelin nasıl kaydedileceğini",
            "İleri yayılımı: girdinin katmanlardan geçerek nasıl çıktıya dönüştüğünü",
            "Modelin parametre sayısını",
            "Eğitim verisinin nasıl yükleneceğini"
        ],
        dogru: 1,
        aciklama: "forward(x) metodu, model(x) çağrıldığında çalışan fonksiyondur. Girdinin hangi katmanlardan, hangi aktivasyonlardan geçeceğini tanımlar. Geriye yayılım (backward) PyTorch tarafından otomatik hesaplanır, sizin tanımlamanız gerekmez."
    },
    {
        soru: "nn.Linear(784, 128) ne yapar?",
        secenekler: [
            "784 katmanlı, 128 adet model yaratır",
            "784 boyutlu girdi vektörünü, 128 boyutlu çıktı vektörüne dönüştüren tam bağlı (dense) katman oluşturur",
            "784 resmi 128 adete küçültür",
            "784×128 boyutunda boş tensor oluşturur"
        ],
        dogru: 1,
        aciklama: "nn.Linear(giris, cikis): y = Wx + b hesaplar. W: (cikis × giris) boyutunda ağırlık matrisi, b: (cikis) boyutunda bias. MNIST'te 784 piksellik (28×28) girdiyi 128 nöronluk gizli katmana bağlar."
    },
    {
        soru: "Eğitim döngüsünde model(batch_X).shape çıktısı [32, 10] ise bu ne anlama gelir?",
        secenekler: [
            "32 katmanlı, 10 sınıflı bir model",
            "32 resim toplu (batch) olarak işlendi, her biri için 10 sınıf skoru üretildi",
            "32. epoch'ta 10 doğru tahmin",
            "Modelde 32 parametre, 10 katman var"
        ],
        dogru: 1,
        aciklama: "Shape [batch_size, sınıf_sayısı] standardıdır: 32 resim beraberce işlendi (batch), her satır bir resmin 10 sınıf için ham skorlarını içerir (logit). CrossEntropyLoss bu ham skorlarla çalışır, softmax'ı kendi içinde uygular."
    },
    {
        soru: "CrossEntropyLoss ile çıktıya softmax uygulamamanın nedeni nedir?",
        secenekler: [
            "CrossEntropyLoss daha hızlıdır",
            "CrossEntropyLoss softmax'ı kendi içinde sayısal kararlı şekilde uygular; ayrıca uygulamak çift hesap olur ve gradyanları bozabilir",
            "Softmax çok yavaştır",
            "nn.Module softmax'ı desteklemez"
        ],
        dogru: 1,
        aciklama: "CrossEntropyLoss = LogSoftmax + NLLLoss bileşimidir ve sayısal kararlılık için optimize edilmiştir. Model çıktısına softmax uygulamadan doğrudan ham logitleri verirsiniz. İnference aşamasında olasılık görmek isterseniz softmax'ı ayrıca uygularsınız."
    },
    {
        soru: "DataLoader'ın batch_size=32 ve shuffle=True ayarları ne yapar?",
        secenekler: [
            "32 epoch eğitir ve veriyi karıştırır",
            "Her adımda 32 örnekli batch'ler verir ve her epoch öncesi veri sırasını karıştırır (ezberlemeyi önler)",
            "32 MB bellek ayırır",
            "32 işlem parçacığı kullanır"
        ],
        dogru: 1,
        aciklama: "batch_size: her gradient adımında kaç örneğin kullanıldığı. Büyük batch = daha stabil gradyan ama daha yavaş epoch. shuffle=True her epoch'ta veriyi karıştırarak modelin sıra bilgisini ezberlemesini önler."
    },
    {
        soru: "torch.cuda.is_available() True dönerse ne yapılmalıdır?",
        secenekler: [
            "Modeli ve veriyi .to('cuda') ile GPU'ya taşı — eğitimi önemli ölçüde hızlandırır",
            "Hiçbir şey, otomatik çalışır",
            "pip install cuda komutunu çalıştır",
            "PyTorch'u yeniden kur"
        ],
        dogru: 0,
        aciklama: "GPU'yu kullanmak için hem modeli hem veriyi .to('cuda') ile GPU belleğine taşımanız gerekir. model.to(device), x.to(device), y.to(device). Model ve veri aynı aygıtta (cpu veya cuda) olmalı, aksi hâlde hata alırsınız."
    }
];
