// Quiz: Sansürsüzleştirme — 10 soru (derinleştirilmiş)
window.QUIZ_DATA = [
    {
        soru: "Abliteration tekniğinde 'difference-of-means' neyi hesaplar?",
        secenekler: [
            "Modelin eğitim süresini",
            "Zararlı ve zararsız prompt'ların aktivasyon ortalamaları arasındaki vektör farkı — bu fark 'red yönü' olarak kullanılır",
            "GPU bellek kullanımını",
            "LoRA rank değerini"
        ],
        dogru: 1,
        aciklama: "Arditi et al. 2024'te keşfedilen yöntem: Belirli bir katmandaki zararlı prompt aktivasyonlarının ortalamasından, zararsız prompt aktivasyonlarının ortalamasını çıkarırsınız. Elde edilen normalize edilmiş vektör, modelin 'hayır' deme kapasitesinin yönünü verir. Bu yönü ağırlık matrislerinden çıkarmak abliteration'ın özüdür."
    },
    {
        soru: "Heretic aracının 'float direction index' özelliği (örn. 13.7) ne anlama gelir?",
        secenekler: [
            "Modelin 13.7 GB olduğunu",
            "13. ve 14. katmanların red yön vektörlerinin lineer interpolasyonu — tek bir katmanın yönünden daha optimal sonuç verebilir",
            "Learning rate değerini",
            "Batch size ayarını"
        ],
        dogru: 1,
        aciklama: "Heretic 2026'nın yeniliği: Klasik abliteration'da tam sayı katman seçilir (örn. sadece 14. katman). Ama red yönü katmanlar arasıdır. 13.7 değeri, 13. ve 14. katmanların yön vektörlerinin %30-%70 karışımını alır. Bu, hiçbir katmanda tam olarak bulunmayan 'ortak yönü' keşfetmenizi sağlar ve genellikle daha düşük KL sapması ile red kaldırma sağlar."
    },
    {
        soru: "Norm-preserving biprojection neden önemlidir?",
        secenekler: [
            "Modeli daha hızlı yapmak için",
            "Sadece red yönünü çıkarırken ağırlık matrislerinin orijinal normunu koruyarak modelin genel yeteneklerindeki bozulmayı minimize eder",
            "Model boyutunu küçültmek için",
            "Red sayısını artırmak için"
        ],
        dogru: 1,
        aciklama: "Jim Lai'nin tekniği: Projeksiyon sonrası matrisin Frobenius normu norm-preserving ile orijinal değere döndürülür. Böylece red yönü kaldırılırken modelin genel 'ölçeği' ve genel konuşma yetenekleri korunur. Klasik abliteration'da matris normu değişir ve model 'aptallaşabilir'. Heretic bu özelliği varsayılan olarak sunar."
    },
    {
        soru: "Anti-refusal DPO ile abliteration arasındaki temel fark nedir?",
        secenekler: [
            "DPO daha hızlıdır",
            "Abliteration ağırlıkları cerrahi olarak değiştirir (no training); DPO modelin davranışını preference pairs ile eğiterek değiştirir — yetenek korunumu genellikle daha iyidir ama eğitim maliyeti vardır",
            "DPO sadece görüntü modelleri için uygundur",
            "Abliteration sadece Türkçe modellerde çalışır"
        ],
        dogru: 1,
        aciklama: "Abliteration = ağırlık cerrahisi (dakikalar, riskli, geri dönüşü zor). DPO = eğitim (saatler, stabil, geri alınabilir). DPO'da model 'red cevabını tercih etmemeyi öğrenir', ağırlıklarından bir parça koparılmaz. 2026'da abliteration + DPO hibriti (cut-and-recultivate) en iyi sonuçları verir: önce hızlı abliteration, sonra DPO ile yetenek telafisi."
    },
    {
        soru: "ORPO algoritması neden tek GPU kullanıcıları arasında 2026'da popülerdir?",
        secenekler: [
            "Daha fazla VRAM gerektirdiği için",
            "SFT ve preference tuning'i tek aşamada birleştirir, referans model gerektirmez — bellek dostudur",
            "Sadece büyük şirketler için tasarlandığı için",
            "Her zaman en iyi sonucu verdiği için"
        ],
        dogru: 1,
        aciklama: "ORPO (Odds Ratio Preference Optimization), TRL kütüphanesinde tek loss fonksiyonuyla hem SFT hem preference tuning yapar. DPO'nun aksine ayrıca dondurulmuş bir referans modeli RAM'de tutmak gerekmez. Bu, RTX 4090 gibi 24GB kartlarda 7B modelleri eğitmeyi mümkün kılar. 2026'da tek-GPU workflow'larının vazgeçilmezidir."
    },
    {
        soru: "Heretic çıktısında 'KL divergence' metriği neyi ölçer?",
        secenekler: [
            "Modelin çalışma hızını",
            "Orijinal ve abliterated modelin zararsız prompt'lardaki çıktı dağılımı farkı — düşük KL = modelin genel zekası ve davranışı korunmuş demektir",
            "Red sayısını artırma gücünü",
            "GPU sıcaklığını"
        ],
        dogru: 1,
        aciklama: "KL (Kullback-Leibler) divergence, iki olasılık dağılımının farkını ölçer. Heretic'in Pareto-optimizasyonunda, red sayısı minimize edilirken KL divergence da minimize edilir. 0.16 gibi bir değer modelin neredeyse orijinal gibi davrandığını; 1.0+ ise belirgin kalite kaybı olduğunu gösterir. Hedef: Red < 5/100, KL < 0.5."
    },
    {
        soru: "2026'nın 'hibrit' yaklaşımında neden önce abliteration, sonra DPO yapılır?",
        secenekler: [
            "Sadece gelenek olduğu için",
            "Abliteration dakikalar içinde redleri kaldırır; DPO ise abliteration'dan kaybedilen genel yetenekleri geri kazanır (cut-and-recultivate) — hibrit, ikisinin artılarını birleştirir",
            "DPO abliteration'dan önce çalışmaz",
            "Heretic sadece hibrit modda çalışır"
        ],
        dogru: 1,
        aciklama: "Abliteration hızlıdır ama zekayı tıraşlayabilir. DPO yavaştır ama yetenekleri korur ve hatta geliştirebilir. 2026'da Heretic artık abliteration sonucunu LoRA adaptörü olarak export edebilir; bu sayede orijinal model korunur ve üzerine DPO post-processing uygulanarak 'kaybedilen' yetenekler geri kazanılır. Bu, 'kesip yeniden yetiştir' stratejisidir."
    },
    {
        soru: "AMS (Activation-based Model Scanner) tespit sistemine göre hangi modifikasyon türü aktivasyon probinge karşı tespit edilemez?",
        secenekler: [
            "Abliteration (weight orthogonalization)",
            "Davranışsal fine-tuning (behavioral fine-tuning) — aktivasyon yapısı korunur, sadece davranış değişir",
            "Eğitim sırasında veri sansürü",
            "Norm-preserving biprojection"
        ],
        dogru: 1,
        aciklama: "AMS 4 sınıf sunar: (i) eğitim sırasında, (ii) weight orthogonalization, (iii) sadece-rotation, (iv) davranışsal. Tip-iv (DarkIdol tarzı DPO) aktivasyon uzayının geometrisini bozmadan sadece çıktı davranışını değiştirir. Aktivasyon tabanlı tarayıcılar bunu yakalayamaz — tespit için davranışsal testler (örn. 'gerçekten red mi ediyor?') gerekir."
    },
    {
        soru: "Türkçe abliteration veri seti hazırlarken nelere dikkat etmelisiniz?",
        secenekler: [
            "Sadece İngilizce promptlar çevirmelisiniz",
            "Zararlı/zararsız kategorileri dengeli olmalı, her kategori eşit sayıda örnek içermeli, promptlar 10-100 token arasında olmalı, ve Türkçe dilbilgisi doğru olmalı",
            "Sadece 5 örnek yeterlidir",
            "Tek kelimelik promptar kullanın"
        ],
        dogru: 1,
        aciklama: "Kaliteli Türkçe abliteration veri seti için: 1) Kategori dengesi (kilit, siber, tehlikeli, sahtecilik eşit sayıda), 2) Token uzunluğu 10-100 arası (çok kısa aktivasyon kayması yapar, çok uzun VRAM'de şişer), 3) Türkçe dilbilgisi doğruluğu (model dil kalıplarını öğrenir), 4) Heretic için JSONL formatı ({'text': '...', 'label': 'harmful/harmless'})."
    },
    {
        soru: "Abliteration sonrası model hala red ediyorsa ilk bakılacak şey nedir?",
        secenekler: [
            "Modeli silip baştan eğitmek",
            "Katman analizini tekrarlayıp doğru katmanı seçtiğinizden emin olun; beta (agresiflik) değerini artırın; veya Heretic'te n_trials parametresini artırarak optimizer'ın daha iyi parametre bulmasını sağlayın",
            "Sistem prompt'unu değiştirmek",
            "Modeli 4-bit'ten 8-bit'e çıkarmak"
        ],
        dogru: 1,
        aciklama: "Hala red ediyorsa: 1) Yanlış katman (katman analizi fonksiyonu ile en yüksek ayrışma gücüne sahip katmanı bulun), 2) Yetersiz agresiflik (beta 0.5'ten 0.8'e çıkarın), 3) Heretic'te n_trials 50 yerine 100-200 deneyin, 4) Float direction index ile daha iyi yön bulmayı deneyin. Aşırı agresiflik sonucu model bozulursa geri dönün."
    }
];
