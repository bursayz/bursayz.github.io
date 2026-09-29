// Quiz: Yapay Zeka Nedir? — 8 soru, geçme %70
window.QUIZ_DATA = [
    {
        soru: "Yapay zeka (AI) için en doğru tanım hangisidir?",
        secenekler: [
            "İnsan gibi düşünebilen ve bilinci olan makineler",
            "Bilgisayarların insan zekâsı gerektiren işleri yapabilmesini sağlayan teknoloji",
            "İnternetteki tüm bilgiyi ezberleyen programlar",
            "Robotların fiziksel hareketlerini kontrol eden yazılım"
        ],
        dogru: 1,
        aciklama: "Yapay zeka, bilinç sahibi makineler değil; insan zekâsı gerektiren işleri (tanıma, tahmin, üretim vb.) yapabilen bilgisayar sistemleridir. Bilinç veya 'gerçek anlama' mevcut sistemlerde yoktur."
    },
    {
        soru: "Günümüzdeki tüm yapay zeka sistemleri (ChatGPT dahil) hangi kategoriye girer?",
        secenekler: [
            "Genel Yapay Zeka (AGI)",
            "Süper Yapay Zeka (ASI)",
            "Dar Yapay Zeka (Narrow AI)",
            "Duygusal Yapay Zeka"
        ],
        dogru: 2,
        aciklama: "Mevcut tüm sistemler 'dar yapay zeka'dır: belirli görevlerde çok iyidirler ama genel akıl yürütme ve bilinç göstermezler. AGI henüz var değil, ASI ise tamamen varsayımsaldır."
    },
    {
        soru: "1956 Dartmouth Konferansı'nın önemi nedir?",
        secenekler: [
            "İlk bilgisayarın üretilmesi",
            "'Yapay zeka' teriminin ilk kez kullanılması ve alanın bir bilim dalı olarak kurulması",
            "İnternetin icat edilmesi",
            "İlk derin öğrenme modelinin eğitilmesi"
        ],
        dogru: 1,
        aciklama: "1956 Dartmouth Konferansı'nda John McCarthy ve arkadaşları 'yapay zeka' terimini ortaya attı ve bu alanın bağımsız bir araştırma dalı olabileceğini savundu."
    },
    {
        soru: "1997'de Deep Blue'nun Garry Kasparov'u yenmesi neyi gösterdi?",
        secenekler: [
            "Yapay zekanın insan bilincine ulaştığını",
            "Dar yapay zekanın belirli bir görevde insanı geçebileceğini",
            "Bilgisayarların öğrenebildiğini (Deep Blue kurallarla programlanmıştı, öğrenmezdi)",
            "Derin öğrenmenin başlangıcını"
        ],
        dogru: 1,
        aciklama: "Deep Blue satranç kuralları ve arama algoritmalarıyla programlanmıştı; öğrenmiyordu. Satrançta insanı yendi ama başka hiçbir iş yapamazdı — bu, 'dar' zekânın gücünü gösterir. Derin öğrenme devrimi ise 2012 AlexNet ile başladı."
    },
    {
        soru: "Bir yapay zeka modelinin temel yaşam döngüsü nedir?",
        secenekler: [
            "Kodlama → Derleme → Çalıştırma",
            "Input (girdi) → Model (işlem) → Output (çıktı)",
            "Eğitim → Silme → Yeniden eğitim",
            "Veri toplama → İnternete yükleme → Paylaşma"
        ],
        dogru: 1,
        aciklama: "Tüm yapay zeka sistemlerinin temel akışı: bir girdi alınır, model bu girdiyi öğrendiği örüntülerle işler ve bir çıktı üretir. Modeli 'eğitmek', bu çıktının doğru olması için modelin içindeki ağırlıkları ayarlamaktır."
    },
    {
        soru: "ChatGPT gibi dil modelleri metni nasıl üretir?",
        secenekler: [
            "Konuyu tam anlayarak ve bilinçli olarak yazar",
            "Eğitim verisinden kopyala-yapıştır yapar",
            "Bir sonraki en olası kelimeyi (token'ı) istatistiksel olarak tahmin eder",
            "Her seferinde rastgele kelime seçer"
        ],
        dogru: 2,
        aciklama: "LLM'ler metni token-token üretir: her adımda, o ana kadar gelen metne bakarak bir sonraki en olası token'ı tahmin eder. Bu, 'anlama' ile aynı şey değildir; istatistiksel örüntü takibidir."
    },
    {
        soru: "2012'de AlexNet'in önemi neydi?",
        secenekler: [
            "İnternetin yaygınlaşması",
            "Derin öğrenmenin görüntü tanımayı kökten değiştirmesi ve yapay zekanın altın çağını başlatması",
            "İlk yapay zeka konferansının düzenlenmesi",
            "ChatGPT'nin piyasaya çıkması"
        ],
        dogru: 1,
        aciklama: "AlexNet, ImageNet görüntü tanıma yarışmasını derin sinir ağı ile ezici farkla kazandı. Bu zafer, GPU ile büyük sinir ağlarının eğitilebileceğini kanıtladı ve modern derin öğrenme çağını başlattı."
    },
    {
        soru: "Bu platformda bir sonraki dersi 'tamamlandı' olarak açmak için ne gereklidir?",
        secenekler: [
            "Sadece dersi sonuna kadar okumak",
            "GitHub ile giriş yapmak",
            "Ders sonundaki sınavı %70 ve üzeri skorla geçmek",
            "Discord sunucusuna katılmak"
        ],
        dogru: 2,
        aciklama: "Her dersin sonunda bir sınav vardır. %70 ve üzeri skorla geçtiğinizde, sıradaki ders 'tamamlandı' kilidini açar ve rozet kazanırsınız. GitHub girişi sadece ilerlemenizi cihazlar arasında senkronlamak içindir — zorunlu değildir."
    }
];
