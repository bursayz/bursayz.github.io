// Quiz: Düzenleme İnce Ayarı — 9 soru
window.QUIZ_DATA = [
    {
        soru: "DreamBooth'un temel amacı nedir?",
        secenekler: [
            "Modeli daha hızlı yapmak",
            "3-20 fotoğrafla belirli bir nesne/kişi/stili öğretmek — 'genel kedi'den 'benim kedim' çıktısına",
            "Metin anlamayı geliştirmek",
            "Quantization yapmak"
        ],
        dogru: 1,
        aciklama: "DreamBooth (Google, 2023 SD uygulaması) öznel kavramları öğretir. LoRA adaptörü 16 MB — tüm model yerine sadece attention projeksiyonlarına küçük 'yama' eklenir. Üretimde trigger word ('sks kedi') kavramı çağrıştırır."
    },
    {
        soru: "Tetikleyici token olarak 'kedi' yerine 'sks' kullanmanın nedeni nedir?",
        secenekler: [
            "Daha kısa olduğu için",
            "Nadir token: modelin var olan 'kedi' bilgisini ezmeden sizin nesnenize özel yeni bir semantik yuva açar — overfitting önlenir",
            "Türkçe karakter desteği için",
            "Daha hızlı öğrenme"
        ],
        dogru: 1,
        aciklama: "'Kedi' kelimesi modelde geniş bilgi taşır; onu kullanarak eğitmek tüm kedilerin sizin kediniz gibi görünmesine yol açabilir (örneğin diğer kedileri de 'sizin kedi' yapmaya başlar). Nadir token bu 'genel kavramı kirletme' riskini önler."
    },
    {
        soru: "LoRA eğitimi sırasında 'class images' (diğer kedilerin resimleri) eklemenin nedeni nedir?",
        secenekler: [
            "Daha hızlı eğitim",
            "Prior preservation loss: modelin genel 'kedi' bilgisini korumak — sizin nesnenizle diğerlerini karıştırmasın",
            "Veri çeşitliliği",
            "Güvenlik"
        ],
        dogru: 1,
        aciklama: "Öncelik koruma: rastgele kedi resimleriyle ek kayıp terimi, 'sks' tetikleyicisini sizin nesnenize bağlarken genel kedi bilgisini sabit tutar. Modelin cinsiyet/renk yanlış öğrenmesini önler."
    },
    {
        soru: "Kendi yüzünüzü öğretmek için kaç fotoğraf önerilir?",
        secenekler: [
            "1 resim yeterli",
            "10-20 resim, farklı ifade/ışık/açılarla; arka plan çeşitliliği kritiktir (aynı arka plan = model onu yüzünüzün parçası zanneder)",
            "1000 resim",
            "Sadece videolar"
        ],
        dogru: 1,
        aciklama: "Yüz daha karmaşık/ince ayrıntılı — 10-20 resim. Kural: 'konu sabit, arka plan değişken'. Aynı yatak odası arka planlı 15 resim → model odayı yüzünüzün parçası sanır. Farklı dış mekan/iş/ ev ortamları etiketler modelin gerçek yüz özelliklerini izole etmesine yardım eder."
    },
    {
        soru: "Diffusion'daki LoRA, LLM'dekine göre hangi katmanları hedefler?",
        secenekler: [
            "Sadece VAE",
            "UNet'in attention katmanlarındaki to_q, to_k, to_v, to_out projeksiyonları — LLM'de q/k/v/o aynı mantıkla eşler",
            "Sadece conv katmanları",
            "Sadece time embedding"
        ],
        dogru: 1,
        aciklama: "Metin-görüntü hizalaması cross-attention'da gerçekleşir: to_q (metin Query), to_k/to_v (görsel Key/Value). LoRA bunları hedefleyerek metin→görsel bağlantıyı sizin nesnenize göre ayarlar. LLM dersindeki q_proj/k_proj ile aynı matematik, farklı veri türü."
    },
    {
        soru: "DreamBooth için kötü veri seti özelliği nedir?",
        secenekler: [
            "Farklı arka planlar",
            "Konunun benzer poz/boyutta, aynı arka planda, aynı ışıkta olması — model genel özellikleri arka plana çevirir",
            "Farklı açılar",
            "Yüksek çözünürlük"
        ],
        dogru: 1,
        aciklama: "Tekrarlanan arka plan/poz = model onu konunun parçası sanır. 'Konu sabit, her şey değişken' kuralı: açı değişsin, ışık değişsin, arka plan değişsin. Böylece model konunun özünü (yüz geometrisi, nesne dokusu) izole eder."
    },
    {
        soru: "r=8 LoRA rank'ı diffusion için neden genellikle yeterlidir?",
        secenekler: [
            "Diffusion daha basittir",
            "Stil/nesne kavramları dil kadar karmaşık değildir — düşük rank hem bellekten tasarruf sağlar (tek GPU'da eğitilebilir) hem overfitting'i sınırlar",
            "Sadece rank=8 desteklenir",
            "Her zaman rank=64 gerekir"
        ],
        dogru: 1,
        aciklama: "LLM'de karmaşık mantık görevleri r=32-64 gerektirirken görsel konseptler (renk paleti, stil, nesne kimliği) düşük rankda ifade edilebilir. r=8 ile 70B SDXL bile tek tüketici GPU'sunda (12GB) eğitilebilir — QLoRA avantajının diffusion karşılığıdır."
    },
    {
        soru: "Civitai'daki LoRA adaptörlerini kendi modelinize yüklemenin tek avantajı nedir?",
        secenekler: [
            "Ücretsiz olması",
            "Eğitim olmadan doğrudan inference — topluluk tarafından eğitilmiş binlerce stil/nesne adaptörü tek dosya olarak (safetensors) yüklenir",
            "Daha hızlı inference",
            "Daha yüksek kalite"
        ],
        dogru: 1,
        aciklama: "LoRA bir 'plugin' sistemidir: temel SD/SDXL + ayrı .safetensors dosyası. Eğitim haftalar yerine 0 saniye sürüyor. Dezavantajı: başkasının veri kalitesine bağımlı olmak, telif etiği ve stil tutarlılığı sorunları."
    },
    {
        soru: "Inpainting (G7) ve DreamBooth LoRA (G8) arasındaki görev farkı nedir?",
        secenekler: [
            "Aynı şey, farklı isim",
            "Inpainting: 'var olan resimde bölgeyi değiştir'; DreamBooth LoRA: 'yeni metin komutlarından sizin nesnenizi üret' — farklı senaryolar",
            "Inpainting her zaman daha iyi",
            "LoRA maske kullanır"
        ],
        dogru: 1,
        aciklama: "Inpainting: mevcut fotoğrafın maskelediği bölgeyi bağlama uygun doldur. DreamBooth: sıfırdan üretimde sizin nesnenizi kullan ('sks kedi Ay'da'). G7 üretimin içine dahil, G8 üretimin temelini sizin nesnenizle değiştirir. Çoğu kullanım iki teknik kombinasyonu gerektirir."
    }
];
