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
        aciklama: "ImageNet'te 14M resimle öğrenilen özellikler (katman 1-4: kenar/doku/şekil) evrensel. Kedi-köpek sınıflandırma bu özellikleri kullanabilir. Sadece son sınıflandırma katmanını (veya birkaç üst katmanı) değiştirirsiniz."
    },
    {
        soru: "requires_grad = False ile tüm parametreleri dondurup sadece son katmanı (fc) eğitmek ne zaman en iyi seçimdir?",
        secenekler: [
            "Her durumda en iyisidir",
            "Az veri var (< 1000 örnek) ve görev ImageNet'e benzer — overfitting riski düşük, hızlı",
            "Her zaman en kötüsüdür",
            "Sadece video modelleri için"
        ],
        dogru: 1,
        aciklama: "Az veriyle tüm katmanları eğitmek overfitting'e yol açar. Sadece fc katmanı (~1000 parametre) eğitmek hızlı ve güvenli. Göreviniz ImageNet'ten çok farklıysa (örn. X-ray tıbbi görüntüler) son 1-2 katmanı da çözmeniz gerekir."
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
        aciklama: "resnet18: son katman fc = Linear(512, 1000) — 1000 ImageNet sınıfı. Bunu Linear(512, 2) ile değiştirirsiniz. in_features=512 backbone'un son feature boyutudur. Yeni katman rastgele init edilir; önceki katmanlar korunur."
    },
    {
        soru: "Farklı katmanlara farklı öğrenme oranı (discriminative LR) kullanmanın nedeni nedir?",
        secenekler: [
            "GPU belleğini korumak için",
            "İlk katmanlar değerli genel bilgi taşır (büyük LR bozar), son katmanlar görev-özel (büyük LR ile hızlı adapte olur)",
            "Daha şık kod yazmak için",
            "PyTorch'un gereksinimi"
        ],
        dogru: 1,
        aciklama: "Gradyan iniş katman katman aynı LR'de çalışırsa ImageNet bilgisi silinir. Tipik: backbone LR=1e-5..1e-4, head LR=1e-3 (10-100x fark). Bu 'yavaş sulanan bahçe' prensibi: genel özellikler yumuşakça ayarlanır, başlık hızla öğrenir."
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
        aciklama: "PyTorch ImageFolder: veri/kedi/001.jpg, veri/kopek/002.jpg → sınıf etiketi klasör adından otomatik çekilir ('kedi'→0, 'kopek'→1). En basit veri organizasyonu için standarttır."
    },
    {
        soru: "Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) kullanılmasının teknik nedeni nedir?",
        secenekler: [
            "Güzel görünmesi için",
            "Bunlar ImageNet veri setinin gerçek RGB kanal istatistikleri; önceden eğitilmiş model bu dağılımı bekler — farklı normalize etme modeli kör eder",
            "Sadece RGB resimlerde çalışır",
            "Rastgele seçilmiş sabitler"
        ],
        dogru: 1,
        aciklama: "Model ImageNet'te öğrendi: (R-0.485)/0.229 ölçekli girdi bekler. Siz [0-1] scale verirseniz ağın öğrendiği tüm ağırlıklar 'yanlış çevrilmiş' veriye bakar. Fine-tuning'de önceli normalize eşleştirmesi kritik bir detaydır."
    },
    {
        soru: "Tıbbi X-ray görüntüleri (görsel olarak ImageNet'ten çok farklı) için en mantıklı strateji nedir?",
        secenekler: [
            "Sadece fc katmanını değiştir, backbone donuk",
            "Son 1-2 katmanı da aç (unfreeze) veya tam fine-tuning — ImageNet'in 'nesne' özellikleri X-ray dokularına tam uymaz",
            "Sıfırdan eğitmek",
            "Transfer learning hiç kullanılmamalı"
        ],
        dogru: 1,
        aciklama: "X-ray'in dokuları, kontrast yapısı doğal fotoğraflardan çok farklı. Yine de ImageNet'ten başlamak sıfırdan eğitimden iyidir (temel kenar/doku algısı transfer edilir). Ama üst katmanların adaptasyonu gerekir → daha fazla katmanı aç, daha düşük LR kullan."
    },
    {
        soru: "Az veriyle (örn. 200 resim) fine-tuning yaparken en kritik risk nedir?",
        secenekler: [
            "Model çalışmaz",
            "Overfitting — 200 resmi ezberleyip testte başarısız olma",
            "GPU patlaması",
            "Çok iyi sonuç"
        ],
        dogru: 1,
        aciklama: "ResNet-18'de ~11M parametre vs 200 resim → modelin ezberleme kapasitesi veriden binlerce kat büyük. Savunma: (1) sadece fc katmanını eğit, (2) agresif data augmentation, (3) erken durdurma, (4) dropout artır. L5 dersindeki tüm teknikler burada kritiktir."
    },
    {
        soru: "Fine-tuning'de ImageNet backbone'una 1e-5, yeni fc katmanına 1e-3 LR vermenin mantığı nedir?",
        secenekler: [
            "fc katmanı daha önemlidir",
            "Backbone genel bilgiyi hızlıca 'unutmamalı' (yavaş ayar), fc hiç bilmiyor (hızlı öğrenmeli)",
            "İşlemci tasarrufu",
            "Backbone eğitilmez"
        ],
        dogru: 1,
        aciklama: "fc yeni katman = rastgele — büyük adımlarla öğrenmeli. Backbone = değerli ImageNet bilgisi — küçük adımlarla rafine edilmeli. LR farkı bu ikisini dengeler. Adam optimizer'ın adaptif özelliği de aynı fikri destekler."
    },
    {
        soru: "Hangi durumda sıfırdan eğitim (transfer learning'siz) mantıklıdır?",
        secenekler: [
            "Her zaman",
            "Çok büyük alan-spesifik veri setiniz var (< 1M örnek) veya görev ImageNet özelliklerinden tamamen bağımsız",
            "Hiçbir zaman — transfer learning her durumda",
            "Sadece metin modelleri için"
        ],
        dogru: 1,
        aciklama: "Çok büyük özel veri seti (örn. Tesla'nın otonom sürüş görüntüleri milyonlarcası) veya tamamen farklı sinyal tipi (MRI, radar) transfer learning'in avantajını azaltır. Ancak standart fotoğraf görevlerinde transfer learning neredeyse her zaman daha hızlı ve iyidir."
    }
];
