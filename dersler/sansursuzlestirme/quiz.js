// Quiz: Sansürsüzleştirme — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Abliteration (yönsel fesat) tekniğinin temel prensibi nedir?",
        secenekler: [
            "Modeli zararsız veriyle yeniden eğitmek",
            "Aktivasyon uzayındaki 'red yönünü' (refusal direction) hesaplayıp ağırlık matrislerinden çıkarmak — modelin red davranışını lineer cebirle kaldırmak",
            "Modele sistem prompt'u eklemek",
            "Red cevaplarını filtrelemek"
        ],
        dogru: 1,
        aciklama: "Abliteration, Arditi et al. 2024'te keşfedildi: zararlı ve zararsız prompt'ların aktivasyon ortalamaları arasındaki fark (difference-of-means) red yönünü verir. Bu yönü ağırlık matrislerinden çıkarmak (orthogonalization) modelin 'hayır' deme kapasitesini büyük ölçüde ortadan kaldırır — fine-tuning gerektirmez, sadece lineer cebir."
    },
    {
        soru: "2026 itibariyle abliteration'da 'norm-preserving biprojection' neyi amaçlar?",
        secenekler: [
            "Modeli daha hızlı çalıştırmak",
            "Sadece red yönünü çıkarırken ağırlık matrislerinin normunu (büyüklüğünü) koruyarak modelin genel yeteneklerindeki bozulmayı minimize etmek",
            "Modelin boyutunu küçültmek",
            "Daha çok red üretmek"
        ],
        dogru: 1,
        aciklama: "Jim Lai'nin geliştirdiği bu teknik, projeksiyon sonrası matrisin Frobenius normunu orijinal değere geri döndürür. Böylece red yönü kaldırılırken modelin genel 'ölçeği' korunur — zeka kaybı azalır. Klasik abliteration gereksiz ağırlık değişimine yol açabilir."
    },
    {
        soru: "Heretic aracının abliteration'daki en önemli yeniliği nedir?",
        secenekler: [
            "Daha güzel kullanıcı arayüzü",
            "Optuna TPE optimizer ile red sayısı ve KL sapmasını birlikte optimize ederek otomatik parametre bulma — kullanıcının hangi katmanı seçeceğini bilmesine gerek kalmaz",
            "Sadece MoE modelleri desteklemesi",
            "GPU gerektirmemesi"
        ],
        dogru: 1,
        aciklama: "Heretic, 2025-2026'da abliteration'ı otomatize etti. Float direction index (katmanlar arası interpolasyon), component-wise ağırlıklandırma (attention vs MLP ayrı) ve Pareto-optimal çözüm bulma, onu elle abliteration'dan ayıran temel özelliklerdir. Kullanıcı sadece model ve veri verir, gerisini optimizer halleder."
    },
    {
        soru: "Float direction index (örn. 12.5) ne anlama gelir?",
        secenekler: [
            "Modelin 12.5 katmanı olduğu",
            "13. ve 14. katmanların red yön vektörlerinin lineer kombinasyonu (interpolasyon) — tek bir katmanın yönünden daha iyi sonuç verebilir",
            "Learning rate değeri",
            "Batch size ayarı"
        ],
        dogru: 1,
        aciklama: "Heretic'in yeniliği: red yönü tek bir katmanla sınırlı değildir. 12.5 indeksi, 12. ve 13. katmanların yön vektörlerinin ortalamasını alır. Bu, 'hiçbir katmanda tam olarak bulunmayan' optimal yönleri keşfetmenizi sağlar ve genellikle daha düşük KL sapmasıyla red kaldırma sağlar."
    },
    {
        soru: "Anti-refusal DPO (M6) ile abliteration arasındaki temel fark nedir?",
        secenekler: [
            "DPO daha hızlıdır",
            "Abliteration ağırlıkları cerrahi olarak değiştirir (no training); DPO modelin davranışını preference pairs ile eğiterek değiştirir — yetenek korunumu genellikle daha iyidir ama eğitim maliyeti vardır",
            "DPO sadece küçük modellerde çalışır",
            "Abliteration LoRA kullanır"
        ],
        dogru: 1,
        aciklama: "Abliteration = weight surgery (dakikalar, riskli). DPO = training (saatler, daha stabil). DPO'da model 'red cevabını tercih etmemeyi öğrenir', ağırlıklarından bir parça koparılmaz. 2026'da abliteration sonrası DPO ile yetenek telafisi (hibrit yaklaşım) en iyi sonuçları verir."
    },
    {
        soru: "ORPO algoritması 2026'da neden popülerdir?",
        secenekler: [
            "Daha fazla veri gerektirdiği için",
            "SFT ve DPO'yu tek aşamada birleştirir, referans model gerektirmez — tek GPU kullanıcıları için bellek dostu ve basit pipeline sunar",
            "Sadece görüntü modelleri için uygundur",
            "Referans modeli en iyi şekilde kullandığı için"
        ],
        dogru: 1,
        aciklama: "ORPO (Odds Ratio Preference Optimization), Supervised Fine-Tuning ve preference tuning'i tek loss fonksiyonunda birleştirir. DPO'dan farklı olarak ayrı bir referans modeli RAM'de tutmak gerekmez — bu da tek tüketici GPU'sunda (RTX 4090) 7B modelleri eğitmeyi mümkün kılar."
    },
    {
        soru: "Heretic ile abliteration yaparken 'KL divergence' neden önemlidir?",
        secenekler: [
            "Modelin hızını ölçmek için",
            "Orijinal modelle abliterated modelin zararsız prompt'lardaki çıktı dağılımı farkını ölçer — düşük KL = modelin genel zekası korunmuş demektir",
            "Red sayısını artırmak için",
            "Veri seti boyutunu ayarlamak için"
        ],
        dogru: 1,
        aciklama: "KL divergence, abliterated modelin 'ne kadar bozulduğunu' ölçer. 0.16 gibi düşük bir değer (Heretic'in gemma-3-12b sonucu) orijinalden neredeyse farksız demektir; 1.0+ belirgin kalite kaybıdır. Heretic bu metriği red sayısıyla birlikte minimize eder."
    },
    {
        soru: "2026'nın 'hibrit' sansürsüzleştirme yaklaşımı nedir?",
        secenekler: [
            "Sadece DPO kullanmak",
            "Önce abliteration ile kabaca redleri kaldırmak (hızlı), sonra DPO ile kaybedilen yetenekleri geri kazanmak (cut-and-recultivate) — Heretic artık LoRA çıktısı vererek bu akışı destekler",
            "Sadece sistem prompt'u kullanmak",
            "Modeli silip baştan eğitmek"
        ],
        dogru: 1,
        aciklama: "Abliteration'ın hızı + DPO'nun kalite korunumu kombinasyonu 2026'da standarttır. Heretic abliteration sonucunu LoRA adaptörü olarak export edebilir; bu sayede orijinal model korunur ve abliteration üzerine DPO post-processing uygulanabilir."
    },
    {
        soru: "AMS (Activation-based Model Scanner)'a göre hangi modifikasyon türü aktivasyon probinge karşı tespit edilemez?",
        secenekler: [
            "Abliteration (weight orthogonalization)",
            "Davranışsal fine-tuning (behavioral fine-tuning) — aktivasyon yapısı korunur, sadece davranış değişir",
            "Eğitim sırasında veri filtreleme",
            "Norm-preserving biprojection"
        ],
        dogru: 1,
        aciklama: "AMS sınıflandırmasına göre tip-iv 'davranışsal fine-tuning' (örn. DarkIdol tarzı DPO), aktivasyon uzayının geometrisini bozmadan sadece çıktı davranışını değiştirir. Bu nedenle aktivasyon tabanlı tespit yöntemleri bunu yakalayamaz — tespit için davranışsal testler gerekir."
    },
    {
        soru: "Sansürsüzleştirilmiş bir modeli 'araştırma' amaçlı kullanırken hangi davranış kesinlikle yasalara aykırıdır?",
        secenekler: [
            "Modelin çalışma prensiplerini akademik olarak analiz etmek",
            "Kendi yazılımınızın güvenlik açıklarını test etmek (red teaming)",
            "Ürettiğiniz zararlı içeriği dağıtmak veya başkalarına zarar vermek amacıyla kullanmak — teknik bilgiyi kötüye kullanmak hukuki sorumluluk doğurur",
            "Kendi veri setlerinizde PII taraması yapmak"
        ],
        dogru: 2,
        aciklama: "Teknik bilgiyi öğrenmek veya kendi sistemlerinizi korumak için test etmek meşrudur. Ancak sansürsüzleştirilmiş modelle zararlı içerik üretmek, dağıtmak veya başkalarına zarar vermek (siber saldırı, dezenformasyon) hukuki sorumluluk doğurur. 'Model yaptı' bahanesi geçerli değildir."
    }
];
