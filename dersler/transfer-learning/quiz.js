// Quiz: Transfer Learning — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Transfer learning'in temel mantığı nedir?",
        secenekler: [
            "Sıfırdan eğitmek her zaman daha iyidir",
            "Büyük veri setinde öğrenilmiş genel özellikler (kenar, doku, şekil) çoğu görüntü görevinde paylaşılır — hazır modeli alıp son katmanları görevinize adapte edin",
            "Modelleri birleştirmek",
            "Veri setini büyütmek"
        ],
        dogru: 1,
        aciklama: "ImageNet-1k'da (~1,28M resim, 1000 sınıf) öğrenilen özellikler — ilk katmanlarda kenar/doku, ortada desen, sonda nesne temsilleri — birçok görsel görevde yeniden kullanılabilir. Sadece son sınıflandırma katmanını (veya birkaç üst bloğu) kendi görevinize göre değiştirirsiniz."
    },
    {
        soru: "requires_grad = False ile tüm parametreleri dondurup sadece son katmanı (fc) eğitmek ne zaman en iyi seçimdir?",
        secenekler: [
            "Her durumda en iyisidir",
            "Az veri var (yüzlerce örnek) ve görev ImageNet'e benzer — aşırı öğrenme riski düşük, eğitim hızlı",
            "Her zaman en kötüsüdür",
            "Sadece video modelleri için"
        ],
        dogru: 1,
        aciklama: "Az veriyle tüm katmanları eğitmek aşırı öğrenmeye yol açar. Sadece fc katmanını (ResNet-18'de 1026 parametre) eğitmek hızlı ve güvenlidir. Göreviniz ImageNet'ten çok farklıysa (örn. X-ray) üstten 1-2 bloğu açmanız gerekir."
    },
    {
        soru: "Backbone'un parametrelerini requires_grad=False yaptım. model.train() çağırınca backbone gerçekten hiç değişmez mi?",
        secenekler: [
            "Evet, requires_grad=False her şeyi dondurur",
            "Hayır — BatchNorm katmanları train() modunda running_mean/running_var istatistiklerini güncellemeye devam eder; backbone'u tam dondurmak için BN'leri de eval() moduna almak gerekir",
            "Sadece ilk epoch'ta değişir",
            "Sadece CUDA'da değişir"
        ],
        dogru: 1,
        aciklama: "requires_grad=False sadece gradyan akışını durdurur. BatchNorm'un tamponları (buffer) gradyan gerektirmez ve train() modunda kendi verinizin istatistikleriyle güncellenir — 'dondurulmuş' model sessizce değişir. Çözüm: train() sırasında BN modüllerini eval() modunda tutmak."
    },
    {
        soru: "model.fc = nn.Linear(model.fc.in_features, 2) satırı ne yapar?",
        secenekler: [
            "ResNet'i küçültür",
            "ResNet'in 1000 sınıflı ImageNet çıkış katmanını, 2 sınıflık (örn. kedi/köpek) yeni katmanla değiştirir",
            "Sadece 2 katman bırakır",
            "Modeli sıfırlar"
        ],
        dogru: 1,
        aciklama: "resnet18'in son katmanı fc = Linear(512, 1000)'dir. Bunu Linear(512, 2) ile değiştirirsiniz. in_features=512 backbone'un ürettiği özellik vektörü boyutudur. Yeni katman rastgele başlatılır; backbone korunur. Eğitilebilir parametre sayısı: 512×2 + 2 = 1026."
    },
    {
        soru: "Farklı katmanlara farklı öğrenme oranı (discriminative LR) kullanmanın nedeni nedir?",
        secenekler: [
            "GPU belleğini korumak için",
            "İlk katmanlar değerli genel bilgi taşır (büyük LR bu bilgiyi 'ezer'), son katmanlar ve yeni head görev-özeldir (büyük LR ile hızlı adapte olur)",
            "Daha şık kod yazmak için",
            "PyTorch'un gereksinimi"
        ],
        dogru: 1,
        aciklama: "Backbone'a büyük LR vermek ImageNet bilgisini tek adımda bozar (catastrophic forgetting). Tipik aralık: backbone 1e-5…1e-4, yeni head 1e-3 (10–100× fark). Ayrıca optimizer gruplarının modelin TÜM eğitilebilir parametrelerini kapsadığından emin olun — unutulan katman güncellenmez."
    },
    {
        soru: "ImageFolder(\"veri/train\") beklediği klasör yapısı nedir?",
        secenekler: [
            "veri/train/resimler.jpg düz liste",
            "veri/train/sinif_adi/resim1.jpg — her alt klasör bir sınıf, klasör adı etiket olur",
            "veri/train.csv formatında",
            "veri/train/images/*.png + veri/train/labels.txt ayrı"
        ],
        dogru: 1,
        aciklama: "veri/train/kedi/001.jpg, veri/train/kopek/002.jpg → etiket klasör adından otomatik alınır. train_ds.classes ile ['kedi', 'kopek'] sıralamasını öğrenip çıkarım kodunda aynı eşlemeyi kullanın."
    },
    {
        soru: "Önceden eğitilmiş modele doğru ön işlemeyi uygulamanın en güvenli yolu nedir?",
        secenekler: [
            "Kendi veri setinizin ortalama/std'sini hesaplayıp kullanmak",
            "weights.transforms() ile ağırlığın kendi ön işleme hattını otomatik almak — ort/std, resize ve crop değerleri model sürümüne uygun gelir",
            "Her resmi [0,1] aralığına çekmek yeterli",
            "Pikselleri 255'e bölmek"
        ],
        dogru: 1,
        aciklama: "weights.transforms() (örn. Resize(256)→CenterCrop(224)→Normalize) ağırlıkların eğitildiği ön işlemeyi birebir verir. Elle [0.485, 0.456, 0.406] yazmak da doğrudur ama model sürümü değişirse elle yazılan değerler eski kalabilir. Yanlış normalizasyon modelin beklediği girdi dağılımını bozar ve performansı düşürür."
    },
    {
        soru: "Tıbbi X-ray görüntüleri (ImageNet'ten görsel olarak çok farklı) için en mantıklı strateji nedir?",
        secenekler: [
            "Sadece fc katmanını değiştir, backbone donuk",
            "Önceden eğitilmiş ağırlıkla başla; head'i eğit, sonra üst katmanları düşük LR ile aç — sıfırdan başlamak yerine transfer neredeyse her zaman daha hızlı yakınsar",
            "Mutlaka sıfırdan eğitmek",
            "Transfer learning hiç kullanılmamalı"
        ],
        dogru: 1,
        aciklama: "X-ray dokuları doğal fotoğraftan farklıdır ama temel kenar/doku algısı yine de transfer edilir. Pratik yaklaşım: önce head'i eğit, sonra layer4 (+gerekirse layer3) katmanlarını küçük LR ile aç. Sıfırdan eğitim yalnızca alan-spesifik veri seti gerçekten büyükse (~1M+) düşünülür."
    },
    {
        soru: "Az veriyle (örn. 200 resim) ince ayar yaparken en kritik risk nedir?",
        secenekler: [
            "Model çalışmaz",
            "Aşırı öğrenme (overfitting) — 200 resmi ezberleyip test verisinde başarısız olma",
            "GPU belleği patlaması",
            "Çok iyi sonuç almak"
        ],
        dogru: 1,
        aciklama: "ResNet-18'de ~11M parametre vs 200 resim → ezberleme kapasitesi veriden binlerce kat büyük. Savunma: (1) yalnız head eğitin, (2) güçlü veri artırma (RandomResizedCrop, flip, ColorJitter), (3) weight decay, (4) val setiyle erken durdurma."
    },
    {
        soru: "Doğrulama (validation) sırasında hangi ikisi unutulursa metrikler yanlış çıkar?",
        secenekler: [
            "shuffle=True ve batch_size",
            "model.eval() ve torch.no_grad() — ilki BatchNorm/Dropout'u çıkarım moduna alır, ikincisi gradyan hesabını kapatır",
            "optimizer.step() ve loss.backward()",
            "ToTensor() ve Resize()"
        ],
        dogru: 1,
        aciklama: "eval() olmadan BN, eğitim batch istatistiklerini kullanıp istatistikleri günceller ve Dropout aktif kalır — val doğruluğu dalgalı ve yanıltıcı olur. no_grad() olmadan her batch için gradyan grafiği kurulur, bellek şişer ve eğitim yavaşlar."
    }
];
