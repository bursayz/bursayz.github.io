// Quiz: Geriye Yayılım ve Eğitim — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Eğitim döngüsünün doğru adım sırası nedir?",
        secenekler: [
            "backward() → forward() → step() → zero_grad()",
            "zero_grad() → forward() → loss hesapla → backward() → step()",
            "step() → forward() → backward() → zero_grad()",
            "forward() → step() → backward() → zero_grad()"
        ],
        dogru: 1,
        aciklama: "Doğru sıra: önce gradyanlar sıfırlanır (zero_grad), sonra dört öğrenme adımı gelir: (1) İleri geçiş ile tahmin al, (2) Kaybı hesapla, (3) backward() ile gradyanları hesapla, (4) step() ile ağırlıkları güncelle. zero_grad() hazırlık adımıdır, döngünün başında olmalıdır."
    },
    {
        soru: "optimizer.zero_grad() çağırmazsanız ne olur?",
        secenekler: [
            "Herhangi bir sorun olmaz",
            "Gradyanlar birikmeye devam eder, model yanlış yönde güncellenir",
            "Model çalışmaz, hata verir",
            "Eğitim hızlanır"
        ],
        dogru: 1,
        aciklama: "PyTorch'ta gradyanlar varsayılan olarak birikir (accumulate). Sıfırlamazsanız, 2. adımdaki gradyan 1. adımın üstüne eklenir — adımlar yanlış büyüklükte ve yönde atılır. Bu, eğitimin bozulmasının klasikleşmiş nedenlerinden biridir."
    },
    {
        soru: "Öğrenme oranı (learning rate) çok yüksek ayarlanırsa ne gözlemlenir?",
        secenekler: [
            "Model daha iyi öğrenir",
            "Kayıp grafiğinde dalgalanma veya patlama (diverjans) görülür, model minimumu sürekli atlar",
            "Eğitim yavaşlar ama stabil olur",
            "Hiçbir etkisi olmaz"
        ],
        dogru: 1,
        aciklama: "LR çok yüksek → her adımda minimumu geçersiniz (aşırı düzeltme). Kayıp grafiği düz bir çizgi yerine zigzag yapar veya sürekli artar. Çözüm: LR'yi 10 kat azaltıp deneyin. Başlangıç değeri optimizer'a bağlı: Adam için 0.001–0.0001 yaygınken SGD'de 0.01–0.1 aralığı denenir."
    },
    {
        soru: "Bir epoch nedir?",
        secenekler: [
            "Bir adım gradyan güncellemesi",
            "Tüm eğitim veri setinin modelden bir kez geçirilmesi",
            "Bir batch'in işlenmesi",
            "Model kaydetme sıklığı"
        ],
        dogru: 1,
        aciklama: "Epoch = tüm veri setinin modelden bir kez geçmesi. 1000 örnekli veri seti, batch_size=32 → 32 adet batch = 1 epoch. 5 epoch = tüm veri 5 kez gösterildi. Çok epoch overfitting riskini artırır."
    },
    {
        soru: "Mini-batch SGD kullanmanın (tüm veriyi tek seferde kullanmak yerine) avantajı nedir?",
        secenekler: [
            "Belleği verimli kullanır + gradyan hesabındaki gürültü (stochasticity) yerel minimumlardan kaçmaya yardım eder",
            "Daha hızlıdır ama daha kötü sonuç verir",
            "Kodu kısaltır",
            "Sadece büyük veri setleri için kullanılır, avantajı yoktur"
        ],
        dogru: 0,
        aciklama: "Mini-batch: (1) Bellek dostu — milyonlarca örneği tek seferde RAM'e sığdıramazsınız. (2) Hızlı geri bildirim — her batch sonrası güncelleme yapabilirsiniz. (3) Gürültü avantajı: rastgele batch'ler gradyanlara varyasyon katar, dar vadilerden çıkmayı kolaylaştırır."
    },
    {
        soru: "Gradyan kaybolması (vanishing gradient) hangi durumda ortaya çıkar?",
        secenekler: [
            "Learning rate çok yüksek olduğunda",
            "Sigmoid gibi dar türevli aktivasyonlar çok katmanlı ağlarda arka arkaya kullanıldığında",
            "Veri seti çok küçük olduğunda",
            "GPU kullanılmadığında"
        ],
        dogru: 1,
        aciklama: "Sigmoid'in türevi en fazla 0.25. 30 katman zincirleme çarpımsal olarak 0.25^30 ≈ 10⁻¹⁸ — gradyan neredeyse sıfırlanır, ilk katmanlar öğrenemez. Çözümler: ReLU (türevi 0 veya 1), residual bağlantılar (ResNet), BatchNorm."
    },
    {
        soru: "torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0) ne yapar?",
        secenekler: [
            "Gradyanları sıfırlar",
            "Gradyan vektörünün normunu 1.0'ı geçmeyecek şekilde kırpar — gradyan patlamasını önler",
            "Gradyanları normalize eder, ölçeğini 1 yapar",
            "Model ağırlıklarını [-1, 1] aralığına sınırlar"
        ],
        dogru: 1,
        aciklama: "Gradyan patlaması (exploding gradient) — özellikle RNN'lerde ve derin ağlarda — gradyanların katlanarak büyümesi ve ağırlıkları 'uçurması' demektir. clip_grad_norm_ toplam gradyan normunu max_norm'a sınırlar; eğitimi stabilize eder."
    },
    {
        soru: "Model tahmininde kayıp yüksek çıkarsa, backward() çağrıldığında büyük gradyanlar mı , küçük gradyanlar mı beklersiniz hatanın o parametredeki payı için?",
        secenekler: [
            "Gradyan büyüklüğü kayıptan bağımsızdır",
            "Kaybı en çok etkileyen parametrelerde büyük gradyanlar — bu parametreler 'sorumludur', daha büyük düzeltme alırlar",
            "Tüm parametrelerde eşit gradyan",
            "Kayıp büyükse gradyanlar sıfırlanır"
        ],
        dogru: 1,
        aciklama: "Gradyan, hatanın o parametreye olan 'duyarlılığını' ölçer: ∂kayıp/∂parametre büyükse, o parametreyi değiştirmek kaybı çok etkiler. backward() zincir kuralıyla her parametreye bunun üzerinden sorumluluk payını verir."
    },
    {
        soru: "Cross Entropy kaybında model doğru sınıfa ne kadar yüksek olasılık verirse kayıp nasıl değişir?",
        secenekler: [
            "Kayıp artar",
            "Kayıp azalır ve sıfıra yaklaşır — doğru sınıfa %100 olasılık vermek kaybı 0 yapar",
            "Kayıp sabit kalır",
            "Kayıp dalgalanır"
        ],
        dogru: 1,
        aciklama: "CE kaybı = -log(p_doğru_sınıf). Model doğru sınıfa %100 verirse → -log(1) = 0 (sıfır kayıp). %50 verirse → -log(0.5) = 0.69. %10 verirse → -log(0.1) = 2.3 (yüksek ceza). Model'kendinden eminse ve yanılıyorsa' çok ağır cezalandırılır."
    }
];
