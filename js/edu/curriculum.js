/**
 * Bursa Yapay Zeka Geliştiricileri Topluluğu — Müfredat Verisi
 * Tüm seriler ve derslerin merkezi tanımı.
 */

const SERILER = {
    temel:   { ad: "Temel",    renk: "#56a605", seriClass: "seri-temel",   aciklama: "Hiç bilmeyenler için sıfır noktası" },
    mldl:    { ad: "ML/DL",    renk: "#eab308", seriClass: "seri-mldl",    aciklama: "Makine öğrenmesi ve derin öğrenme temelleri" },
    llm:     { ad: "LLM",      renk: "#a855f7", seriClass: "seri-llm",     aciklama: "Büyük dil modelleri: sıfırdan eğitime" },
    goruntu: { ad: "Görüntü",  renk: "#3b82f6", seriClass: "seri-goruntu", aciklama: "Görüntü modelleri: CNN'den diffusion'a" },
    uzman:   { ad: "Uzman",    renk: "#64748b", seriClass: "seri-uzman",   aciklama: "Optimizasyon, budama ve dağıtım" }
};

const DERSLER = [
    // ===== TEMEL =====
    { slug: "yapay-zeka-nedir", seri: "temel", no: "T1", baslik: "Yapay Zeka Nedir?",
      ozet: "Yapay zekanın tanımı, tarihçesi, türleri ve bir modelin input'tan output'a yaşam döngüsü. Günlük hayattan örneklerle.",
      sure: "15 dk", viz: "2d-io-akis", sonraki: "matematik-temelleri" },

    { slug: "matematik-temelleri", seri: "temel", no: "T2", baslik: "Matematik Temelleri",
      ozet: "Vektörler, matrisler, matris çarpımı, türev ve olasılık. Yapay zekanın dili olan matematiği korkmadan öğrenin.",
      sure: "25 dk", viz: "3d-matris", onceki: "yapay-zeka-nedir", sonraki: "python-temelleri" },

    { slug: "python-temelleri", seri: "temel", no: "T3", baslik: "Python ile Programlama Temelleri",
      ozet: "Değişkenler, koşullar, döngüler, fonksiyonlar ve kütüphaneler. Yapay zeka geliştirmenin ana dili Python'a giriş.",
      sure: "30 dk", viz: "2d-kod-adim", onceki: "matematik-temelleri", sonraki: "numpy-veri-yapilari" },

    { slug: "numpy-veri-yapilari", seri: "temel", no: "T4", baslik: "NumPy ve Veri Yapıları",
      ozet: "Array, shape, indeksleme ve broadcasting. Modellerin veriyi nasıl gördüğünü anlamanın ilk adımı.",
      sure: "25 dk", viz: "2d-broadcast", onceki: "python-temelleri", sonraki: "veri-gorsellestirme" },

    { slug: "veri-gorsellestirme", seri: "temel", no: "T5", baslik: "Veri Görselleştirme",
      ozet: "Matplotlib ile grafikler, ısı haritaları ve veriyi doğru okuma. Modelin ne öğrendiğini 'görmek' için.",
      sure: "20 dk", viz: "2d-grafik", onceki: "numpy-veri-yapilari", sonraki: "makine-ogrenmesi-temelleri" },

    // ===== ML/DL =====
    { slug: "makine-ogrenmesi-temelleri", seri: "mldl", no: "M1", baslik: "Makine Öğrenmesi Temelleri",
      ozet: "Denetimli/denetimsiz öğrenme, özellik ve etiket, eğitim-test ayrımı, doğrusal regresyon ve kayıp kavramı.",
      sure: "25 dk", viz: "2d-regresyon", onceki: "veri-gorsellestirme", sonraki: "sinir-aglari" },

    { slug: "sinir-aglari", seri: "mldl", no: "M2", baslik: "Sinir Ağları ve Derin Öğrenme",
      ozet: "Yapay nöron, ağırlık ve bias, aktivasyon fonksiyonları ve ileri yayılım. 3D interaktif sinir ağı ile.",
      sure: "30 dk", viz: "3d-sinir-agi", onceki: "makine-ogrenmesi-temelleri", sonraki: "pytorch-temelleri" },

    { slug: "pytorch-temelleri", seri: "mldl", no: "M3", baslik: "PyTorch Temelleri",
      ozet: "Tensor, autograd, nn.Module ve DataLoader. Modern yapay zeka geliştirmenin standart aracına giriş.",
      sure: "30 dk", viz: "2d-autograd", onceki: "sinir-aglari", sonraki: "egitim-backprop" },

    { slug: "egitim-backprop", seri: "mldl", no: "M4", baslik: "Nasıl Öğrenir? Geriye Yayılım ve Eğitim",
      ozet: "Kayıp fonksiyonu, gradyan inişi, öğrenme oranı ve backward pass. Modelin 'öğrenmesi' tam olarak ne demek?",
      sure: "30 dk", viz: "2d-egitim-sim", onceki: "pytorch-temelleri", sonraki: "overfitting-regularization" },

    { slug: "overfitting-regularization", seri: "mldl", no: "M5", baslik: "Aşırı Öğrenme ve Düzenlileştirme",
      ozet: "Overfitting/underfitting, dropout, L1/L2, erken durdurma ve veri artırma. Modelin ezberlemesini engellemek.",
      sure: "25 dk", viz: "2d-overfit", onceki: "egitim-backprop", sonraki: "tokenization" },

    // ===== LLM =====
    { slug: "tokenization", seri: "llm", no: "L1", baslik: "Tokenization: Metni Sayılara Çevirmek",
      ozet: "BPE algoritması adım adım, özel token'lar ve bağlam penceresi. LLM'in gördüğü ilk şey: sayılar.",
      sure: "25 dk", viz: "2d-bpe", onceki: "overfitting-regularization", sonraki: "embedding" },

    { slug: "embedding", seri: "llm", no: "L2", baslik: "Embedding: Kelimelerin Koordinatları",
      ozet: "One-hot vs dağıtık temsil, embedding matrisi, kosinüs benzerliği. Kelimelerin anlamsal haritası.",
      sure: "25 dk", viz: "3d-embedding", onceki: "tokenization", sonraki: "self-attention" },

    { slug: "self-attention", seri: "llm", no: "L3", baslik: "Self-Attention: Model Nereye Bakıyor?",
      ozet: "Query/Key/Value, skor hesabı, softmax, ağırlıklı toplam ve nedensel maskeleme. Transformer'ın kalbi.",
      sure: "35 dk", viz: "3d-attention", onceki: "embedding", sonraki: "transformer-mimarisi" },

    { slug: "transformer-mimarisi", seri: "llm", no: "L4", baslik: "Transformer Mimarisi",
      ozet: "Çok başlık dikkat, artık bağlantılar, layer norm ve feed-forward. Tam transformer bloğunu birleştirelim.",
      sure: "35 dk", viz: "3d-transformer", onceki: "self-attention", sonraki: "gpt-sifirdan" },

    { slug: "gpt-sifirdan", seri: "llm", no: "L5", baslik: "Sıfırdan GPT Yapımı",
      ozet: "NanoGPT tarzı minimal GPT: katmanları birleştirme, karakter seviyesinde eğitim ve metin üretimi.",
      sure: "45 dk", viz: "2d-metin-uretim", onceki: "transformer-mimarisi", sonraki: "pretraining" },

    { slug: "pretraining", seri: "llm", no: "L6", baslik: "Ön Eğitim (Pretraining)",
      ozet: "Büyük veri kümeleri, kayıp eğrileri, hesaplama maliyeti ve ölçek yasaları. Temel model nasıl doğar?",
      sure: "30 dk", viz: "2d-olcek", onceki: "gpt-sifirdan", sonraki: "ince-ayar-sft" },

    { slug: "ince-ayar-sft", seri: "llm", no: "L7", baslik: "İnce Ayar ve SFT (Instruction Tuning)",
      ozet: "Talimat veri seti formatı, chat template, loss maskesi ve SFTTRainer ile eğitim. Modele davranış öğretmek.",
      sure: "40 dk", viz: "2d-sft-maske", onceki: "pretraining", sonraki: "lora-qlora" },

    { slug: "lora-qlora", seri: "llm", no: "L8", baslik: "LoRA ve QLoRA",
      ozet: "Parametre verimli ince ayar, düşük rank ayrışımı, NF4 quantization. Tek tüketici GPU'sunda milyar parametrelik model eğitmek.",
      sure: "40 dk", viz: "2d-lora", onceki: "ince-ayar-sft", sonraki: "rlhf-dpo" },

    { slug: "rlhf-dpo", seri: "llm", no: "L9", baslik: "RLHF ve DPO: Davranış Öğretmek",
      ozet: "İnsan geri bildirimi, ödül modeli, PPO ve DPO. ChatGPT'nin 'kibar' olmasının ardındaki süreç.",
      sure: "35 dk", viz: "2d-rlhf", onceki: "lora-qlora", sonraki: "inference-kv-cache" },

    { slug: "inference-kv-cache", seri: "llm", no: "L10", baslik: "Inference: KV-Cache ve Quantization",
      ozet: "Autoregressive üretim maliyeti, KV-cache, prefill/decode ve FP16/INT8/INT4. Modeli hızlı çalıştırmanın sırları.",
      sure: "30 dk", viz: "2d-kvcache", onceki: "rlhf-dpo", sonraki: "cnn-temelleri" },

    // ===== GÖRÜNTÜ =====
    { slug: "cnn-temelleri", seri: "goruntu", no: "G1", baslik: "CNN Temelleri",
      ozet: "Piksel matrisi, evrişim filtresi, stride/padding ve pooling. Görüntü modellerinin temel taşı.",
      sure: "30 dk", viz: "2d-conv", onceki: "inference-kv-cache", sonraki: "goruntu-siniflandirma" },

    { slug: "goruntu-siniflandirma", seri: "goruntu", no: "G2", baslik: "Görüntü Sınıflandırma Modeli Yapımı",
      ozet: "MNIST/CIFAR-10 ile PyTorch CNN modeli, eğitim döngüsü ve karışıklık matrisi. Kendi sınıflandırıcınızı yapın.",
      sure: "40 dk", viz: "2d-cizim-tahmin", onceki: "cnn-temelleri", sonraki: "transfer-learning" },

    { slug: "transfer-learning", seri: "goruntu", no: "G3", baslik: "Transfer Learning ve İnce Ayar",
      ozet: "ImageNet önceden eğitilmiş modelleri kullanma, son katman değiştirme ve freeze/unfreeze stratejileri.",
      sure: "30 dk", viz: "2d-freeze", onceki: "goruntu-siniflandirma", sonraki: "nesne-tespiti" },

    { slug: "nesne-tespiti", seri: "goruntu", no: "G4", baslik: "Nesne Tespiti (Object Detection)",
      ozet: "Bounding box, IoU, YOLO mimarisi ve NMS. 'Ne var?' sorusundan 'Nerede?' sorusuna geçiş.",
      sure: "35 dk", viz: "2d-bbox", onceki: "transfer-learning", sonraki: "tespit-ince-ayar" },

    { slug: "tespit-ince-ayar", seri: "goruntu", no: "G5", baslik: "Tespit Modeli İnce Ayarı",
      ozet: "Etiketleme araçları, YOLO/COCO formatları, augmentasyon ve mAP. Kendi detektörünüzü eğitin.",
      sure: "35 dk", viz: "2d-augment", onceki: "nesne-tespiti", sonraki: "diffusion-modelleri" },

    { slug: "diffusion-modelleri", seri: "goruntu", no: "G6", baslik: "Diffusion Modelleri: Gürültüden Görüntü",
      ozet: "İleri süreç, geri süreç, UNet ve DDPM. DALL-E ve Stable Diffusion'un arkasındaki sihir.",
      sure: "40 dk", viz: "3d-diffusion", onceki: "tespit-ince-ayar", sonraki: "goruntu-duzenleme" },

    { slug: "goruntu-duzenleme", seri: "goruntu", no: "G7", baslik: "Görüntü Düzenleme Modeli Yapımı",
      ozet: "Maskeleme, InstructPix2Pix yaklaşımı ve metinle düzenleme. Görüntünün bir bölgesini akıllıca değiştirmek.",
      sure: "35 dk", viz: "2d-inpaint", onceki: "diffusion-modelleri", sonraki: "duzenleme-ince-ayar" },

    { slug: "duzenleme-ince-ayar", seri: "goruntu", no: "G8", baslik: "Düzenleme Modeli İnce Ayarı",
      ozet: "DreamBooth ve LoRA ile diffusion ince ayarı. Kişiye/stile özel görüntü modeli yapmak.",
      sure: "30 dk", viz: "2d-dreambooth", onceki: "goruntu-duzenleme", sonraki: "goruntu-quantization" },

    { slug: "goruntu-quantization", seri: "goruntu", no: "G9", baslik: "Görüntü Modellerinde Quantization",
      ozet: "FP32→FP16→INT8 görüntü modelleri, VAE quantization ve TensorRT/ONNX hızlandırma.",
      sure: "25 dk", viz: "2d-viz-quant", onceki: "duzenleme-ince-ayar", sonraki: "model-quantization" },

    // ===== UZMAN =====
    { slug: "model-quantization", seri: "uzman", no: "U1", baslik: "Model Quantization Derinlemesine",
      ozet: "FP32/FP16/BF16, kalibrasyon, PTQ vs QAT ve GGUF formatları. Modeli küçültme sanatının derinlikleri.",
      sure: "35 dk", viz: "2d-quant", onceki: "goruntu-quantization", sonraki: "model-pruning" },

    { slug: "model-pruning", seri: "uzman", no: "U2", baslik: "Pruning: Modeli Budamak",
      ozet: "Yapısal/yapısal olmayan pruning, önem skoru ve seyreklik. Gereksiz bağlantıları atmak.",
      sure: "30 dk", viz: "3d-pruning", onceki: "model-quantization", sonraki: "knowledge-distillation" },

    { slug: "knowledge-distillation", seri: "uzman", no: "U3", baslik: "Knowledge Distillation",
      ozet: "Öğretmen-öğrenci mimarisi, yumuşak hedefler ve sıcaklık. Küçük modele büyük modelin bilgisini aktarmak.",
      sure: "30 dk", viz: "2d-distill", onceki: "model-pruning", sonraki: "edge-mobil-ai" },

    { slug: "edge-mobil-ai", seri: "uzman", no: "U4", baslik: "Edge ve Mobil AI",
      ozet: "ONNX dönüştürme, TFLite, WebNN/WebGPU ve tarayıcıda çalıştırma. Modeli telefonda çalıştırmak.",
      sure: "30 dk", viz: "2d-edge", onceki: "knowledge-distillation", sonraki: "etik-guvenlik" },

    { slug: "etik-guvenlik", seri: "uzman", no: "U5", baslik: "Etik ve Güvenlik",
      ozet: "Yanlılık, halüsinasyon, veri gizliliği ve sorumlu geliştirme. Yapay zeka mühendisinin pusulası.",
      sure: "25 dk", viz: "2d-etik", onceki: "edge-mobil-ai", sonraki: null }
];

// Hızlı erişim için index haritası
const DERS_MAP = {};
DERSLER.forEach((d, i) => { DERS_MAP[d.slug] = { ...d, index: i }; });

function dersBul(slug) { return DERS_MAP[slug] || null; }
function seriDersleri(seriAdi) { return DERSLER.filter(d => d.seri === seriAdi); }
function sonrakiDers(slug) {
    const d = DERS_MAP[slug];
    return d && d.sonraki ? DERS_MAP[d.sonraki] : null;
}
function oncekiDers(slug) {
    const d = DERS_MAP[slug];
    return d && d.onceki ? DERS_MAP[d.onceki] : null;
}
