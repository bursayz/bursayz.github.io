// Quiz: Sıfırdan GPT — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Eğitimde hedef dizisi y = x'in 1 karakter/token sağa kaydırılmış halidir. Bu neyi sağlar?",
        secenekler: [
            "Veri setini ikiye katlar",
            "Her pozisyonda modelin 'bir sonraki tokenı' tahmin etmesini — tüm pozisyonlardan tek geçişte öğrenir",
            "Modeli hızlandırır",
            "Bağlam penceresini genişletir"
        ],
        dogru: 1,
        aciklama: "x = [a,b,c] → y = [b,c,d]. Pozisyon 0'da model 'a'dan 'b'yi, pozisyon 1'de 'ab'den 'c'yi... tahmin etmeyi öğrenir. Tek ileri geçişle T adet eğitim örneği elde edilir. Çok verimlidir."
    },
    {
        soru: "Eğitimsiz (rastgele ağırlıklı) bir modelin başlangıç kaybı yaklaşık ln(vocab_size) ≈ 4.17 (65 karakterlik vocab için) civarındadır. Neden?",
        secenekler: [
            "Rastgele ağırlıklar her zaman 4.17 kayıp üretir",
            "Rastgele model her tokena eşit olasılık (1/65) verir → cross entropy = -ln(1/65) = ln(65) ≈ 4.17",
            "Kayıp her zaman 0'dan başlar",
            "Vocab boyutu kaybı etkilemez"
        ],
        dogru: 1,
        aciklama: "Rastgele model: uniform olasılık dağılımı p = 1/vocab_size. Cross entropy = -ln(p) = ln(65) ≈ 4.17. Eğitim sonrası kayıp ~1.0-1.5'a düşerse model ciddi öğrenmiş demektir. Kayıp bu başlangıç değerinden düşmüyorsa bir hata var (LR, veri, kod)."
    },
    {
        soru: "model.uret() içinde torch.multinomial(probs, 1) ne yapar?",
        secenekler: [
            "En yüksek olasılıklı tokenı seçer (greedy)",
            "Olasılık dağılımına göre rastgele örnekleme yapar — yüksek olasılıklı token daha sık seçilir ama garanti değildir",
            "Tüm tokenları sıralar",
            "İlk tokenı alır"
        ],
        dogru: 1,
        aciklama: "multinomial, olasılığa oranlı rastgele seçim yapar: %70 olasılıklı token %70 ihtimalle seçilir. Bu çeşitlilik üretir — aynı prompt farklı çıktılar verir. Greedy (argmax) her zaman en yükseği seçer; tekdüze olur."
    },
    {
        soru: "temperature = 0.1 ile temperature = 2.0 arasındaki fark nedir?",
        secenekler: [
            "Değişiklik olmaz",
            "Düşük T: dağılım keskinleşir (en olası token neredeyse kesin); yüksek T: dağılım yumuşar (düşük olasılıklı tokenlar da şans bulur)",
            "Yüksek T daha tutarlı metin üretir",
            "T sadece eğitimde kullanılır"
        ],
        dogru: 1,
        aciklama: "logits / T: T küçükse logit farkları büyür → softmax keskinleşir → %99 tek tokenda toplanır (tutarlı, sıkıcı). T büyükse dağılım düzleşir → yaratıcı ama saçmalama riski artar. T=0.7-1.0 tipik dengedir."
    },
    {
        soru: "top_k=50 örneklemesi ne yapar?",
        secenekler: [
            "50 token üretir",
            "Sadece olasılığı en yüksek 50 token içinden örnekleme yapar — uzun kuyruktaki saçma adayları eler",
            "İlk 50 adımı greedy yapar",
            "Vocab'ı 50'ye indirir"
        ],
        dogru: 1,
        aciklama: "Dağılımın uzun kuyruğunda (top 50 dışı) genellikle anlamsız tokenlar bulunur. top_k bunları -inf yaparak tamamen eler, sonra normalize edilmiş top 50 arasından örnekleme yapar. Yaratıcılık + tutarlılık dengesi sağlar."
    },
    {
        soru: "block_size=64 olan modelde 500 karakterlik metin üretirken idx[:, -block_size:] neden kullanılır?",
        secenekler: [
            "Hız için",
            "Model sadece son 64 karaktere bakabilir (bağlam penceresi) — daha eskisini beslemek hem gereksiz hem boyut hatası verir",
            "Eski tokenlar otomatik silinir",
            "Güvenlik için"
        ],
        dogru: 1,
        aciklama: "pos_emb tablosu sadece 64 pozisyon içerir; 500 token beslenirse pozisyon 200 için embedding yok → hata. Çözüm: sadece son 64'ü besle. Bu KV-cache olmadan çalışan basit sürümde her adımda tüm bağlam yeniden hesaplanır (yavaş!)."
    },
    {
        soru: "Bu dersteki MiniGPT 'karakter seviyesinde' çalışıyor. Gerçek GPT'lerden (token seviyesi) farkı nedir?",
        secenekler: [
            "Fark yok",
            "Karakter vocab'ı küçük (~100) ama diziler uzun; BPE tokenları vocab'ı büyük (~50K) ama diziler kısa — mimari aynı, granularity farklı",
            "Karakter seviyesi transformer kullanmaz",
            "Token seviyesinde eğitim gerekmez"
        ],
        dogru: 1,
        aciklama: "Karakter: 'merhaba' = 7 eleman. BPE: 'merhaba' = 1-2 token. Aynı metin daha kısa dizide işlenir → attention maliyeti (T²) düşer. Karakter seviyesi öğretim için idealdir (küçük, basit); üretim modelleri BPE kullanır."
    },
    {
        soru: "AdamW optimizer'ı SGD'den nasıl ayrışır?",
        secenekler: [
            "Sadece ismi farklı",
            "Her parametreye adapif öğrenme oranı uygular (momentum + RMSProp kombinasyonu) ve weight decay'i gradyandan ayırır",
            "Gradyan hesaplamaz",
            "Sadece görüntü modelleri içindir"
        ],
        dogru: 1,
        aciklama: "Adam: her parametrenin geçmiş gradyan ortalamasını ve varyansını takip eder; nadiren güncellenen parametrelerde büyük, sık güncellenenlerde küçük adım atar. W varyantı weight decay'i doğru uygular. Transformer eğitiminde fiilen standarttır (lr=3e-4, cosine decay)."
    },
    {
        soru: "torch.no_grad() ile üretim fonksiyonunun sarılmasının nedeni nedir?",
        secenekler: [
            "Üretim daha hızlı olsun diye (gradyan grafiği kurulmaz, bellek ve hesap tasarrufu)",
            "Üretim sırasında model değişmesin diye",
            "Zorunlu Python sözdizimi",
            "Gradyanları yok eder"
        ],
        dogru: 0,
        aciklama: "Üretimde backward() çağırmayacağız — gradyan grafiğinin kurulması gereksiz bellek ve hesap harcar. no_grad() bunu devre dışı bırakır. Modern alternatifi: torch.inference_mode(). Eğitimde ASLA kullanmayın."
    },
    {
        soru: "Karpathy'nin nanoGPT yaklaşımının pedagojik olarak kritik yanı nedir?",
        secenekler: [
            "En hızlı GPT implementasyonu olması",
            "GPT'nin tamamının ~300 satırda, dış kütüphanesiz yazılabilmesi — 'sihir yok, sadece basit parçaların birleşimi' mesajı",
            "GPU gerektirmemesi",
            "Tek satırda kurulması"
        ],
        dogru: 1,
        aciklama: "nanoGPT kanıtlar: GPT-2 = embedding + transformer blokları + lineer kafa + eğitim döngüsü. Milyar dolarlık modeller de aynı parçalardan oluşur; fark ölçek ve mühendisliktir. Bu dersin amacı da bu demistifikasyonu sağlamaktır."
    }
];
