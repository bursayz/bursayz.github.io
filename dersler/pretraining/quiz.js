// Quiz: Pretraining — 9 soru
window.QUIZ_DATA = [
    {
        soru: "FLOPs ≈ 6 × N × D formülünde N ve D nedir?",
        secenekler: [
            "N = veri boyutu, D = derinlik",
            "N = parametre sayısı, D = eğitim token sayısı",
            "N = nöron sayısı, D = gün",
            "N = katman sayısı, D = dropout oranı"
        ],
        dogru: 1,
        aciklama: "6N·D: her token için ileri geçiş ~2N FLOP, geriye yayılım ~4N FLOP. 7B parametre × 1T token = 4.2×10²² FLOP. Bu hesap, eğitim maliyetini ve GPU gereksinimini önceden tahmin etmeyi sağlar."
    },
    {
        soru: "Chinchilla (DeepMind, 2022) bulgusu neyi ortaya koydu?",
        secenekler: [
            "Büyük modeller her zaman daha iyidir",
            "Çoğu LLM az veriyle eğitilmişti — hesaplama-optimum oran yaklaşık 20 token/parametre'dir",
            "Küçük modeller eğitilemez",
            "Veri boyutu performansı etkilemez"
        ],
        dogru: 1,
        aciklama: "Chinchilla: aynı hesaplama bütçesiyle, daha KÜÇÜK model + daha ÇOK veri, daha BÜYÜK model + daha AZ veriden daha iyi sonuç verir. Optimum ~20 token/parametre. Llama modelleri bu yüzden boyutlarına göre çok fazla token görür (8B model ≈ 15T token!)."
    },
    {
        soru: "Pretraining sonrası temel model (base model), 'Türkiye'nin başkenti nedir?' girdisine nasıl tepki verir?",
        secenekler: [
            "'Ankara' diye net cevap verir",
            "Soruyu yanıtlamaz; metni sürdürür — çünkü sadece 'sonraki token tahmini' oyununu öğrendi, asistan davranışı henüz yok",
            "Hata mesajı verir",
            "Sadece İngilizce yanıt verir"
        ],
        dogru: 1,
        aciklama: "Temel model bir 'metin tamamlama makinesi'dir: internette böyle bir sorunun ardından genellikle sınav seçenekleri, benzer sorular vs. gelir — onu üretir. 'Asistan gibi davranma' SFT (L7) dersindeki ayrı bir aşamadır."
    },
    {
        soru: "Kayıp eğrisinde ani bir yükseliş (loss spike) gözlenirse ne yapılmalıdır?",
        secenekler: [
            "Eğitimi durdurup her şeyi silmek",
            "Son sağlıklı checkpoint'e dönüp eğitime oradan devam etmek; LR'yi gözden geçirmek",
            "Önemsememek, kendiliğinden düzelir",
            "Modeli büyütmek"
        ],
        dogru: 1,
        aciklama: "Spike nedenleri: bozuk veri batch'i, LR çok yüksek, gradient patlaması veya donanım hatası (büyük GPU kümelerinde sık olur). Checkpoint sistemi tam bu yüzden vardır — haftalar süren eğitimde saatlik kayıtlar."
    },
    {
        soru: "Veri hazırlamada 'deduplication' (kopya kaldırma) neden kritiktir?",
        secenekler: [
            "Disk alanı tasarrufu için",
            "Aynı metni tekrar tekrar gören model onu ezberler (memorization) ve genelleme yeteneği düşer; ayrıca hesaplama israfıdır",
            "Tokenizer'ı hızlandırmak için",
            "Yasal zorunluluk, başka sebebi yok"
        ],
        dogru: 1,
        aciklama: "İnternet verisi bolca kopya içerir (alıntılar, mirror siteler). Tekrarlanan metinler modelde ezber davranışını artırır ve etkin veri çeşitliliğini düşürür. Kopya kaldırma + kalite filtreleme, veri miktarı artırmaktan daha etkilidir."
    },
    {
        soru: "Pretraining hesaplaması: 7B model, 1T token ile 1 A100 GPU'da (≈3×10¹⁴ FLOP/s) teoride kaç gün sürer?",
        secenekler: ["~4 gün", "~40 gün", "~3900 gün (10+ yıl)", "~1 saat"],
        dogru: 2,
        aciklama: "6 × 7×10⁹ × 10¹² = 4.2×10²² FLOP ÷ 3×10¹⁴ FLOP/s ≈ 1.4×10⁸ saniye ≈ 3900 gün. Bu yüzden LLM eğitimi binlerce GPU'luk kümelerde yapılır: 1000 GPU ile ~4 gün (idealleştirilmiş; pratikte verimlilik ~%50'dir)."
    },
    {
        soru: "Kayıp eğrisinin uzunca süre 'düzlüğe' girmesinin (plateau) olası açıklaması nedir?",
        secenekler: [
            "Model mükemmel oldu",
            "Model/veri ölçeği bu aşamada yeterli — daha fazla iyileşme için daha büyük model veya daha fazla/kaliteli veri gerekir",
            "Optimizer bozuldu",
            "Kesin overfitting"
        ],
        dogru: 1,
        aciklama: "Scaling laws'a göre kayıp log-log ölçekte lineer azalır ama model kapasitesi veya veri çeşitliliği tükendiyse yavaşlar. Eğri hâlâ düşüyorsa eğitime devam edilebilir; tamamen düzleşmişse ölçeği büyütmek gerekir."
    },
    {
        soru: "Veri karışımında kod (GitHub) verisinin bulunmasının yan faydası nedir?",
        secenekler: [
            "Sadece programlama sorularını yanıtlamak",
            "Kod okuyan modeller mantıksal akıl yürütmede (reasoning) ölçülebilir iyileşme gösterir — yapısallık ve adım-adımlık öğrenir",
            "API maliyetini düşürür",
            "Tokenizasyonu kolaylaştırır"
        ],
        dogru: 1,
        aciklama: "Araştırmalar (örn. Codex makalesi ve sonraki çalışmalar) kod verisinin genel akıl yürütme performansını da artırdığını gösteriyor. Kod: kesin sözdizimi, uzun bağımlılık zincirleri, hata ayıklama örüntüleri içerir — bunlar mantıklı düşünmeyi destekler."
    },
    {
        soru: "Ön eğitim ile ince ayar (fine-tuning) arasındaki temel fark nedir?",
        secenekler: [
            "Hiçbir fark yok, aynı şey",
            "Pre-training devasa etiketsiz veriyle genel dil yeteneği kazandırır (pahalı, haftalar); ince ayar küçük etiketli veriyle davranış öğretir (ucuz, saatler)",
            "Pre-training sadece GPU ister, ince ayar CPU'da yapılır",
            "İnce ayar daha çok veri gerektirir"
        ],
        dogru: 1,
        aciklama: "Pretraining: trilyonlarca token, devasa küme, genel yetenek. Ince ayar: binlerce-milyonlarca örnek, tek GPU bile yeter, görevsel davranış. Sonraki iki dersimiz (L7-L8) tamamen bu ikinci aşamaya ayrılmıştır."
    }
];
