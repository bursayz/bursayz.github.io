// Quiz: Model Quantization Derinlemesine — 10 soru
window.QUIZ_DATA = [
    {
        soru: "FP16 ile BF16 arasındaki kritik fark nedir?",
        secenekler: [
            "FP16 daha az bit kullanır",
            "FP16: 5 bit üs (dar aralık, yüksek hassasiyet); BF16: 8 bit üs (FP32 aralığı, düşük hassasiyet) — eğitimde taşmayı önler",
            "BF16 sadece CPU'dadır",
            "Hiçbir fark yoktur"
        ],
        dogru: 1,
        aciklama: "FP16 aralığı ±65504 — büyük aktivasyonlar veya gradyan birikmesi inf üretebilir. BF16, FP32'yle aynı üs aralığını korur ama mantissa 7 bite düşer. Bu yüzden eğitimde BF16 standarttır (büyük değerler taşmaz), quantization'da ise FP16 daha hassas sonuç verir."
    },
    {
        soru: "Simetrik quantization, ağırlıklar için neden uygundur?",
        secenekler: [
            "Her zaman daha hızlıdır",
            "Ağırlıklar tipik olarak sıfır merkezli normal dağılımdadır — sıfır noktası 0'a sabitlemek hesabı basitleştirir, değer aralığını tam kullanır",
            "Aktivasyonlar negatif olamadığı için",
            "Simetriklik şart değildir"
        ],
        dogru: 1,
        aciklama: "Ağırlıklar ortalama 0 simetrik dağılıma yakındır → simetrik quantizasyon [-127,127] tam aralığı kullanır. ReLU sonrası aktivasyonlar [0,∞)'ta olduğundan asimetrik (min,max,zero_point) yaklaşım daha iyi. W8 simetrik + A8 asimetrik kombinasyonu standarttır."
    },
    {
        soru: "Per-channel quantization, per-tensor'dan neden üstündür?",
        secenekler: [
            "Daha az hesap gerektirir",
            "Her çıkış kanalının kendi ölçeği vardır — kanallar arasında değer aralığı farklıysa tek ortak ölçek bazı kanallardaki bilgiyi yok eder",
            "Dosya boyutu küçülür",
            "GPU gerektiği için"
        ],
        dogru: 1,
        aciklama: "Kanal A değerleri [-10,10], kanal B [-0.1,0.1] olabilir. Per-tensor: ortak ölçek kanal B'yi ~3 değere indirger (bilgi ölür). Per-channel: her kanal kendi ölçeğini alır. LLM quantization'ında kritiktir; GGUF dahil tüm formatlar per-channel/grup temelli çalışır."
    },
    {
        soru: "GGUF dosya adındaki 'Q4_K_M' kodunun anlamı nedir?",
        secenekler: [
            "Rastgele kod",
            "4 bit/parametre ortalama; k-quants süper-blok yapısı; Medium karışık strateji (kritik katmanlar daha yüksek bitle)",
            "4 farklı model içeren paket",
            "Quantization'ın 4. versiyonu"
        ],
        dogru: 1,
        aciklama: "K-quants: ağırlıklar süper-bloklara bölünür, her blok kendi ölçeğini ve min değerini saklar (blok içinde n-bit tam sayılar). M (Medium): attention ve çıkış projeksiyonları 6-bit, geri kalan 4-bit. S her şeyi 4-bit yapar — M daha iyi kalite/boyut dengesidir."
    },
    {
        soru: "GPTQ'nun quantization hatasını azaltma yöntemi nedir?",
        secenekler: [
            "Modeli yeniden eğitmek",
            "Bir ağırlığı quantize edince, kalan ağırlıkları Hessian (2. türev) bilgisiyle ayarlayarak hatayı telafi etmek",
            "Daha fazla bit kullanmak",
            "Kalibrasyonu atlamak"
        ],
        dogru: 1,
        aciklama: "GPTQ (Optimal Brain Quantization'un pratik versiyonu): layer-wise quantization + hata düzeltme. Bir ağırlık yuvarlanınca oluşan çıktı hatası, henüz quantize edilmemiş komşu ağırlıkların ayarlanmasıyla telafi edilir. 4-bit LLM quantization'da uzun süre altın standarttı (sonra AWQ ve QLoRA)."
    },
    {
        soru: "AWQ'nun (Activation-aware Weight Quantization) temel bulgusu nedir?",
        secenekler: [
            "Tüm ağırlıklar eşit önemdedir",
            "Ağırlıkların sadece ~%0.1-1'i (yüksek aktivasyon alanlarına bağlananlar, 'salient weights') kalite için kritiktir — onları korumak çoğu hatayı önler",
            "Aktivasyonlar quantize edilemez",
            "Per-tensor quantization en iyisidir"
        ],
        dogru: 1,
        aciklama: "AWQ gözlemi: ağırlığın büyüklüğü değil, bağlandığı aktivasyonların büyüklüğü önem taşır. Az sayıdaki kritik ağırlığa özel ölçekleme uygulamak (koruma) 4-bit kalitesini belirgin yükseltir. Donanım dostudur çünkü dequantizasyon basit kalır."
    },
    {
        soru: "QAT'daki Straight-Through Estimator (STE) nedir?",
        secenekler: [
            "Bir quantization formatı",
            "Forward'da quantize eder, backward'da gradyanı değişmeden geçirir (round() fonksiyonunun türevi yoktur, gradyan 'atlar')",
            "GPU hızlandırma tekniği",
            "Kalibrasyon yöntemi"
        ],
        dogru: 1,
        aciklama: "round() işleminin türevi hemen her yerde 0'dır — normalde geriye yayılımda gradyan ölür. STE: x_q = x + (round(x) - x).detach() → forward quantize sonucu, backward round'suz gradyan. Bu kurnazca matematik kimliği QAT'ı mümkün kılar."
    },
    {
        soru: "Model boyutunda 7B parametre Q4_K_M ile yaklaşık kaç GB olur?",
        secenekler: [
            "13.5 GB",
            "~4.1 GB (7B × 4.8 bit/param ÷ 8 + metadata)",
            "0.5 GB",
            "28 GB"
        ],
        dogru: 1,
        aciklama: "7e9 × 4.8 bit = 33.6e9 bit ÷ 8 = 4.2 GB. Metadata (tokenizer, tensor isimleri) ile ~4.1-4.4 GB. Aynı model FP16'da 13.5GB, Q8_0'da 7.2 GB, Q2_K'da 2.7 GB. 8GB VRAM'li GPU'da çalıştırılabilir hale gelmesi bu yüzdendir."
    },
    {
        soru: "Kalibrasyon verisi seçerken en kritik prensip nedir?",
        secenekler: [
            "Mümkün olan en büyük veri seti",
            "Kalibrasyon verisinin gerçek üretim verisinin dağılımını temsil etmesi — yanlış dağılım = yanlış ölçekler = gizli kalite kaybı",
            "Sadece test seti kullanılmalı",
            "Kalibrasyon gerekli değildir"
        ],
        dogru: 1,
        aciklama: "512-1024 örnek yeterlidir ama TEMSİLİ olmalı. Türkçe model quantize ediyorsanız İngilizce kalibrasyon verisi aktivasyon dağılımlarını yanlış öğretir (özellikle tokenizer davranışı farklı olduğundan). UltraChat gibi genel setler evrensel LLM'ler için standarttır."
    },
    {
        soru: "Neden 2-bit (Q2) quantization genel kullanım için önerilmez?",
        secenekler: [
            "Donanım desteklemiyor",
            "16 değerle (2 bit) model bilgisi ciddi şekilde bozulur; 'ölçek yasası' araştırmaları kalite düşüşünün parametre kazancından hızlı olduğunu gösterir — 4-bit altın nokta",
            "2 bit matematiksel olarak imkansız",
            "Dosyalar çok küçük olur"
        ],
        dogru: 1,
        aciklama: "Dettmers'in 'k-bit inference scaling laws' çalışması: toplam bit sayısı sabitken kalite 4-bit'te tepe yapar. Q2 = daha fazla parametre sığar ama her parametre çok kaba → net kalite düşer. Q3 de marjinal. Pratik evrensel optimum: 4-5 bit."
    }
];
