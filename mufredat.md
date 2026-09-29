# Bursa Yapay Zeka Geliştiricileri Topluluğu — Eğitim Müfredatı

Bu dosya, platformdaki tüm eğitim konularını ve tamamlanma durumlarını izler.
Bir ders tamamlandığında (içerik + sınav + görselleştirme) ilgili kutucuk `[x]` olarak işaretlenir.

**Renk kodları (ders temaları):**
- 🟢 TEMEL — yeşil (#56a605)
- 🟡 ML/DL — sarı/amber (#eab308)
- 🟣 LLM — mor (#a855f7)
- 🔵 GÖRÜNTÜ — mavi (#3b82f6)
- 🩶 UZMAN — gri/mavi (#64748b)

---

## 🟢 TEMEL (Başlangıç Seviyesi)

- [x] **T1 — Yapay Zeka Nedir?** (`yapay-zeka-nedir`)
  - Kapsam: YZ tanımı, kısa tarihçe, dar/geniş YZ, makine öğrenmesi vs derin öğrenme, günlük hayattan örnekler, model geliştirme yaşam döngüsü (input → output)
  - Görselleştirme: Input → Model → Output akış animasyonu (2D canvas)

- [x] **T2 — Matematik Temelleri** (`matematik-temelleri`)
  - Kapsam: Sayılar ve bilgisayarda temsili, vektörler, matrisler, matris çarpımı, türev ve eğim, olasılık
  - Görselleştirme: 3D vektör/matris çarpımı görselleştirmesi (Three.js)

- [x] **T3 — Python ile Programlama Temelleri** (`python-temelleri`)
  - Kapsam: Değişkenler, veri tipleri, koşullar, döngüler, fonksiyonlar, listeler/sözlükler, kütüphaneler (pip), hata ayıklama
  - Görselleştirme: Adım adım kod yürütme animasyonu (2D canvas)

- [x] **T4 — NumPy ve Veri Yapıları** (`numpy-veri-yapilari`)
  - Kapsam: Array kavramı, boyut/şekil (shape), indeksleme, broadcasting, temel istatistik, neden Python listesi değil NumPy
  - Görselleştirme: Broadcasting animasyonu + şekil (shape) görselleştirmesi (2D canvas)

- [x] **T5 — Veri Görselleştirme** (`veri-gorsellestirme`)
  - Kapsam: Matplotlib ile çizgi/sütun/dağılım grafikleri, ısı haritası (heatmap), eksen/etiket/legend, görselleştirme etiği (yanıltıcı grafikler)
  - Görselleştirme: İnteraktif örnek grafikler (2D canvas)

## 🟡 ML/DL (Orta Seviye)

- [x] **M1 — Makine Öğrenmesi Temelleri** (`makine-ogrenmesi-temelleri`)
  - Kapsam: Denetimli/denetimsiz/pekiştirmeli öğrenme, özellik (feature) ve etiket (label), eğitim/test ayrımı, doğrusal regresyon ve sınıflandırma, hata (loss) kavramı
  - Görselleştirme: Doğrusal regresyonun veriye oturması animasyonu (2D canvas)

- [x] **M2 — Sinir Ağları ve Derin Öğrenme** (`sinir-aglari`)
  - Kapsam: Yapay nöron, ağırlık ve bias, aktivasyon fonksiyonları (ReLU, sigmoid, softmax), katmanlar, ileri yayılım (forward pass)
  - Görselleştirme: 3D sinir ağı — girişten çıkışa canlı sinyal akışı (Three.js)

- [x] **M3 — PyTorch Temelleri** (`pytorch-temelleri`)
  - Kapsam: Tensor, CPU/GPU, basit işlemler, otomatik türev (autograd), ilk model (nn.Module), veri yükleyici (DataLoader)
  - Görselleştirme: Hesap grafiği (computational graph) animasyonu (2D canvas)

- [x] **M4 — Nasıl Öğrenir? Geriye Yayılım ve Eğitim** (`egitim-backprop`)
  - Kapsam: Kayıp fonksiyonu, gradyan inişi (gradient descent), öğrenme oranı, backward pass, epoch ve batch, mini-batch SGD
  - Görselleştirme: Eğitim simülasyonu — loss düşüşü ve ağırlıkların canlı güncellenmesi (2D canvas)

- [x] **M5 — Aşırı Öğrenme ve Düzenlileştirme** (`overfitting-regularization`)
  - Kapsam: Train/validation/test, overfitting/underfitting, dropout, L1/L2, erken durdurma, veri artırma (augmentation)
  - Görselleştirme: Overfitting/underfitting eğrileri ve dropout animasyonu (2D canvas)

## 🟣 LLM (Büyük Dil Modelleri)

- [x] **L1 — Tokenization: Metni Sayılara Çevirmek** (`tokenization`)
  - Kapsam: Karakter/kelime/alt-kelime tokenizasyonu, BPE algoritması adım adım, özel token'lar (BOS/EOS/PAD), bağlam penceresi
  - Görselleştirme: Canlı BPE token parçalama aracı (2D, kullanıcı metin yazar)

- [x] **L2 — Embedding: Kelimelerin Koordinatları** (`embedding`)
  - Kapsam: One-hot encoding vs dağıtık temsil, embedding matrisi, anlamsal benzerlik, kosinüs benzerliği, pozisyon encoding
  - Görselleştirme: 3D kelime nokta bulutu — benzer kelimelerin yakınlaşması (Three.js)

- [x] **L3 — Self-Attention: Model Nereye Bakıyor?** (`self-attention`)
  - Kapsam: Query/Key/Value, skor hesabı, softmax, ağırlıklı toplam, ölçekleme (√d), nedensel maskeleme (causal mask)
  - Görselleştirme: 3D attention matrisi — Q·K çarpımının adım adım görselleştirilmesi (Three.js)

- [x] **L4 — Transformer Mimarisi** (`transformer-mimarisi`)
  - Kapsam: Çok başlık dikkat (multi-head), artık bağlantılar (residual), layer normalization, feed-forward katmanı, tam transformer bloğu, encoder vs decoder
  - Görselleştirme: 3D transformer mimarisi — verinin katmanlar arası akışı (Three.js)

- [x] **L5 — Sıfırdan GPT Yapımı** (`gpt-sifirdan`)
  - Kapsam: NanoGPT tarzı minimal GPT, katmanları birleştirme, karakter seviyesinde küçük model eğitimi, metin üretimi (autoregressive sampling), temperature/top-k
  - Görselleştirme: Token-token metin üretim simülasyonu (2D canvas)

- [x] **L6 — Ön Eğitim (Pretraining)** (`pretraining`)
  - Kapsam: Büyük veri kümeleri, veri temizleme, kayıp eğrileri, eğitim maliyeti ve hesaplama (FLOPs), checkpointing, veri karıştırma
  - Görselleştirme: Ölçek yasaları (loss vs parametre/veri) grafiği animasyonu (2D canvas)

- [x] **L7 — İnce Ayar ve SFT (Instruction Tuning)** (`ince-ayar-sft`)
  - Kapsam: Temel model vs talimat modeli, talimat veri seti formatı (JSONL, messages), şablonlama (chat template), maskeleme ile sadece cevabı öğretmek, SFT eğitimi
  - Görselleştirme: SFT veri akışı şeması — sistem/kullanıcı/asistan rolleri ve loss maskesi (2D canvas)

- [x] **L8 — LoRA ve QLoRA** (`lora-qlora`)
  - Kapsam: Parametre verimli ince ayar (PEFT), düşük rank ayrışımı (A×B), rank/alpha/target modüller, adaptör birleştirme, NF4 quantization + QLoRA, Unsloth/vLLM ekosistemi
  - Görselleştirme: LoRA matris ayrışımı animasyonu (W + ΔW = A×B) (2D canvas)

- [x] **L9 — RLHF ve DPO: Davranış Öğretmek** (`rlhf-dpo`)
  - Kapsam: İnsan geri bildirimi, ödül modeli, PPO ile pekiştirmeli öğrenme, DPO ile doğrudan tercih optimizasyonu, güvenlik ve sınırlar
  - Görselleştirme: Tercih verisi → ödül → politika güncelleme döngüsü şeması (2D canvas)

- [x] **L10 — Inference: KV-Cache ve Quantization** (`inference-kv-cache`)
  - Kapsam: Autoregressive üretim maliyeti, KV-cache mantığı, prefill vs decode, FP16/BF16/INT8/INT4, GPTQ/AWQ/GGUF, hız-bellek-doğruluk dengesi
  - Görselleştirme: KV-cache'ın token üretimi sırasında büyümesi animasyonu (2D canvas)

## 🔵 GÖRÜNTÜ (Bilgisayarla Görü)

- [x] **G1 — CNN Temelleri** (`cnn-temelleri`)
  - Kapsam: Piksel matrisi, evrişim (convolution) filtresi, stride/padding, pooling, feature map, klasik mimariler (LeNet, VGG, ResNet)
  - Görselleştirme: 2D convolution canlı simülasyonu — kernel'ın görüntü üzerinde kayması (2D canvas)

- [x] **G2 — Görüntü Sınıflandırma Modeli Yapımı** (`goruntu-siniflandirma`)
  - Kapsam: Veri setleri (MNIST/CIFAR-10), PyTorch ile CNN modeli, eğitim döngüsü, doğruluk/karışıklık matrisi, hatalı örnekleri inceleme
  - Görselleştirme: Canlı rakam çizme alanı → model sınıflandırma demo (2D canvas)

- [x] **G3 — Transfer Learning ve İnce Ayar** (`transfer-learning`)
  - Kapsam: Hazır modeller (ImageNet), özellik çıkarımı vs ince ayar, son katmanın değiştirilmesi, dondurma/çözme (freeze/unfreeze), ne zaman ne yapılmalı
  - Görselleştirme: Katman dondurma/çözme şeması (2D canvas)

- [x] **G4 — Nesne Tespiti (Object Detection)** (`nesne-tespiti`)
  - Kapsam: Sınıflandırma vs tespit, bounding box, IoU, tek-aşamalı vs iki-aşamalı tespitçiler, YOLO mimarisi, NMS
  - Görselleştirme: Bounding box çizimi ve NMS animasyonu (2D canvas)

- [x] **G5 — Tespit Modeli İnce Ayarı** (`tespit-ince-ayar`)
  - Kapsam: Etiketleme (labeling) araçları, veri seti formatları (YOLO/COCO), augmentasyon, metrikler (mAP), eğitim ve değerlendirme
  - Görselleştirme: Augmentasyon galerisi animasyonu (2D canvas)

- [x] **G6 — Diffusion Modelleri: Gürültüden Görüntü** (`diffusion-modelleri`)
  - Kapsam: İleri süreç (gürültü ekleme), geri süreç (denoising), UNet, zaman adımı (timestep), DDPM mantığı, denoising öğretmeni
  - Görselleştirme: 3D diffusion animasyonu — görüntünün gürültüden yavaş yavaş belirmesi (Three.js)

- [x] **G7 — Görüntü Düzenleme Modeli Yapımı (Inpainting)** (`goruntu-duzenleme`)
  - Kapsam: Maskeleme, InstructPix2Pix yaklaşımı, latent diffusion, metinle düzenleme, eğitim verisi hazırlama (orijinal/düzenli çiftler)
  - Görselleştirme: İnteraktif maskeleme + inpainting ön-sonrası örnekleri (2D canvas)

- [x] **G8 — Düzenleme Modeli İnce Ayarı** (`duzenleme-ince-ayar`)
  - Kapsam: DreamBooth/LoRA ile diffusion ince ayarı, kişiye/stile özel model, veri gereksinimleri, aşırı öğrenme riski
  - Görselleştirme: LoRA'nın diffusion katmanlarına eklenmesi şeması (2D canvas)

- [x] **G9 — Görüntü Modellerinde Quantization** (`goruntu-quantization`)
  - Kapsam: FP32→FP16→INT8 for vision, VAE/difüzyon quantization, kalite etkisi, TensorRT/ONNX ile hızlandırma
  - Görselleştirme: Quantization öncesi/sonrası kalite-hız karşılaştırma grafiği (2D canvas)

## 🩶 UZMAN (Optimizasyon ve Dağıtım)

- [x] **U1 — Model Quantization Derinlemesine** (`model-quantization`)
  - Kapsam: Kayan nokta aritmetiği (FP32/FP16/BF16), simetrik/asimetrik quantization, kalibrasyon, PTQ vs QAT, GGUF formatı (Q4_K_M, Q8_0...), doğruluk ölçümü
  - Görselleştirme: FP32→INT4 sayı dağılımı renk haritası (2D canvas)

- [x] **U2 — Pruning: Modeli Budamak** (`model-pruning`)
  - Kapsam: Yapısal/yapısal olmayan pruning, önem skoru, seyreklik (sparsity), iteratif pruning, yeniden eğitim
  - Görselleştirme: 3D ağırlık budama animasyonu — gereksiz bağlantıların silinmesi (Three.js)

- [x] **U3 — Knowledge Distillation** (`knowledge-distillation`)
  - Kapsam: Öğretmen-öğrenci mimarisi, yumuşak hedefler (soft targets), sıcaklık (temperature), küçük modelin büyük modele yaklaşması
  - Görselleştirme: Öğretmen→öğrenci bilgi aktarımı şeması (2D canvas)

- [x] **U4 — Edge ve Mobil AI** (`edge-mobil-ai`)
  - Kapsam: ONNX'a dönüştürme, TensorFlow Lite, CoreML kısaca, tarayıcıda çalıştırma (WebNN/WebGPU kavramsal), güç ve bellek kısıtları
  - Görselleştirme: Cihaz-bellek-hız karşılaştırma haritası (2D canvas)

- [x] **U5 — Etik ve Güvenlik** (`etik-guvenlik`)
  - Kapsam: Yanlılık (bias), halüsinasyon, veri gizliliği, kötüye kullanım senaryoları, sorumlu yapay zeka geliştirme ilkeleri, Türkiye ve dünyadan örnekler
  - Görselleştirme: Karar ağacı — risk değerlendirme akışı (2D canvas)

---

## Platform Altyapı İlerlemesi

- [x] Ortak eğitim tema CSS (`css/edu.css`)
- [x] Ana sayfa — eğitim kataloğu ve ilerleme özeti (`index.html`)
- [x] Topluluk sayfası ayrımı (`topluluk.html`)
- [x] Müfredat verisi (`js/edu/curriculum.js`)
- [x] İlerleme sistemi — localStorage (`js/edu/progress.js`)
- [x] GitHub Device Flow + Gist senkron (`js/edu/auth.js`)
- [x] Sınav motoru (`js/edu/quiz.js` + `dersler/<slug>/quiz.json`)
- [x] Ders şablon sistemi (`js/edu/lesson.js`)
- [x] Ortak görselleştirme yardımcıları (`js/edu/viz-helpers.js`)
