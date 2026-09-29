// Quiz: İnce Ayar / SFT — 10 soru
window.QUIZ_DATA = [
    {
        soru: "SFT (Supervised Fine-Tuning) ile pretraining arasındaki fark nedir?",
        secenekler: [
            "Hiçbir fark yok",
            "Pretraining etiketsiz devasa veriyle dil yeteneği kazandırır; SFT etiketli (soru-cevap) küçük veriyle davranış biçimi öğretir",
            "SFT daha fazla veri gerektirir",
            "SFT attention kullanmaz"
        ],
        dogru: 1,
        aciklama: "Pretraining 13T token ham metin; SFT 1K-100K özenli (instruction, response) çifti. İlki 'dil bilgisini' kazandırır, ikincisi 'terbiyeyi'. SFT LR de ~10 kat küçüktür (2e-5 civarı) — modelin mevcut bilgisini bozmadan davranışı ayarlamak için."
    },
    {
        soru: "Loss maskesi ile kullanıcı/sistem tokenlarını -100 yapmanın amacı nedir?",
        secenekler: [
            "Modeli hızlandırmak",
            "Modelin sadece ASİSTAN cevabını üretmeyi öğrenmesi—soruyu ezberlemesinin kayıp üzerinde ceza yaratmaması",
            "Token sayısını azaltmak",
            "Sistem mesajını gizlemek"
        ],
        dogru: 1,
        aciklama: "-100 = ignore_index: CrossEntropyLoss bu pozisyonları hesaba katmaz. Böylece model kullanıcı metnini 'üretmeyi' öğrenmez; sadece cevap üretimi optimize edilir. Maskeleme olmadan model prompt'u da sürdürmeye çalışır."
    },
    {
        soru: "Chat template'in görevi nedir?",
        secenekler: [
            "Metni HTML'e çevirmek",
            "Sistem/kullanıcı/asistan mesajlarını modelin anladığı özel token sınırlarıyla tek diziye çevirmek; <|eot_id|> gibi tokenlar 'sıra bitti'yi öğretir",
            "Mesajları şifrelemek",
            "Prompt'u kısaltmak"
        ],
        dogru: 1,
        aciklama: "Her model ailesinin kendi template'i vardır (Llama-3 <|start_header_id|>... kullanır, Qwen farklı). tokenizer.apply_chat_template() doğru formatı otomatik üretir. Yanlış template = modelin konuşma sınırlarını öğrenememesi = sonsuz üretim veya anlamsız kesinti."
    },
    {
        soru: "Hangi durumda fine-tuning yerine başka yöntem tercih edilmelidir?",
        secenekler: [
            "Tutarlı JSON çıktısı isteniyorsa",
            "Model güncel şirket politikalarını bilmiyorsa → RAG (bilgi eksikliği fine-tuning ile çözülmez)",
            "Alan jargonu gerekiyorsa",
            "Kısa prompt ile maliyet düşürülmek isteniyorsa"
        ],
        dogru: 1,
        aciklama: "Bilgi problemini fine-tuning çözmez: model eğitim verisinde olmayan gerçekleri SFT ile güvenilir öğrenmez; halüsinasyon üretir. RAG (belge arama + prompt'a ekleme) doğru çözümdür. Fine-tuning davranış/format içindir, bilgi içindir değil."
    },
    {
        soru: "Katastrofik unutma (catastrophic forgetting) nedir?",
        secenekler: [
            "Modelin eski eğitim verilerini diskten silmesi",
            "SFT sırasında modelin önceki genel yeteneklerini (matematik, çeviri vb.) kısmen kaybetmesi",
            "Tokenizer'ın kelime unutması",
            "Checkpoint kaybı"
        ],
        dogru: 1,
        aciklama: "Dar bir alanda agresif SFT yapılırsa genel yetenekler bozulur. Önlemler: düşük LR, 1-3 epoch, karışıma genel sohbet verisi katmak, LoRA gibi kısmi güncelleme (L8!) ve eğitim sonrası genel benchmark değerlendirmesi (MMLU vb.)."
    },
    {
        soru: "SFT veri seti kalitesi hakkında doğru olan hangisidir?",
        secenekler: [
            "10.000 özensiz örnek her zaman 200 uzman örneğinden iyidir",
            "500-1000 yüksek kaliteli, uzman doğrulamalı örnek çoğu görev için şaşırtıcı derecede yeterlidir (LIMA bulgusu)",
            "Miktar kaliteden önemlidir",
            "Sentetik veri asla kullanılmamalıdır"
        ],
        dogru: 1,
        aciklama: "LIMA (2023): 1000 özenli örnek, GPT-3.5 benzeri performansı yakaladı. Model bilginin çoğunu pretraining'den öğrenir; SFT sadece 'davranış biçimini' öğretir. Ama kritik görevlerde (tıp, hukuk) daha fazla ve doğrulanmış veri gerekir."
    },
    {
        soru: "SFT eğitiminde öğrenme oranı (LR) niye pretraining'den düşüktür (~2e-5 vs 3e-4)?",
        secenekler: [
            "GPU tasarrufu için",
            "Model mevcut genel bilgisini korusun — büyük adımlar pretraining'de kazanılan yetenekleri siler",
            "SFT daha kısa sürdüğü için",
            "Batch size küçük olduğu için"
        ],
        dogru: 1,
        aciklama: "Temel model aylarca eğitilmiş paha biçilmez bir varlıktır. Büyük LR ile birkaç adımda bu bilgiyi aşındırırsınız. SFT'nin hedefi davranışı 'rötüş'lemektir; ince fırça darbesi gerekir. Pratik aralık: 1e-5 ile 5e-5 arası."
    },
    {
        soru: "SFTTrainer'ın 'packing' özelliği ne yapar?",
        secenekler: [
            "Modeli sıkıştırır",
            "Kısa örnekleri tek uzun diziye paketler — GPU doluluk oranını %40'tan %90+'a çıkarır, eğitim hızlanır",
            "Veri setini zip'ler",
            "Padding kaldırır"
        ],
        dogru: 1,
        aciklama: "Talimat örnekleri genelde kısadır (örn. 100 token); 2048'lik pencerede her batch'in çoğu padding (çöp) olur. Packing: birçok örneği dikkatli kenarlıklarla tek diziye dizerek hesaplama verimliliğini artırır. Modern SFTConfig'de varsayılan gibi düşünülmeli."
    },
    {
        soru: "<|eot_id|> tokenını modelin öğrenmesi neden kritiktir?",
        secenekler: [
            "Metin formatı için",
            "Model cevabının nerede biteceğini bilsin diye — öğrenmezse sonsuza dek metin üretir veya konuşmanın diğer rollerini taklit eder",
            "Tokenizer'ın hızı için",
            "Bellek yönetimi için"
        ],
        dogru: 1,
        aciklama: "SFT verisinde her asistan cevabı <|eot_id|> ile biter; model kayıp üzerinden 'burada durmak doğru' sinyalini alır. Üretim sırasında eos_token_id olarak jenerasyon durdurucusu yapılandırılır. Eksikse model 'user:' yazıp kendi kendine konuşmaya devam eder."
    },
    {
        soru: "SFT sonrası model kalitesini değerlendirmek için en iyi yaklaşım hangisidir?",
        secenekler: [
            "Sadece eğitim kaybına bakmak",
            "Ayrılmış test setinde otomatik metrikler + insan değerlendirmesi kombinasyonu; temel modele karşı karşılaştırma; genel benchmarklarda gerileme kontrolü",
            "Sadece rastgele örneklere bakmak",
            "Parametre sayısını kontrol etmek"
        ],
        dogru: 1,
        aciklama: "Üçlü kontrol: (1) hedef görevde tutulan test seti performansı, (2) genel benchmark (MMLU vs) ile unutma kontrolü, (3) tercihen LLM-as-judge veya insan ile kalite incelemesi. Kayıp düştü diye model iyi olmaz — kayıp ezberi de düşürür."
    }
];
