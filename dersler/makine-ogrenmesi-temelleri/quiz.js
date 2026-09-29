// Quiz: Makine Öğrenmesi Temelleri — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Denetimli öğrenme (supervised learning) nedir?",
        secenekler: [
            "Modelin kendi kendine öğrenmesi",
            "Her girdi için doğru cevabın da (etiket) verilerek modelin girdi→etiket eşleştirmesini öğrenmesi",
            "İnsan müdahalesi olmadan çalışan modeller",
            "Modelin gerçek zamanlı veri toplaması"
        ],
        dogru: 1,
        aciklama: "Denetimli öğrenmede her eğitim örneği bir çift olarak gelir: (girdi, doğru cevap). Spam filtresi örneği: binlerce e-posta ve her biri için 'spam' veya 'değil' etiketi. Model bu çiftlerden örüntüyü öğrenir."
    },
    {
        soru: "Eğitim/test seti ayrımının temel amacı nedir?",
        secenekler: [
            "Eğitim süresini kısaltmak",
            "Modelin görmediği veri üzerinde adil performans ölçümü yapabilmek",
            "Veri setini küçültmek",
            "Bellekten tasarruf etmek"
        ],
        dogru: 1,
        aciklama: "Tüm veriyi eğitmek ezberlemeye yol açar (overfitting). Test seti: modele 'sınav' yapmak için ayrılır. Eğitimde gördüğü verilerle değil, görmediğiyle başarısını ölçeriz — gerçek hayatta karşılaşacağı durum budur."
    },
    {
        soru: "Özellik (feature) ve etiket (label) arasındaki fark nedir?",
        secenekler: [
            "Feature = çıktı, label = girdi",
            "Feature = model girişi (bilinenler), label = model çıktısı (tahmin edilmek istenen)",
            "İkisi aynı şeyin farklı adı",
            "Feature = büyük veri, label = küçük veri"
        ],
        dogru: 1,
        aciklama: "Ev tahmin örneği: özellikler = [m², oda sayısı, konum] (modelin bildiği), etiket = fiyat (modelin tahmin edeceği). X → model → y (tahmin). Eğitimde gerçek y ile modelin tahmini karşılaştırılır."
    },
    {
        soru: "MSE (Mean Squared Error) kaybında hataların karesi alınmasının nedeni nedir?",
        secenekler: [
            "İşlem daha kolay olsun diye",
            "Negatif ve pozitif hataların birbirini götürmesini engellemek + büyük hataları daha ağır cezalandırmak",
            "Sonucu büyütmek için",
            "Görselleştirmeyi kolaylaştırmak için"
        ],
        dogru: 1,
        aciklama: "Tahmin -1 ve +1 hatası ortalaması alınırsa → 0 görünür (hata yokmuş gibi!). Kare alınca her ikisi de pozitif olur. Ayrıca kare almak büyük hataları kübik artışla cezalandırır: 2 hataya karşı 4 kat ceza."
    },
    {
        soru: "Bir model eğitim setinde %99 doğruluk, test setinde %61 doğruluk gösteriyorsa bu ne anlama gelir?",
        secenekler: [
            "Model mükemmel çalışıyor",
            "Overfitting: model eğitim verisini ezberlemiş, yeni veriye genelleme yapamıyor",
            "Test seti bozuk",
            "Model yeterince eğitilmemiş"
        ],
        dogru: 1,
        aciklama: "Eğitimde çok yüksek, testte düşük skor = overfitting klasiği. Model veriyi 'anlamamış', sadece 'ezberlemiş'. Çözüm: daha fazla veri, regularization, dropout (M5 dersinde göreceğiz)."
    },
    {
        soru: "Pekiştirmeli öğrenme (reinforcement learning) hangi senaryo için en uygundur?",
        secenekler: [
            "E-posta spam filtreleme",
            "Satranç oynayan bir yapay zeka",
            "Ev fiyat tahmini",
            "Metin çevirisi"
        ],
        dogru: 1,
        aciklama: "RL, bir ajanın çevreyle etkileşimde ödül/ceza sinyaliyle öğrenmesidir. Satranç: hamle yap → kazanırsan ödül, kaybedersen ceza. RLHF dersinde LLM'lere uygulanışını göreceğiz."
    },
    {
        soru: "optimizer.step() komutu ne yapar?",
        secenekler: [
            "Modeli bir katman büyütür",
            "Hesaplanan gradyanlara (türevlere) göre ağırlıkları günceller",
            "Eğitimi bir epoch ileri taşır",
            "Model çıktısını ekrana yazdırır"
        ],
        dogru: 1,
        aciklama: "Eğitim döngüsünün kalbi: backward() türevleri hesaplar → optimizer.step() bu türevleri kullanarak her ağırlığı 'hatayı azaltacak yönde' minik bir adım günceller. Bu işlem milyonlarca parametrede tekrarlanır."
    },
    {
        soru: "Doğrusal regresyon modeli ne öğrenir?",
        secenekler: [
            "Kategorileri ayıran sınırları",
            "Veriye en iyi uyan doğrunun eğimini (slope) ve kesişimini (intercept)",
            "Kümeleme merkezlerini",
            "Metin token sıralarını"
        ],
        dogru: 1,
        aciklama: "y = w·x + b formülündeki w (eğim) ve b (kesişim) değerlerini öğrenir. 'm² arttıkça fiyat artar' ilişkisini w pozitif gösterir. Basit görünmesine rağmen tüm derin öğrenme bu temel fikrin üstüne inşa edilir."
    },
    {
        soru: "Denetimsiz öğrenmeye (unsupervised learning) en iyi örnek hangisidir?",
        secenekler: [
            "Spam e-postaları etiketleyerek model eğitmek",
            "Etiket olmadan müşterileri benzer davranışlarına göre kümelere ayırmak",
            "Karakterleri tanıyarak metni tahmin etmek",
            "Oyun oynayarak ödüle ulaşmak"
        ],
        dogru: 1,
        aciklama: "Denetimsiz öğrenmede etiket (doğru cevap) yoktur. Model verinin kendi iç yapısını keşfeder — örneğin benzer alışveriş alışkanlıklarına sahip müşteri grupları oluşturur. Küme isimleri modele değil, bize aittir."
    }
];
