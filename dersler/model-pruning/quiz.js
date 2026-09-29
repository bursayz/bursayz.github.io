// Quiz: Pruning — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Magnitude pruning'in mantığı nedir?",
        secenekler: [
            "Rastgele ağırlıkları sıfırlamak",
            "En küçük mutlak değerli ağırlıkları sıfırlamak — küçük ağırlık çıktıya az katkı yapar varsayımı",
            "Tüm ağırlıkları aynı değere eşitlemek",
            "Katmanları silmek"
        ],
        dogru: 1,
        aciklama: "|w| küçükse w·x de küçük — çıktıya katkısı ihmal edilebilir varsayılır. Basit ama etkilidir. Sınır durumlar: bias düzeltmesi ile büyük etki yapan küçük ağırlıklar nadirdir ama vardır (Taylor skoru bu durumu yakalar)."
    },
    {
        soru: "Yapısal (structured) pruning'in yapısal olmayana (unstructured) avantajı nedir?",
        secenekler: [
            "Daha fazla doğruluk",
            "Sıradan dense donanımda da hız/bellek kazancı — kanal/başlık sildiğinizde matrisler gerçekten küçülür, seyrek format gerekmez",
            "Daha kolay kodlanır",
            "Geriye yayılım gerektirmez"
        ],
        dogru: 1,
        aciklama: "Unstructured: sıfır dağılık — donanım hâlâ dense matris çarpımı yapar, tasarruf teorik. Structured: kanal sildiğinizde (512→384) sonraki katmanın giriş boyutu da küçülür — CUDA core'ları doğrudan daha az iş yapar. Hızlanma gerçektir."
    },
    {
        soru: "Lottery Ticket Hypothesis neyi iddia eder?",
        secenekler: [
            "Büyük modeller her zaman daha iyidir",
            "Başarılı rastgele başlatılmış yoğun ağ, kendi başına aynı performansa eğitilebilen daha küçük bir alt ağ ('kazanan bilet') içerir — budanmış yapı sıfırdan eğitilemez ama orijinal başlangıçla eğitilebilir",
            "Budama performansı her zaman düşürür",
            "Küçük modeller öğrenemez"
        ],
        dogru: 1,
        aciklama: "Frankle & Carbin (2019): budanmış alt ağı ORİJİNAL başlangıç ağırlıklarıyla (ve aynı mimari şansıyla) sıfırdan eğitirseniz tam ağa denk sonuç alırsınız. Rastgele başlatmayla alamazsınız! Ağlar 'şanslı alt ağlar' içerir; büyük ağın asıl avantajı bu şansı artırmasıdır."
    },
    {
        soru: "İteratif budamada 'buda → kısa ince ayar → tekrar' döngüsünün nedeni nedir?",
        secenekler: [
            "Zaman kazanmak",
            "Budama sonrası kalan ağırlıkların kaybı telafi etmek için adaptasyonu — tek seferde agresif budama modeli çökertir",
            "GPU verimliliği",
            "Regülasyon zorunluluğu"
        ],
        dogru: 1,
        aciklama: "%90 tek adımda budanırsa kritik bağlantılar kaybolur, model toparlanamaz. Aşama aşama budamada her tur kalan ağ 'etrafındaki boşluğu örter' (retrain). Han et al. bu yinelemeyle %90+ seyreklikte bile orijinal doğruluğa ulaştı."
    },
    {
        soru: "Wanda ve SparseGPT gibi modern LLM pruning yöntemlerinin ortak yeniliği nedir?",
        secenekler: [
            "Her zaman %99 budama",
            "Eğitim OLMADAN (one-shot) budama — gradyan veya yeniden eğitim gerektirmez, kalibrasyon verisiyle önem hesaplanır",
            "Sadece CPU'da çalışması",
            "Quantization gerektirmesi"
        ],
        dogru: 1,
        aciklama: "Klasik pruning yeniden eğitim ister — LLM'de bu haftalar sürer. Wanda: |w| × ||aktivasyon|| skoru ile tek geçişte budama. SparseGPT: Hessian yaklaşımıyla one-shot. ~%50 seyreklik makul kaliteyle elde edilir; üstü kalite kaybettirir."
    },
    {
        soru: "Bir modeli mobilde çalıştırmak istediğinizde pruning vs quantization seçiminde ilk tercih neden genellikle quantization'dır?",
        secenekler: [
            "Pruning hiç kullanılmamalı",
            "Quantization kalibrasyon dışında eğitim gerektirmez, tüm modern motorlar (TFLite, llama.cpp) destekler ve öngörülebilir yaklaşık 4x kazanç sağlar; unstructured pruning ise mobilde desteksizdir",
            "Pruning dosyayı büyütür",
            "Quantization her zaman daha iyi kalite verir"
        ],
        dogru: 1,
        aciklama: "U1 dersindeki GGUF/INT8 her yerde çalışır; unstructured seyrek matrisler telefon GPU'sunda dense'den yavaş bile olabilir (format overhead). En iyi sonuç ikisinin kombinasyonu: önce structured pruning (kanal azaltma), sonra quantization."
    },
    {
        soru: "Taylor önem skoru |∂Loss/∂w · w|, magnitude |w|'den neden daha doğrudur?",
        secenekler: [
            "Daha büyük değerler üretir",
            "Ağırlığın kayba gerçek duyarlılığını ölçer — büyük ağırlığın küçük gradyanı olabilir (az önemli), küçük ağırlığın büyük gradyanı olabilir (kritik)",
            "Hesaplaması daha kolay",
            "Rastgele değil"
        ],
        dogru: 1,
        aciklama: "Birinci derece Taylor yaklaşımı: ağırlığı sıfırlamanın kayba etkisi ≈ |∂L/∂w · w|. Bu hem ağırlık büyüklüğünü hem eğimi hesaba katar. Molchanov et al. (2017) bunu kanal budamada magnitude'den üstün gösterdi. Bedeli: gradyan hesabı."
    },
    {
        soru: "LLM'de 'attention head pruning' (bazı başlıkları silmek) mümkün müdür?",
        secenekler: [
            "Hayır, başlıklar silinemez",
            "Evet — araştırmalar bazı başlıkların yedekli olduğunu gösterdi (örn. BERT'nin başlıklarının çoğu silinebilir); ancak modern LLM'lerde (GQA ile) başlıklar zaten azaltılmış durumda",
            "Sadece eğitim öncesi mümkün",
            "Sadece 1 başlık silinebilir"
        ],
        dogru: 1,
        aciklama: "Michel et al. (2019) 'Are Sixteen Heads Really Better than One?': BERT ve çeviri modellerinde pek çok başlık performans kaybı olmadan silinebilir. Ancak Llama-3 gibi modern modeller zaten GQA ile K/V başlıklarını optimize etmiştir — ek budama sınırı daha dardır."
    },
    {
        soru: "Budama sonrası 'fine-tuning' ile 'sıfırdan eğitim' arasındaki kritik fark nedir?",
        secenekler: [
            "Hiçbir fark yok",
            "Budanmış ağı orijinal ağırlıklarından devam ettirmek bilgiyi korur; rastgele yeniden başlatırsanız kalan yapı tek başına öğrenemeyebilir (Lottery Ticket bulgusu)",
            "Sıfırdan eğitim daha hızlıdır",
            "Budama sonrası eğitim gerekmez"
        ],
        dogru: 1,
        aciklama: "Budanmış alt ağın 'kazandıran bilet' olması orijinal başlatmayla ilişkilidir. Rastgele başlatılan aynı mimari çoğu zaman aynı performansa ulaşamaz. Bu yüzden iteratif budamada ağ hep mevcut ağırlıklarından devam eder — 'recover fine-tuning'."
    }
];
