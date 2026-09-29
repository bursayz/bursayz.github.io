// Quiz: Knowledge Distillation — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Distillation'da 'yumuşak hedef' (soft target) nedir?",
        secenekler: [
            "Modelin hata yapmasına izin vermek",
            "Öğretmenin tam olasılık dağılımı — 'kedi %80, köpek %18, tilki %2' gibi; sert etiket yerine tercih edilir",
            "Düşük öğrenme oranı",
            "Rastgele etiketler"
        ],
        dogru: 1,
        aciklama: "Sert etiket [0,0,1,0,0], yumuşak hedef [0.25,0.16,0.30,0.15,0.14]. İkincisi sınıflar arası benzerlik bilgisi taşır — öğrenci sadece 'doğru cevabı' değil, 'neden doğruya yakın olanın köpek olduğunu' öğrenir."
    },
    {
        soru: "Sıcaklık (T) parametresi softmax'ta ne yapar?",
        secenekler: [
            "Modeli hızlandırır",
            "T>1 dağılımı yumuşatır (olasılıklar birbirine yaklaşır — zayıf sınıflar görünür olur); T=1 standart softmax",
            "Model boyutunu küçültür",
            "Tokenları ısıtır"
        ],
        dogru: 1,
        aciklama: "softmax(logit/T): T=4 ile [2.5,0.8,3.1...] daha dengeli dağılıma dönüşür. Amaç: kazanan sınıfın %99.9 olduğu keskin dağılımda 'karanlık bilgi' gizli kalır; yumuşatmak onu görünür kılar. Kayıp T² ile ölçeklenir (gradyan büyüklüğünü korumak için)."
    },
    {
        soru: "'Karanlık bilgi' (dark knowledge) ifadesi neyi ifade eder?",
        secenekler: [
            "Etik olmayan veri kullanımı",
            "Etikette olmayan ama öğretmen olasılık dağılımında bulunan sınıflar arası benzerlik bilgisi (kedi-köpek yakınlığı gibi)",
            "Modelin gizli katmanlarındaki bilgi",
            "Şifrelenmiş veri setleri"
        ],
        dogru: 1,
        aciklama: "Hinton'un terimi: bir görüntüdeki bilginin çoğu 'bu köpek değil' veya 'bu köpeğe benziyor ama değil' gibi göreli ilişkilerdedir. One-hot etiket bu bilgiyi taşımaz; öğretmenin olasılık dağılımı taşır. Küçük modelin az veriyle iyi öğrenmesinin sırrı budur."
    },
    {
        soru: "Distillation kaybındaki T² çarpanının amacı nedir?",
        secenekler: [
            "Hesaplamayı hızlandırmak",
            "Sıcaklık gradyanları 1/T² ile küçülttüğünden, etkiyi dengelemek için kayıp T² ile çarpılır",
            "Sıcaklığı karelemek",
            "Matematiksel zorunluluk değil, gelenek"
        ],
        dogru: 1,
        aciklama: "softmax(z/T) türevi ~1/T² ölçeklenir; kayıp T² ile çarpılmazsa distillation teriminin gradyanları sert kayba göre önemsiz kalır. Hinton'un makalesindeki teknik detay — pratikte α parametreleriyle birlikte ayarlanır."
    },
    {
        soru: "DeepSeek-R1-Distill modellerinde kullanılan distillation biçimi nedir?",
        secenekler: [
            "Ağırlık kopyalama",
            "Sequence-level: R1'in ürettiği 800K uzun akıl yürütme zinciri (CoT), küçük Qwen/Llama modellerine SFT verisi olarak verilir",
            "Sadece logit eşleme",
            "Model birleştirme (merging)"
        ],
        dogru: 1,
        aciklama: "Büyük modelin üretimlerini küçük modelin eğitim verisi yapmak en pratik LLM distillation'ıdır: tokenizer uyumsuzluğu sorunu olmaz ve API ile bile veri toplanabilir. R1-Distill-1.5B, matematikte kendi sınıfındaki açık modelleri ezdi."
    },
    {
        soru: "Distillation'ın quantization'a göre dezavantajı nedir?",
        secenekler: [
            "Hiçbir dezavantajı yok",
            "Tam bir eğitim süreci gerektirir (öğretmen inference + öğrenci eğitimi) — quantization dakikalar sürerken distillation saatler/günler alır",
            "Kalitesi her zaman daha düşük",
            "Sadece CPU'da çalışır"
        ],
        dogru: 1,
        aciklama: "Quantization: mevcut ağırlıkları dönüştür, kalibrasyonla bitir. Distillation: veri hazırla (öğretmen inference), öğrenciyi eğit — ciddi hesaplama. Ama distillation 7B→1.5B gibi mimari küçültmeyi mümkün kılar; quantization tek başına ancak modeli aynı boyutta tutar."
    },
    {
        soru: "'Bias mirası' (yanlılık mirası) riski nedir?",
        secenekler: [
            "Öğrenci modelin daha hızlı eskimesi",
            "Öğretmenin yanlılıkları ve hatalı kalıpları öğrenciye aktarılması — hatta yumuşak hedeflerle güçlenerek",
            "Modelin şişmesi",
            "Veri sızıntısı"
        ],
        dogru: 1,
        aciklama: "Öğrenci öğretmeni taklit etmek için eğitilir — öğretmenin toksik veya yanlı davranışları da miras kalır, hatta distillation bunları güçlendirebilir. Çözüm: distillation verisini filtrelemek (U5 dersi: etik & güvenlikle doğrudan bağlantılı konu)."
    },
    {
        soru: "Toplam distillation kaybı genellikle nasıl yazılır?",
        secenekler: [
            "L = KL(öğretmen, öğrenci) yeterli",
            "L = α·L_sert(gerçek etiketlerle) + (1-α)·L_distill(öğretmenle) — ikisini dengeleyen α tipik olarak 0.3-0.5",
            "L = L_distill - L_sert",
            "L = L2 regularizasyonu"
        ],
        dogru: 1,
        aciklama: "Sadece öğretmene uyum öğrenciyi öğretmenin hatalarına da kilitler; gerçek etiketler 'zemine bağlar'. α=0.3 sert / 0.7 yumuşak yaygın tercihtir. Öğretmen mükemmelse (büyük model) α düşürülebilir."
    },
    {
        soru: "DistilBERT (2019) neyi kanıtladı?",
        secenekler: [
            "Transformer eğitilemez",
            "Distillation ile model %40 küçültülüp %60 hızlandırılabilir ve performansın %97'si korunabilir — distillation'ın endüstriyel kanıtı",
            "BERT yetersizdir",
            "İngilizce modeller distillation yapamaz"
        ],
        dogru: 1,
        aciklama: "DistilBERT: 66M parametre vs BERT-base 110M. Üçlü kayıp (distill + MLM + cosine embedding) ile eğitildi. Bu sonuç 'küçük ama akıllı' modellerin mümkün olduğunu endüstriye gösterdi — edge NLP'nin (U4) öncüsü."
    }
];
