// Quiz: Tespit İnce Ayarı — 9 soru
window.QUIZ_DATA = [
    {
        soru: "dataset.yaml dosyasında 'names: {0: kedi, 1: kopek}' satırı neyi tanımlar?",
        secenekler: [
            "Dosya isimlerini",
            "Sınıf ID'lerinin insan-okunur adlarını — tahmin çıktısında '0' yerine 'kedi' gösterilir",
            "Veri setinin boyutunu",
            "Etiketleme aracını"
        ],
        dogru: 1,
        aciklama: "Model sadece ID'leri (0, 1) öğrenir; names haritası çıktıyı okunur hale getirir. Ayrıca değerlendirme raporlarında sınıf bazlı mAP gösterimi için gereklidir."
    },
    {
        soru: "Mosaic augmentation nedir?",
        secenekler: [
            "Görüntüyü mozaik desene çevirme",
            "4 resmi 2×2 mozaikte birleştirme — nesneyi farklı ölçek/kombinasyonlarda gösterme, küçük nesne öğrenimini güçlendirir",
            "Renk değiştirme",
            "Görüntüyü bulanıklaştırma"
        ],
        dogru: 1,
        aciklama: "YOLOv4'ün (Bochkovskiy et al.) getirdiği teknik: 4 rastgele resmi kesip birleştirir. Model aynı nesneyi 4 farklı bağlamda ve ölçekte tek adımda görür. Eğitim hızlanır; COCO mAP ~2 puan artar. Son epoch'larda kapanmalı."
    },
    {
        soru: "Precision yüksek ama Recall düşük çıkması ne anlama gelir?",
        secenekler: [
            "Model her şeyi doğru yapıyor",
            "Model çok seçici: koyduğu kutular doğru ama çoğu nesneyi kaçırıyor (temkinli detektör)",
            "Model çok hızlı",
            "Veri seti dengeli"
        ],
        dogru: 1,
        aciklama: "Precision = doğru tespitler / tüm tespitler. Recall = doğru tespitler / gerçek nesneler. P↑R↓: model 'belirsizse koyma' modunda. Çözüm: güven eşiğini (conf threshold) düşür veya daha fazla/küçük nesneli veri ekle."
    },
    {
        soru: "100-500 resimle tespit modeli eğitirken augmentation'ın rolü nedir?",
        secenekler: [
            "Zorunlu değil",
            "Kritik: etkin veri setini binlerce varyasyona çıkarır — overfitting'i önler, genelleme için şart",
            "Sadece görsel güzellik",
            "Eğitimi yavaşlatır, kullanılmamalı"
        ],
        dogru: 1,
        aciklama: "500 resim = model için ezbere yetecek kadar az. Flip+rotation+jitter+mosaic kombinasyonu binlerce sanal örnek üretir. Tespit için bu, sınıflandırmadan bile daha kritiktir çünkü kutu koordinatları da augmentation'la birlikte güncellenmelidir."
    },
    {
        soru: "YOLO formatında koordinatlar neden 0-1 normalize edilir?",
        secenekler: [
            "Dosya boyutu küçülür",
            "Resim boyutundan bağımsızlık — model 640×640 veya 1280×1280 ile çalışsa aynı etiket geçerli",
            "MPEG standardı gereği",
            "Daha hızlı okunması için"
        ],
        dogru: 1,
        aciklama: "Normalize koordinat (cx=0.5) görüntü boyutuna orandır. Resim yeniden boyutlandırıldığında etiketler bozulmaz. COCO (piksel bazlı xywh) formatta bu avantaj yok. Kütüphaneler arası dönüşüm için xywh_to_xyxy gibi fonksiyonlar kullanılır."
    },
    {
        soru: "Copy-paste augmentation ne zaman özellikle değerlidir?",
        secenekler: [
            "Her zaman",
            "Nadir sınıfı artırmak için (veri dengesizliğinde) — nadir nesneyi kesip birçok farklı arka plana yapıştırarak örnek sayısını suni artırır",
            "Renk düzeltmek için",
            "Hız için"
        ],
        dogru: 1,
        aciklama: "Sınıf dengesizliği tespit modellerini yanıltır: model sık sınıfı görmeye alışır. Copy-paste: kedi resmi kesip köpek arka planına koy → nadir sınıf sıklaşır. Instance-level augmentation: nesne maskesini kullanarak gerçekçi yapıştırma yapar."
    },
    {
        soru: "close_mosaic=10 parametresi neyi ifade eder?",
        secenekler: [
            "10 resim mozaiğe kapanır",
            "Son 10 epoch'ta mosaic kapatılır — model gerçek (tek resim) dağılıma son bir uyum yapar, test performansı iyileşir",
            "10 saniye sonra mozaik kesilir",
            "Mozaiğe katılan resim sayısı"
        ],
        dogru: 1,
        aciklama: "Mosaic resimleri gerçek test verisinden farklıdır (kesik birleşim). Sonlarda bunu kapatıp gerçek resimlerle uyum sağlamak, YOLO'nun kanıtlanmış eğitim hilesidir. Bu 'LR warmup'a benzer: başta cesaret, sonda hassasiyet."
    },
    {
        soru: "Etiketlemede 'sadece nesnenin kafası' ile 'tüm vücudu' karışık kullanılırsa ne olur?",
        secenekler: [
            "Model ikisini de öğrenir",
            "Model tutarsız öğrenir — bazen kafaya, bazen tümüne kutu çizer; mAP düşer çünkü IoU tutarsız",
            "Veri seti bozulur, hiç eğitilmez",
            "Sadece hız etkilenir"
        ],
        dogru: 1,
        aciklama: "Etiket tutarlılığı kritiktir. Yarım etiketler (bazısında kafa, bazısında tüm vücut) modelin IoU hedeflerini kararsız kılar. Net etiketleme kılavuzu şart: 'Nesnenin tüm görünür bölgesi kutuya dahil edilecek.' Ekibin tek standarda uyması gerekir."
    },
    {
        soru: "YOLOv8n (nano) ile YOLOv8x kullanmak arasındaki temel fark nedir?",
        secenekler: [
            "Hiçbir fark yok",
            "yolov8n: 3.2M parametre, hızlı (~1ms/resim CPU), ~37 mAP; yolov8x: 68M parametre, yavaş, ~54 mAP — mobil/edge için nano, sunucu için x",
            "Nano sadece CPU'da, x sadece GPU'da",
            "X daha az parametre içerir"
        ],
        dogru: 1,
        aciklama: "Boyut serisi: n, s, m, l, x — artan parametre, hız-kalite dengesi. Edge cihaz (telefon, Raspberry Pi) için n; production sunucu için m/l; kapasite/kalite maksimumu için x. Transfer learning mantığıyla hazır modelden başlamak her iki durumda da standarttır."
    }
];
