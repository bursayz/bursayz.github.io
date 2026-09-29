// Quiz: Overfitting & Regularization — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Hangi senaryo overfitting'i (aşırı öğrenme) tanımlar?",
        secenekler: [
            "Train acc %95, Test acc %92 — model genelleme yapıyor",
            "Train acc %99.8, Test acc %58 — model eğitim verisini ezberlemiş",
            "Train acc %45, Test acc %44 — model yetersiz kalmış",
            "Train acc %60, Test acc %62 — model yeterli değil"
        ],
        dogru: 1,
        aciklama: "Overfitting'in klasik işareti: train-test arasındaki büyük performans farkı. Model eğitim verisinin 'ezberine' odaklanmış, genelleme yeteneğini kaybetmiş. (Train %45 Test %44 ise underfitting vardır.)"
    },
    {
        soru: "Dropout katmanı ne yapar?",
        secenekler: [
            "Modelin boyutunu küçültür",
            "Her eğitim adımında rastgele bir kısım nöronu geçici olarak kapatarak modelin tek nöronlara bağımlılığını önler",
            "Modeli daha hızlı çalıştırır",
            "Girdi verisini temizler"
        ],
        dogru: 1,
        aciklama: "Dropout(p=0.5): her mini-batch'te nöronların %50'si rastgele sıfırlanır. Model 'herhangi birine' güvenemez — daha sağlam, dağınık özellikler öğrenir. .eval() modunda otomatik devre dışı kalır."
    },
    {
        soru: "L2 regularization (weight decay) kayıp fonksiyonuna nasıl bir ceza ekler?",
        secenekler: [
            "|ağırlıklar| (ağırlıkların mutlak değerlerinin toplamı)",
            "λ × Σ(ağırlık²) — büyük ağırlıkları orantısız cezalandırır",
            "λ × aktivasyon sayısı",
            "λ × veri seti boyutu"
        ],
        dogru: 1,
        aciklama: "L2 cezası = λ × Σw² (Ridge). Büyük ağırlıklar orantısız cezalandırılır → model ağırlıkları küçük ve yumuşak (smooth) tutmaya zorlanır → genelleme artar. L1 ise |w| kullanır (Lasso), sıfır ağırlıklar üretebilir."
    },
    {
        soru: "Erken durdurma (early stopping) stratejisinde ne izlenir?",
        secenekler: [
            "Eğitim kaybı (train loss) — minimum olduğunda dur",
            "Doğrulama kaybı (validation loss) — belirli sayıda epoch iyileşmediğinde en iyi checkpoint'e dön",
            "Toplam eğitim süresi",
            "GPU sıcaklığı"
        ],
        dogru: 1,
        aciklama: "Erken durdurma: val loss izlenir. 'Sabır sayacı' (örn. 5) başlar; val loss iyileşmedikçe sayaç artar. Limit dolunca durma. En iyi val loss'taki model ağırlıkları geri yüklenir. Overfitting'e karşı en basit ve etkili savunma."
    },
    {
        soru: "Veri artırma (data augmentation) neden overfitting'i azaltır?",
        secenekler: [
            "Modeli yavaşlatır",
            "Modelin 'doğru cevap havuzunu' genişletir — aynı nesneyi farklı açılardan görerek ezberlemek yerine genelleme öğrenir",
            "GPU belleğini azaltır",
            "Modeli küçültür"
        ],
        dogru: 1,
        aciklama: "Augmentation ile 1000 resim, model için 1000'lerce farklı versiyon gibi görünür. Her epoch farklı varyasyonlar görür. Ezberlediği 'bu piksel dizisi' değil, 'bu nesnenin özü' olur — genelleme artar. Test verisine augmentation YAPILMAZ."
    },
    {
        soru: "model.eval() çağrısının dropout üzerindeki etkisi nedir?",
        secenekler: [
            "Dropout'u devre dışı bırakır (inference modunda tüm nöronlar aktif olur)",
            "Dropout oranını artırır",
            "Dropout'u ters çevirir",
            "Değişiklik yapmaz"
        ],
        dogru: 0,
        aciklama: "model.eval() → eval modu → Dropout devre dışı → BatchNorm running statistics kullanır. Inference/değerlendirme sırasında çağrılmalı. model.train() ile tekrar eğitim moduna dönülür. Unutursanız test sonuçları hatalı çıkar."
    },
    {
        soru: "Çok basit bir model (tek katmanlı, 3 parametre) karmaşık veri üzerinde underfitting gösteriyorsa, en uygun çözüm hangisidir?",
        secenekler: [
            "Dropout eklemek",
            "Modeli büyütmek (daha fazla katman/parametre eklemek)",
            "L2 regularization eklemek",
            "Learning rate'i düşürmek"
        ],
        dogru: 1,
        aciklama: "Underfitting = model, veriyi öğrenecek 'kapasiteye' sahip değil. Çözüm: modeli büyütmek (daha fazla katman, daha geniş nöronlar). Regularization teknikleri (dropout, L2) overfitting'i çözer, underfitting'i kötüleştirir."
    },
    {
        soru: "Düzenlileştirme (regularization) tekniklerinin ortak amacı nedir?",
        secenekler: [
            "Modelin daha hızlı çalışmasını sağlamak",
            "Train ve test performansı arasındaki farkı (gap) kapatarak genellemeyi artırmak",
            "Modelin daha fazla veri görmesini sağlamak",
            "Ağırlıkları sıfıra eşitlemek"
        ],
        dogru: 1,
        aciklama: "Tüm regularization teknikleri (dropout, L1/L2, augmentation, early stopping, BatchNorm) train-test farkını azaltmaya çalışır. 'Model ne öğrendiyse yeni veride de işe yarasın' hedefi ortaktır."
    },
    {
        soru: "Bir modelde hem dropout (p=0.5) hem de weight_decay=1e-4 kullanılması sorun teşkil eder mi?",
        secenekler: [
            "Evet, ikisi aynı anda kullanılamaz",
            "Hayır, farklı mekanizmalarla çalışırlar — birlikte kullanılabilirler ve çoğu zaman kullanılırlar",
            "Evet, biri diğerini iptal eder",
            "Sadece LLM'lerde kullanılabilir"
        ],
        dogru: 1,
        aciklama: "Dropout nöron kapatır (eksik bilgi ile öğrenmeye zorlamak), L2 weight_decay ağırlıkları küçültür (yumuşak model). Farklı mekanizmalarla genellemeyi artırırlar ve birlikte kullanılmak üzere tasarlanmışlardır. Transformer'larda hem dropout hem weight_decay standarttır."
    }
];
