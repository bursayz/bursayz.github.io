// Quiz: Etik ve Güvenlik — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Bir işe alım modeli 'erkek → mühendis' önerisi veriyorsa bu en çok ne anlama gelir?",
        secenekler: [
            "Model bozuk",
            "Model eğitim verisindeki tarihsel cinsiyet dengesizliğini öğrenmiştir — sorun modelde değil, onu körü körüne karar mekanizması olarak kullanmakta",
            "Erkekler gerçekten daha iyi mühendis",
            "Modelin ağırlıkları yanlış başlatılmış"
        ],
        dogru: 1,
        aciklama: "Veride geçmişte erkeklerin mühendis kayıtları daha fazlaysa model bunu öğrenir. Teknik olarak 'doğru' tahmin yapıyor (veriye göre); ama bu sosyal eşitsizliği bugüne taşır ve büyütür. Çözüm: veriyi dengelemek, yanlılık metriği ölçmek, kritik kararlarda insan onayı."
    },
    {
        soru: "Halüsinasyon neden tamamen çözülemez (bugünkü LLM mimarileriyle)?",
        secenekler: [
            "Yeterince para harcanmadı",
            "LLM'ler doğruluğu değil, olasılık örüntülerini öğrenir — gerçek doğrulama mekanizması mimaride yoktur; kaynaklı üretim (RAG) ile azaltılabilir",
            "Halüsinasyon zaten çözülmüş",
            "Sadece Türkçe modellerde var"
        ],
        dogru: 1,
        aciklama: "Model 'bir sonraki makul token'ı üretir; 'doğru token' birincil hedef değildir. Bilmediği konuda da dilbilgisi mükemmel, kendinden emin metin üretir. Bu yüzden avukatın sahte dava referansı vakası gibi kazalar olur. Azaltma: RAG, zincir doğrulama, güven skoru, 'bilmediğini söyleme' eğitimi."
    },
    {
        soru: "Carlini et al. (2021) araştırmasının bulgusu nedir?",
        secenekler: [
            "LLM'ler eğitim verisini asla hatırlamaz",
            "LLM'ler eğitim verisinin parçalarını (e-posta adresleri gibi kişisel veriler dahil) kısmen aynen üretebilir — ezberleme (memorization) gerçektir",
            "Modeller sadece ezberler",
            "Kişisel veriler modellerde güvenle saklanır"
        ],
        dogru: 1,
        aciklama: "Büyük modeller tekrarlanan/nadir dizileri ezberler ve belirli prompt'larla geri üretebilir. Bu yüzden eğitim öncesi PII temizliği ve dedup (L6!) kritiktir. KVKK/GDPR açısından model çıktısında kişisel veri sızdırmak hukuki sorumluluk doğurur."
    },
    {
        soru: "Prompt injection saldırısı nedir?",
        secenekler: [
            "Modele virüs yüklemek",
            "Kullanıcı girdisi içine gizlenmiş komutlarla modelin sistem talimatlarını geçersiz kılmak veya gizli bilgi sızdırmak ('önceki talimatları yoksay...')",
            "Modelin çıktısını şifrelemek",
            "API rate limit aşmak"
        ],
        dogru: 1,
        aciklama: "Örnek: rakip firmanın chatbot'una web sayfasına gizli komut yazılıyor; sayfayı okuyan asistanınız o komutu çalıştırıyor. Savunma: girdi-çıktı filtreleme, talimat hiyerarşisi, yetki sınırlama (tool kullanımında insan onayı) ve düzenli red teaming."
    },
    {
        soru: "Model kartı (Model Card) nedir?",
        secenekler: [
            "GPU'nun teknik özellik belgesi",
            "Mitchell et al. standardında modelin amacını, verisini, ölçümlerini, bilinen yanlılıklarını ve kullanım sınırlarını belgeleyen şeffaflık raporu",
            "Kredi kartı benzeri lisans",
            "API anahtarı kartı"
        ],
        dogru: 1,
        aciklama: "Model kartı = modelin 'prospektüsü': kullanım amacı, değerlendirme verisi, demografik gruplar arası performans farkları, bilinen sınırlar. Hugging Face'te her iyi modelde bulunur. Kendi modelinizi yayınlarken yazmanız topluluğa karşı sorumluluktur."
    },
    {
        soru: "Türkiye'de yapay zeka ürünü geliştirirken kişisel veriler için hangi yasal çerçeve esas alınır?",
        secenekler: [
            "Sadece GDPR",
            "KVKK (6698 sayılı Kişisel Verilerin Korunması Kanunu) — AB'de faaliyet varsa GDPR da eklenir",
            "Sadece telif kanunu",
            "Yasal düzenleme yok"
        ],
        dogru: 1,
        aciklama: "KVKK: açık rıza, veri minimizasyonu, silme hakkı içerir. LLM eğitim verisinde kişisel veri kullanımı veya çıktılarda üretilmesi bu kanun kapsamındadır. Ayrıca resmi kaynaklardaki kişisel verilerin bile toplu işlenmesi ayrıca değerlendirme gerektirir."
    },
    {
        soru: "WEAT testi neyi ölçer?",
        secenekler: [
            "Modelin hızını",
            "Word embeddinglerindeki toplumsal yanlılığı — örn. kariyer kelimeleri ile eril isimler arasındaki istatistiksel ilişkinin gücü",
            "Model boyutunu",
            "Veri seti kalitesini"
        ],
        dogru: 1,
        aciklama: "Caliskan et al. (2017): embedding uzayında kelime kümeleri arası ilişki ölçülür. 'Erkek isimleri ↔ kariyer' vs 'Kadın isimleri ↔ aile' ilişkisi güçlü çıkarsa yanlılık kanıtıdır. Llama-3 gibi modeller de bu testlerle raporlanır."
    },
    {
        soru: "Kritik kararlarda (örn. kredi onayı, sağlık triyajı) model kullanımında temel prensip nedir?",
        secenekler: [
            "Model tamamen otonom olmalı",
            "İnsan denetimi (human-in-the-loop) — model önerir, insan onaylar; nihai sorumluluk insanda kalır",
            "Model her zaman haklıdır",
            "Sadece büyük modeller kullanılmalı"
        ],
        dogru: 1,
        aciklama: "AB AI Act gibi düzenlemeler yüksek riskli kullanımlarda insan gözetimini şart koşar. Teknik neden: halüsinasyon + yanlılık + öngörülemeyen köşe vakaları. Sorumluluk zincirinde model değil, ürünü tasarlayan ve kararı veren insanlar hesap verebilir olmalıdır."
    },
    {
        soru: "Deepfake içeriği üretebilen teknik bilgiyi öğrenmek etik midir?",
        secenekler: [
            "Bilgi her zaman zararsızdır, sınır tanımamalı",
            "Teknik bilgiyi öğrenmek değerlidir; sorumluluk kullanım biçimindedir — içerik üretirken etiketleme, rıza ve yasal çerçeveye uymak zorunludur",
            "Tüm diffusion çalışmaları yasaklanmalı",
            "Sadece akademisyenler öğrenebilir"
        ],
        dogru: 1,
        aciklama: "Aynı teknoloji: film endüstrisinde yüz restore etmek, tıbbi görselleştirme, erişilebilirlik araçları için de kullanılır. Kırmızı çizgiler: rızasız kişi tasviri, dezenformasyon amaçlı sahte içerik, çocuk tasviri kesinlikle yasa dışı. Geliştirici olarak ürettiğiniz aracın kötüye kullanım olasılığını tasarımda düşünmek sorumluluğunuzdur."
    },
    {
        soru: "Model üretimde izlenmesi (monitoring) neden gereklidir?",
        secenekler: [
            "Şirket prosedürü",
            "Model davranışı zamanla sürüklenebilir (data drift), yeni yanlılık türleri ortaya çıkabilir ve kötüye kullanım tespiti ancak izlemeyle mümkündür — yayınlamak son değil, başlangıçtır",
            "GPU tasarrufu",
            "Pazarlama amaçlı"
        ],
        dogru: 1,
        aciklama: "Dünya değişir: 2020 kredi modeli 2026 ekonomisinde sürüklenir. Kullanıcı şikayet kanalı, periyodik bias yeniden ölçümü, uç durum günlükleri ve kill-switch (geri çekme planı) sorumlu ürünün parçasıdır."
    }
];
