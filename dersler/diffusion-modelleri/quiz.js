// Quiz: Diffusion Modelleri — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Diffusion modelinin eğitim hedefi nedir?",
        secenekler: [
            "Görüntüyü sıkıştırmak",
            "Her gürültü adımında (t), eklenmiş gürültüyü (ε) tahmin etmek — 'bu gürültülü resimde, o adımda hangi rastgelelik vardı?'",
            "Görüntüyü metne çevirmek",
            "Nesneleri tespit etmek"
        ],
        dogru: 1,
        aciklama: "Eğitim döngüsü: (1) rastgele t seç, (2) x0'a ε gürültü ekle → x_t, (3) model(x_t, t) ε tahmin etsin, (4) MSE kaybı. Basit görünse de bu oyunu oynayan model, gürültüden resim 'sökmeyi' öğrenir — çünkü önce gürültünün ne olduğunu tanır."
    },
    {
        soru: "ᾱ_t (alpha_cumprod) neyi temsil eder?",
        secenekler: [
            "Öğrenme oranını",
            "Adım 0'dan t'ye kadar kalan sinyal oranı — ᾱ_t →0'da resim saf gürültüdür",
            "Batch boyutunu",
            "Modelin doğruluğunu"
        ],
        dogru: 1,
        aciklama: "ᾱ_t = ∏ᵢ₌₁ᵗ (1 - βᵢ). Küçük β'lar birikimli olarak görüntüyü yok eder. Formül: x_t = √ᾱ_t·x0 + √(1-ᾱ_t)·ε. ᾱ=1'de resim tamamen korunur, ᾱ≈0'da saf gürültü. 'Noise schedule' (β dizisi) bu süreci programlar."
    },
    {
        soru: "Üretim (sampling) sırasında model nasıl kullanılır?",
        secenekler: [
            "Tek geçişte resim üretir",
            "Saf gürültüden başlayarak t=999→0'a her adımda gürültüyü tahmin edip çıkarır — 1000 ileri geçişle 1 resim",
            "Sadece prefill aşamasında",
            "Eğitim kodunu tekrar çalıştırır"
        ],
        dogru: 1,
        aciklama: "Inference: x_1000=randn → model(x_t, t) → ε tahmin et → x_{t-1} hesapla → tekrar. 1000 adım! DDIM veya DPM-Solver gibi hızlandırmalar bunu 20-50 adıma indirir. Her adım UNet'in tam forward pass'ıdır — bu yüzden diffusion üretimi GAN'a göre yavaştır."
    },
    {
        soru: "UNet'in 'U' şekli (downsampling → bottleneck → upsampling + skip) neyi sağlar?",
        secenekler: [
            "Sadece estetik mimari",
            "Alt yol 'neyin var olduğunu' (semantik) öğrenirken skip bağlantıları 'nerede olduğunu' (uzamsal detay) korur — her ikisi birlikte gürültü tahmini için gerekli",
            "Daha az parametre",
            "Gradyanları dengeler"
        ],
        dogru: 1,
        aciklama: "64×64 → 8×8: semantik öğrenilir (bu bir kedi). Ama detaylar kaybolur. Skip connection'lar (Ronneberger, 2015) her seviyedeki feature map'i doğrudan yukarı yolun karşılık gelen katmanına ekler → 'kedi' bilgisiyle 'tüy detayı' birleşir."
    },
    {
        soru: "Latent Diffusion (Stable Diffusion) neden piksel uzayında değil latent uzayında çalışır?",
        secenekler: [
            "Piksel uzayında çalışamaz",
            "512×512 piksel uzayında 1000 adım hesaplama pahalıdır; VAE ile 64×64 latent'e sıkıştırınca hesaplama ~50 kat azalır, kalite korunur",
            "Latent uzay daha renkli",
            "Piksellerde güvenlik riski"
        ],
        dogru: 1,
        aciklama: "VAE encoder: 512×512×3 → 64×64×4 latent (perceptual ~eşdeğer). Diffusion latent'te çalışır: 262K piksel yerine 16K. Decode geri büyütür. Bu yüzden Stable Diffusion tüketici GPU'sunda çalışabilir. VAE kalitesi çıktı kalitesini sınırlar (renk kaymaları VAE'den gelir)."
    },
    {
        soru: "CLIP metin embedding'inin diffusion'a cross-attention ile entegrasyonunun amacı nedir?",
        secenekler: [
            "Metni sınıflandırmak",
            "Metindeki konseptlerle görsel özellikler arasında ilişki kurmak — 'kedi kumsalda' promptunun dikkat ağırlıkları kedi ve kumsal bölgelerine odaklanır",
            "Metin tokenizasyonu",
            "CLIP modeli eğitmek"
        ],
        dogru: 1,
        aciklama: "CLIP: metin ve görüntüyü aynı vektör uzayına kodlar. Stable Diffusion'da metin embedding'i UNet'in her attention katmanına cross-attention Q olarak beslenir; K,V görsel laten özelliklerinden gelir. Sonuç: prompt'un hangi bölgesinin hangi görsel bölgeyi etkileyeceği öğrenilir. LLM L3-L4 dersindeki aynı attention matematiği!"
    },
    {
        soru: "DDPM makalesinin (Ho et al., 2020) GAN'a göre temel avantajı nedir?",
        secenekler: [
            "Daha hızlı üretim",
            "Eğitim kararlılığı — GAN adversarial denge gerektirir (mode collapse riski), diffusion ise basit regression (gürültu tahmini) eğitir",
            "Daha küçük model",
            "Metin desteği"
        ],
        dogru: 1,
        aciklama: "GAN jenerator-discriminator dengesi gerektirir; mode collapse (tek tip çıktı) yaygın sorundur. Diffusion: sabit, deterministik eğitim hedefi (MSE) + olasılık tabanlı sağlamlık. Denetlenebilirlik ve çeşitlilik (diversity) GAN'dan üstün. 2020'den sonra görüntü üretiminin standartı olmasının nedeni bu."
    },
    {
        soru: "Zaman embedding'i (t embedding) UNet'e nasıl eklenir?",
        secenekler: [
            "Son katmana eklenir",
            "Sinusoidal pozisyon encoding ile hesaplanır, her resnet bloğuna kanal ölçekleme (FiLM) olarak eklenir — model 'hangi adımdayım?' bilgisini her katmanda kullanır",
            "Sadece girişte bir kez",
            "Metinle birlikte verilir"
        ],
        dogru: 1,
        aciklama: "Model aynı mimariyi t=0 (az gürültü) ve t=999 (çok gürültü) için kullanır; davranış t'ye göre değişmelidir. Transformer'daki pozisyon encoding gibi (L2!) sinusoidal vektör hesaplanır, her blokta FiLM (scale+shift) ile özelliklere enjekte edilir."
    },
    {
        soru: "DDIM veya DPM-Solver kullanmanın nedeni nedir?",
        secenekler: [
            "Daha iyi görüntü kalitesi",
            "Stokastik olmayan yörünge ile 1000 adımı 20-50 adıma indirerek üretimi ~20-50x hızlandırmak (aynı modelle)",
            "Metin anlamayı geliştirmek",
            "Eğitim maliyetini azaltmak"
        ],
        dogru: 1,
        aciklama: "DDPM'nin 1000 adımı çoğu zaman gereksizdir; DDIM deterministik varyantı 50 adımda neredeyse aynı kalite verir. DPM-Solver++ daha da agresiftir. Bu 'sampler'lar modelin kendisini değiştirmez, sadece üretim yörüngesini optimize eder."
    },
    {
        soru: "Diffusion modeli 'bir sonraki token' oyunu yerine hangi tahmin oyununu oynar?",
        secenekler: [
            "Aynı oyun",
            "'Bu gürültülü girdide hangi rastgele gürültü vardı?' (epsilon tahmini) veya eşdeğer x0 tahmini",
            "Sonraki kareyi tahmin",
            "Metin embedding'i tahmin etme"
        ],
        dogru: 1,
        aciklama: "İki görev de olasılıksal tahmin oyunudur ama alan farklı: LLM'de bir sonraki token, diffusion'da gürültü bileşeni. Model 'ben bunu nasıl temizlerim?' öğrenir — eğitim hedefi epsilon (v-prediction varyantları daha stabildir)."
    }
];
