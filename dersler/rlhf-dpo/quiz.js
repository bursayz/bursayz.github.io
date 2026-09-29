// Quiz: RLHF vs DPO — 10 soru
window.QUIZ_DATA = [
    {
        soru: "RLHF (Reinforcement Learning from Human Feedback) neyi SFT'nin ötesine taşır?",
        secenekler: [
            "Modelin boyutunu",
            "'Doğru cevabı taklit etme'den 'insanların hangi cevabı tercih ettiğini öğrenme'ye — relatif kalite anlayışı",
            "Token sayısını",
            "Eğitim hızını"
        ],
        dogru: 1,
        aciklama: "SFT: tek doğru cevap örneğini kopyala. RLHF: aynı sorunun birden çok iyi cevabı arasında insan tercihini öğren (yardımcılık, netlik, güvenlik). 'İyi' görelidir — RLHF bu göreceliği yakalar."
    },
    {
        soru: "RLHF'ın üç aşaması doğru sırayla nedir?",
        secenekler: [
            "PPO eğitimi → Ödül modeli → Tercih verisi",
            "İnsan tercih verisi topla → Ödül modeli eğit → PPO ile LLM'i ödül modelini maksimize edecek şekilde eğit",
            "Ödül modeli → tercih verisi → SFT",
            "SFT → DPO → Inference"
        ],
        dogru: 1,
        aciklama: "Sıra kritiktir: (1) Aynı prompta 2 cevap, insan seçer → tercih veri seti. (2) Bu tercihleri tahmin eden ödül modeli (skorlayıcı) eğitilir. (3) LLM (politika), ödül modelinden max skor alacak şekilde PPO ile güncellenir."
    },
    {
        soru: "Bradley-Terry kaybı kullanan ödül modeli neyi optimize eder?",
        secenekler: [
            "Cevapların uzunluğunu",
            "Tercih edilen cevabın skorunun, reddedilenden yüksek olmasını — r(chosen) > r(rejected)",
            "Modelin hızını",
            "Eğitim verisinin boyutunu"
        ],
        dogru: 1,
        aciklama: "kayip = -log(σ(r_chosen - r_rejected)): σ (sigmoid) iki skorun farkını olasılığa çevirir. Skor farkı büyükse kayıp küçük. Model, insanın hangi cevabı seçtiğini tahmin etmeyi öğrenir — bu 'insan zevki modeli'dir."
    },
    {
        soru: "PPO eğitiminde KL cezası (beta × KL(politika, referans)) neyi sağlar?",
        secenekler: [
            "Modelin daha hızlı çalışmasını",
            "Modelin SFT modelinden çok uzaklaşmasını (ve dolayısıyla anlamsız metin üretmesini) önler — ödül avcılığı (reward hacking) sınırı",
            "Gradyanları kırpmayı",
            "Veri temizlemeyi"
        ],
        dogru: 1,
        aciklama: "Ödül modeli de bir modeldir — 'hile' öğrenilebilir: saçma ama yüksek skor alan cevaplar. KL cezası politikayı SFT modeline yakın tutar. beta çok yüksekse öğrenme durur, çok düşükse model saçmalar. Dengesi zordur."
    },
    {
        soru: "DPO'nun RLHF'e göre en büyük pratik avantajı nedir?",
        secenekler: [
            "Her zaman daha iyi sonuç",
            "Ayrı ödül modeli ve karmaşık RL döngüsü gerektirmemesi — tercih verisinden doğrudan LLM güncellenir; stabil, ucuz, az bellek",
            "Daha fazla veri gerektirmesi",
            "Sadece İngilizce desteklemesi"
        ],
        dogru: 1,
        aciklama: "DPO tercih verisini doğrudan kapalı-form kayıp olarak kullanır: ödül modeli → PPO zincirini atlar. 3 modeli (politika, referans, ödül) GPU'da tutmak yerine 1-2 model yeter. Küçük ekipler için varsayılan seçimdir."
    },
    {
        soru: "DPO veri setindeki 'chosen' ve 'rejected' alanları neyi temsil eder?",
        secenekler: [
            "İyi ve kötü API yanıtları",
            "Aynı prompta iki cevap — chosen insan tarafından tercih edilen, rejected edilmemiş olan",
            "Doğru ve yanlış token dizileri",
            "Eğitim ve test örnekleri"
        ],
        dogru: 1,
        aciklama: "DPO kaybı: -log(σ(β·log πθ(chosen)/πref(chosen) - β·log πθ(rejected)/πref(rejected))) — modelin chosen'a rejected'dan yüksek olasılık vermesini, referansa göre ayarlayarak öğrenir. Tercih çifti = öğretim birimi."
    },
    {
        soru: "'Reward hacking' (ödül avcılığı) nedir?",
        secenekler: [
            "Ödül modelini hacklemek için saldırı",
            "Modelin ödül modelinin zayıflıklarını öğrenerek gerçekten iyi olmadan yüksek skor alacak cevaplar üretmesi",
            "Eğitim süresini kısaltmak",
            "API maliyetlerini azaltmak"
        ],
        dogru: 1,
        aciklama: "Örnek: ödül modeli 'uzun cevap = iyi cevap' korelasyonunu öğrenirse, politika sonsuz uzunlukta ama anlamsız cevaplar üretebilir. Goodhart Yasası: 'ölçü hedefe dönüşünce iyi ölçü olmaktan çıkar.' KL cezası bunu sınırlar."
    },
    {
        soru: "RLHF ile DPO arasındaki temel teknik fark nedir?",
        secenekler: [
            "Hiçbir fark, aynı algoritmalar",
            "RLHF online'dır (model kendi cevaplarını üretip puanlanır); DPO offline'dır (hazır tercih çiftlerinden doğrudan öğrenir)",
            "DPO sadece görüntü için çalışır",
            "RLHF daha az veri gerektirir"
        ],
        dogru: 1,
        aciklama: "RLHF online: her adımda model cevap üretir → ödül modeli skorlar → politika güncellenir (modelin üretimi beslenir). DPO offline: hazır (chosen, rejected) çiftleri üzerinden sınıflandırma-benzeri kapalı kayıp. DPO uygulaması çok daha basit, RLHF teorik ustunluk potansiyeli taşır."
    },
    {
        soru: "ChatGPT'nin 'kibar, güvenli ve yardımsever' davranışı hangi aşamada öğretilir?",
        secenekler: [
            "Pretraining (ön eğitim)",
            "RLHF/DPO hizalama aşaması (alignment)",
            "Tokenization",
            "Quantization"
        ],
        dogru: 1,
        aciklama: "Pretraining dünya bilgisini öğretir, SFT talimatları takip etmeyi öğretir, RLHF/DPO 'Nasıl cevap verilmeli?' — naziklik, zararsızlık, detaylılık gibi — tercihini öğretir. 'Zehirli/hakaret içeren' ve 'yardımcı' cevaplar arasındaki tercihler burada kodlanır."
    },
    {
        soru: "DPO'yu pratikte Hugging Face ile kullanmak için hangi sınıf kullanılır?",
        secenekler: [
            "SFTTrainer",
            "DPOTrainer (trl kütüphanesinden); veri seti 'prompt', 'chosen', 'rejected' sütunları içerir",
            "RewardTrainer",
            "PPOTrainer"
        ],
        dogru: 1,
        aciklama: "from trl import DPOTrainer — veri seti: {'prompt', 'chosen', 'rejected'} sütunlarıyla. beta parametresi referans sapmasını kontrol eder. ref_model=model olmadan (LoRA kullanıyorsanız) otomatik referans üretilir. LoRA+DPO tek GPU'da 7B hizalama yapar."
    }
];
