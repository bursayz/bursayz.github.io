// Quiz: Görüntü Düzenleme — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Inpainting (maskeleme ile düzenleme) nedir?",
        secenekler: [
            "Görüntüyü tamamen silmek",
            "Görüntünün seçili bölgesini modele yeniden oluşturtmak; maske dışı alanlar korunur",
            "Görüntüyü sıkıştırmak",
            "Sadece dosya boyutunu azaltmak"
        ],
        dogru: 1,
        aciklama: "Maske: beyaz=değiştir, siyah=koru. Model latent alanında hem orijinal resmi hem maskeyi görür; maskeli bölgeyi bağlama (komşu+piksel ve prompt) uygun yeniden üretir. Photoshop'un 'Content-Aware Fill'inin AI versiyonu."
    },
    {
        soru: "CFG (Classifier-Free Guidance) scale parametresi neyi kontrol eder?",
        secenekler: [
            "Resim boyutunu",
            "Modelin prompt'a ne kadar bağlı kalacağı — düşük değer serbest/yaratıcı, yüksek değer prompt'a sıkı sadakat",
            "Maske yoğunluğunu",
            "Adım sayısını"
        ],
        dogru: 1,
        aciklama: "CFG: sonuç = ε_kosulsuz + scale × (ε_kosullu - ε_kosulsuz). scale=1 prompt yok sayılır; scale=7.5 dengeli; scale=20+ prompt'a aşırı bağlı, 'rüya etkisi'. Inpainting'te kenar uyumu için ~7.5 önerilir."
    },
    {
        soru: "InstructPix2Pix ile Stable Diffusion Inpainting arasındaki temel fark nedir?",
        secenekler: [
            "Hiçbir fark yok",
            "Inpainting maske + prompt ister; InstructPix2Pix sadece doğal dil komutuyla ('arabaları kırmızı yap') çalışır, maske gerekmez",
            "Inpainting görüntü üretir, Pix2Pix metin üretir",
            "Pix2Pix daha hızlıdır her zaman"
        ],
        dogru: 1,
        aciklama: "SD Inpainting: maskeli bölgeyi prompt'a göre üretir (bölge seçimi). InstructPix2Pix: görüntünün tamamını talimata göre dönüştürür (global düzenleme). Verisi: LLM ile üretilen (talimat, önce, sonra) sentetik üçlülerle eğitilmiş."
    },
    {
        soru: "Inpainting'de model nasıl hem maskeli bölgeyi hem de orijinal görüntüyü aynı anda dikkate alır?",
        secenekler: [
            "Sadece maskeye bakar",
            "UNet girişi genişletilir: orijinal latent + maske + gürültü latent'i kanal ekseninde birleştirilir (concat); attention bu birleşimi işler",
            "Sadece prompt'a bakar",
            "İki ayrı model çalıştırılır"
        ],
        dogru: 1,
        aciklama: "SD Inpainting'in UNet'i 9 kanallı girdi alır (4 orijinal latent + 1 maske + 4 gürültülü latent). Attention katmanları bu bilgiyi harmanlayarak maskeli bölgeyi çevresiyle uyumlu üretir. İlk conv katmanı bunun için yeniden eğitilmiştir."
    },
    {
        soru: "guidance_scale (CFG) ve image_guidance_scale (InstructPix2Pix) neyi farklı kontrol eder?",
        secenekler: [
            "Aynı şeyi",
            "CFG: prompt sadakati; image_guidance: orijinal görüntüye sadakat — ikisi birlikte dengelenir",
            "Sadece hızı",
            "İlki kalite, ikincisi hız"
        ],
        dogru: 1,
        aciklama: "InstructPix2Pix'te iki yönlendirme var: (1) text CFG — 'prompta uy', (2) image CFG — 'orijinali koru'. Yüksek image guidance (1.5-2.0): sadece hedef bölge değişir, geri kalan korunur. Yüksek text CFG (7-9): prompt baskın olur."
    },
    {
        soru: "Düzenleme veri seti (orijinal, talimat, düzenlenmiş) üçlüsü nasıl üretilir?",
        secenekler: [
            "Manuel fotoğraf düzenleme",
            "LLM'den (GPT) talimatlar üretilir, diffusion modeliyle hedef görüntüler sentetik olarak sentezlenir — insan etiketlemesi gerekmez",
            "Sadece stok fotoğraflar kullanılır",
            "İnternetten toplanır"
        ],
        dogru: 1,
        aciklama: "InstructPix2Pix makalesinin dahiyene fikri: veri seti kendisi AI tarafından üretildi. GPT-3 ile ~454K düzenleme talimatı üretildi, sonra SD'nin kendisiyle 'öncesi→sonrası' çiftleri sentezlendi. 'Öğretmek için model kullan' paradigması — SFT veri üretimiyle aynı mantık."
    },
    {
        soru: "Inpainting sonucundaki görünür 'dikiş' (seam) kenarlarından kaçınmak için ne yapılır?",
        secenekler: [
            "Daha büyük resim kullanmak",
            "Masked bölgeyi yeniden üretirken kenarları yumuşatmak (feathering/blur) ve/veya latent blending (RePaint yöntemi)",
            "Sadece metin uzunluğunu artırmak",
            "Maskeyi tamamen kaldırmak"
        ],
        dogru: 1,
        aciklama: "RePaint (Lugmayr et al., 2022) ve latent harmonization teknikleri maskesi kenarındaki pikselleri yumuşak geçişle harmanlar. Basit diffusion'da sert maske kenarı görünür çizgi bırakabilir; gaussian blur'lu maske (feather) bunu azaltır."
    },
    {
        soru: "Diffusion inpainting'in klasik Content-Aware Fill'den üstünlüğü nedir?",
        secenekler: [
            "Daha hızlı",
            "Bağlamı sadece piksel istatistiğiyle değil, öğrenilmiş derin semantik bilgiyle anlar — 'bulutlu gökyüzünü temizle' gibi soyut komutları kavrar",
            "Her zaman daha ucuz",
            "Maskesiz çalışır"
        ],
        dogru: 1,
        aciklama: "Content-Aware Fill (Photoshop) doku benzerliği arar — soyut kavram yok. Diffusion, milyonlarca resimden 'gökyüzü nasıl görünür', 'orman kenarı nasıldır' öğrenmiştir. Prompt ile 'buraya palmiye ağacı ekle' gibi kavramsal düzenlemeler yapabilir."
    },
    {
        soru: "Inpainting sonrası orijinal resimle uyum sağlamak için hangisi yapılır?",
        secenekler: [
            "Resmi tekrar eğitmek",
            "Maske dışı bölgeyi her adımda orijinal latent ile yeniden yazmak veya (post-process) poisson blending uygulamak",
            "Hiçbir şey — doğal uyum sağlanır",
            "Sadece crop yapmak"
        ],
        dogru: 1,
        aciklama: "Diffusion her adımda tüm görüntüyü etkiler; korunması gereken bölge drift eder. Çözümler: (1) her adımda mask-dışı alanı orijinal x_t ile overwrite, (2) son çıktıda Poisson blending ile sınırları harmanla. Diffusers'daki pipeline bunları dahili yapar."
    },
    {
        soru: "Kendi inpainting modelinizi eğitmek için hangi girdilere ihtiyacınız var?",
        secenekler: [
            "Sadece resimler",
            "(Orijinal resim, maske, prompt) üçlüleri + bir VAE encoder (latent dönüşümü) + fine-tuning altyapısı (LoRA ile SD1.5 üzerine mümkün)",
            "Sadece metin",
            "3D modeller"
        ],
        dogru: 1,
        aciklama: "Inpainting fine-tuningde UNet girişi genişletilir (4→9 kanal), ilk conv katmanı yeniden başlatılır veya mevcut ağırlıklar korunarak genişletilir. LoRA ile tüketici GPU'sunda bile mümkündür (L8/G8 dersleri). Veri: (resim, mask, prompt) üçlüleri."
    }
];
