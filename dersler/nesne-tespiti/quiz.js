// Quiz: Nesne Tespiti — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Görüntü sınıflandırma ile nesne tespiti arasındaki fark nedir?",
        secenekler: [
            "Aynı şey, farklı isim",
            "Sınıflandırma tek etiket verir ('bu resim kedi'); tespit her nesne için konum (bbox) + sınıf + güven skoru verir",
            "Tespit sadece video içindir",
            "Sınıflandırma daha hızlıdır her zaman"
        ],
        dogru: 1,
        aciklama: "Gerçek bir fotoğrafta 3 kedi, 1 köpek olabilir. Sınıflandırma 'kedi' dese de konum bilgisi yok. Tespit her nesne için (x,y,w,h) kutusu + sınıf + güven üretir. Otonom sürüş, yüz tanıma gibi uygulamalar tespit ister."
    },
    {
        soru: "IoU (Intersection over Union) nedir?",
        secenekler: [
            "İki kutunun toplam alanı",
            "Kesişim alanı / Birleşim alanı — tahmin ve gerçek kutunun örtüşme oranı; IoU>0.5 genellikle doğru tespit sayılır",
            "Bounding box'un köşegen uzunluğu",
            "Model doğruluk oranı"
        ],
        dogru: 1,
        aciklama: "IoU = A∩B / A∪B. Mükemmel=1.0, hiç temas=0. mAP@0.5 hesaplamak için her tespit eşiği geçer → metrik hesabına katılır. YOLO serisinin performans karşılaştırması bu metrik üzerinden yapılır."
    },
    {
        soru: "YOLO'nun 'You Only Look Once' adını almasının nedeni nedir?",
        secenekler: [
            "Çok hızlı olması",
            "Görüntüyü tek ağ geçişinde, tüm ızgara hücrelerindeki tahminleri aynı anda hesaplaması — bölge önerisi için ayrı aşama gerekmez",
            "Sadece resimlerle çalışması",
            "Tek katmanlı olması"
        ],
        dogru: 1,
        aciklama: "YOLO tek geçişli (single-pass, single-shot) bir tespitçidir. Önce bölge öner (R-CNN'ın 2 aşaması) yok — grid hücreleri doğrudan tahmin üretir. Sonuç: gerçek zamanlı hız (oyun/videoya uygun)."
    },
    {
        soru: "NMS (Non-Maximum Suppression) neyi çözer?",
        secenekler: [
            "Model boyutunu",
            "Aynı nesne için üretilen çoklu (5-10 adet) örtüşen kutudan en iyisini seçer, diğerlerini eler",
            "Görüntü kalitesini artırır",
            "Modeli hızlandırır"
        ],
        dogru: 1,
        aciklama: "Kedinin üzerinde 5 kutu örtüşebilir (biraz kaymış versiyonları). NMS: en yüksek güven skorlusunu tut → IoU≥eşik olan diğerlerini sil → tekrarla. Olmasa her nesne 5-10 kutu ile gösterilir, sonuç okunamaz."
    },
    {
        soru: "NMS'de IoU eşiği çok düşük ayarlanırsa (örn. 0.1) ne olur?",
        secenekler: [
            "Daha fazla nesne tespit edilir",
            "Farklı ama yakın nesneler bile birbirini siler (örn. kalabalıktaki yan yana iki insan tek kutuya iner) — yanlış negatifler artar",
            "Hiçbir etki olmaz",
            "Daha az kutu kalır, her zaman daha iyi"
        ],
        dogru: 1,
        aciklama: "Düşük eşik = agresif eleme. Kalabalık sahne, üst üste duran iki araba → birinin kutusu diğerini temizler → bir nesne kaybolur (false negative). Eşik seçimi (0.45-0.7) uygulama dengesidir; kalabalık sahnelerde yüksek tutulur."
    },
    {
        soru: "YOLO formatında bbox (cx, cy, w, h) neyi temsil eder?",
        secenekler: [
            "Köşe koordinatları (x1,y1,x2,y2)",
            "Merkez x, merkez y, genişlik, yükseklik — 0-1 normalize edilmiş (görüntü boyutuna oranlanmış)",
            "Sadece nokta koordinatı",
            "Piksel boyutunda mutlak değerler"
        ],
        dogru: 1,
        aciklama: "YOLO formatı: tüm değerler 0-1 normalize. cx=0.5 → görüntünün yatay merkezi. Bu normalize etiketleme görüntü yeniden boyutlandırıldığında bile geçerli kalır. xyxy veya xywh'a dönüşüm fonksiyonları vardır (dikkat: kütüphaneler arası format farkı!)."
    },
    {
        soru: "mAP@0.5 metriği neyi ölçer?",
        secenekler: [
            "Modelin hızını (ms)",
            "Tüm sınıfların Ortalama Hassasiyetlerinin (AP) ortalamasını; IoU=0.5 eşiğinde — tespit modellerinin standart değerlendirme metriği",
            "Kayıp fonksiyonunun değerini",
            "RAM kullanımını"
        ],
        dogru: 1,
        aciklama: "mAP@0.5 = her sınıf için AP (precision-recall eğrisi altındaki alan) hesapla, sınıflar arası ortalama al. YOLOv8n COCO'da ~37.3, YOLOv8x ~53.9 mAP@. Eğitimde arttıkça model iyileşiyor demektir."
    },
    {
        soru: "YOLO ızgara (grid) hücresi mantığı nasıl çalışır?",
        secenekler: [
            "Tek hücre tek tahmin",
            "Görüntü S×S hücreye bölünür; nesnenin MERKEZİ hangi hücredeyse o hücre o nesneyi tahmin etmekten sorumludur",
            "Her piksel ayrı hücredir",
            "Grid boyutu sabittir her model için"
        ],
        dogru: 1,
        aciklama: "YOLOv1'de S=7 (7×7=49 hücre). Nesnenin merkezi (3,5) hücresindeyse o hücrenin çıktı vektöründen bbox + sınıf çekilir. Her hücre B kutu önerir (B=2 orijinalde). Büyük nesneler merkez hücresiyle eşleşir — bu sorumluluk ataması eğitimde öğrenilir."
    },
    {
        soru: "Tespit modeli ile sınıflandırma modeli arasındaki yapısal fark nedir?",
        secenekler: [
            "Hiçbir fark, sadece veri farklı",
            "Tespit son katmanda (sınıf sayısı + bbox koordinatları) üretir: her kutusu için (p, x, y, w, h, c1, c2...) — çıktı tensörü çok daha karmaşıktır",
            "Sınıflandırma CNN kullanır, tespit kullanmaz",
            "Tespit daha basittir"
        ],
        dogru: 1,
        aciklama: "Sınıflandırma çıkışı: (batch, 10) → tek sınıf/skor. Tespit çıkışı: (batch, S, S, B×(5+C)) → her hücrenin her kutusu için bbox + sınıf skorları. Model backbone aynı (ResNet vs) ama 'detection head' çok daha karmaşıktır."
    },
    {
        soru: "Ultralytics YOLO `model(‘resim.jpg’)` ile hazır model çalıştırmanın ön koşulu nedir?",
        secenekler: [
            "Modeli önce kendiniz eğitmelisiniz",
            "pip install ultralytics yeterli — yolov8n.pt otomatik indirilir, COCO'da eğitilmiş 80 sınıf tanıyabilir",
            "CUDA zorunlu",
            "Etiketleme aracı gerekli"
        ],
        dogru: 1,
        aciklama: "YOLO kütüphanesi hazır ağırlık indirir → resim verin → kutular döner. Kod: from ultralytics import YOLO; model = YOLO('yolov8n.pt'); model('img.jpg'). CPU'da bile çalışır (yavaş). Kendi nesnenizi tespit için G5 dersindeki ince ayar gerekir."
    }
];
