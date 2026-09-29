// Quiz: Görüntü Quantization — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Görüntü modellerinde hangi katman en hassas quantization hedefidir (en çok kalite kaybı riski)?",
        secenekler: [
            "UNet denoising bloğu",
            "VAE decoder — latent'ten pikselleri üretir; INT8'de renk kayması/doku kaybı yaygındır. FP16 veya FP32 tutulması önerilir",
            "Metin encoder (CLIP)",
            "İlk conv katmanı"
        ],
        dogru: 1,
        aciklama: "VAE decoder son adımdır: 64x64 latent → 512x512 piksel. Bu dönüşümdeki quantization hatası doğrudan görüntüde 'görünür'. Renk kayması, posterization (renk bantları), doku kaybı. UNet daha toleranslı: birçok denoising adımı hatayı maskeler."
    },
    {
        soru: "UNet'i INT8 quantize etmek ile VAE decoder'ı INT8 quantize etmek arasındaki fark nedir?",
        secenekler: [
            "Hiçbir fark yok",
            "UNet INT8 genellikle kalite kaybı olmadan hız kazandırır; VAE decoder'da renk ve detay kaybı belirgindir — strateji: UNet'i sıkıştır, VAE'yi koru",
            "İkisi de aynı hız etkisi",
            "VAE her zaman daha hızlı"
        ],
        dogru: 1,
        aciklama: "UNet her adımda gürültü tahmini yapar — hatalar sonraki adımlarla düzeltilir. VAE tek geçişte piksel üretir — hata geri alınamaz. Pratik kural: UNet INT8/FP8, VAE FP16. Model boyutunun %90'ı UNet'tir; VAE koruması küçük bedeldir."
    },
    {
        soru: "FP8 (8-bit floating point) INT8'den nasıl ayrışır?",
        secenekler: [
            "Aynı şey",
            "FP8 (E4M3/E5M2) kayan nokta formatıdır: exponent+mentissa ile normalize aralıklı değerler; LLM'de NVFP4/FP8 daha iyi dinamik aralık sunar INT8'e göre",
            "FP8 daha yavaştır her zaman",
            "Sadece CPU'da çalışır"
        ],
        dogru: 1,
        aciklama: "INT8: eşit aralıklı 256 değer. FP8: kayan nokta (sign+exponent+mantissa) ile çok küçük ve orta büyüklükte değerleri iyi temsil eder, büyüklerde daha az hassas. Kayan nokta doğası gereği quantization dağılımına uygun. NVIDIA Hopper+ destekler."
    },
    {
        soru: "TensorRT ne yapar?",
        secenekler: [
            "Modeli eğitir",
            "Modeli NVIDIA GPU mimarisi için optimize edilmiş 'execution plan' dosyasına derler — kernel fusion, precision seçimi, bellek yönetimi",
            "Resimleri sıkıştırır",
            "Quantization'ı geri alır"
        ],
        dogru: 1,
        aciklama: "TensorRT: PyTorch/ONNX modelini platform-spesifik binary'e çevirir. Kernel fusion (conv+relu tek kernelde), precision seçimi (hangi katman FP16/INT8 — hızlı olan seçilir), bellek optimizasyonu. SD inference'da %50-100 hızlanma tipiktir."
    },
    {
        soru: "ONNX export'unun amacı nedir?",
        secenekler: [
            "Modeli daha küçük dosyaya çevirmek",
            "PyTorch/TensorFlow modelini ortak formata çevirmek — her platformda (onnxruntime, TensorRT, CoreML, web) çalıştırılabilir",
            "Quantization yapmak",
            "Gradyan hesabı"
        ],
        dogru: 1,
        aciklama: "ONNX: platform-agnostic model formatı. Export → onnxruntime Python/JS/mobile'da çalıştırılabilir. TensorRT ile birleştirilebilir (ONNX → TensorRT). Web'in ONNX.js ile tarayıcıda model çalıştırma bu temel üzerine kuruludur (U4 dersinde detaylı)."
    },
    {
        soru: "Post-training quantization (PTQ) ile QAT (Quantization-Aware Training) farkı nedir?",
        secenekler: [
            "Hiçbir fark yok",
            "PTQ: eğitim sonrası ağırlıkları dönüştür (hızlı ama kalite kaybı); QAT: eğitimde sahte quantization — model INT8'de çalışmayı öğrenir, kalite daha yüksek ama eğitim pahalı",
            "PTQ daha kaliteli",
            "QAT sadece LLM için"
        ],
        dogru: 1,
        aciklama: "PTQ (kalibrasyon): model çıktısı ile quantize model çıktısını küçük bir veri kümesinde karşılaştır, ölçek faktörlerini seç. Kullanımı kolay ama drift olabilir. QAT: forward pass'ta sahte quantization uygular (weights fake-quantized), backward float'ta — model '8-bit ile yaşamayı' öğrenir. Kalite ↑, eğitim maliyeti ↑."
    },
    {
        soru: "SDXL Turbo/Lightning modellerinde quantization'ın ek yararı neden sınırlı olabilir?",
        secenekler: [
            "Bu modeller quantize edilemez",
            "Bu modeller zaten 1-4 adımda üretim yapar — quantization hesaplama süresini kısaltır ama asıl darboğaz UNet boyutu/piksel sayısı olmaya devam eder",
            "Ağırlıklar farklı formatta",
            "Lora ile birleştirilemezler"
        ],
        dogru: 1,
        aciklama: "Distilled modeller (Turbo/Lightning) adım sayısını dramatik düşürür (1000→4). Quantization her adımı hızlandırır ama 4 adımda zaten hız sınırlıdır. Bellek hâlâ avantaj sağlar (daha küçük model → daha küçük cihaza sığar)."
    },
    {
        soru: "Mixed precision inference ne demektir?",
        secenekler: [
            "İki farklı model kullanmak",
            "Modelin farklı katmanlarının farklı hassasiyette çalışması: UNet FP16, VAE FP32, Text encoder INT8 — her katmanın ihtiyacına göre",
            "FP16 + quantization karışık",
            "Sadece LLM'lerde geçerli"
        ],
        dogru: 1,
        aciklama: "Mixed precision = her katman için en uygun hassasiyet. Pratikte: compute-heavy UNet'te FP16/FP8 hız için, VAE'de FP32 kalite için, text encoder'da INT8 boyut için. TensorRT'nin default stratejisi budur: 'hangi katman hangi hassasiyette hızlısaysa onu seç'."
    },
    {
        soru: "Görüntü modeli quantization'ında SSIM (Structural Similarity) metriği neyi ölçer?",
        secenekler: [
            "Model boyutunu",
            "Quantize öncesi ve sonrası görüntü arasındaki yapısal benzerliği — PSNR'dan daha iyi insan algısına uyar",
            "Inference hızını",
            "Parametre sayısını"
        ],
        dogru: 1,
        aciklama: "SSIM (0-1): yapısal benzerlik (luminance, contrast, structure korelasyonu). Quantization kalitesi ölçümünde tercih edilir çünkü insan gözü piksel hata karesi (MSE)'den çok yapısal farklılıkları hisseder. SSIM >0.95 kalite kabul edilebilir."
    }
];
