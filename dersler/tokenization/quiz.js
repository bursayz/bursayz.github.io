// Quiz: Tokenization — 10 soru
window.QUIZ_DATA = [
    {
        soru: "Tokenization işleminin temel amacı nedir?",
        secenekler: [
            "Metni şifrelemek",
            "Ham metni, modelin işleyebileceği sayı dizilerine dönüştürmek",
            "Metni sıkıştırmak",
            "Metnin gramerini kontrol etmek"
        ],
        dogru: 1,
        aciklama: "Bilgisayar sadece sayıyla çalışır. Tokenization: metin → token parçaları → sayı ID'leri. 'Merhaba' → ['Mer','haba'] → [15339, 882]. Model bu ID'leri alır, embedding tablosundan vektörüne çevirir."
    },
    {
        soru: "BPE (Byte Pair Encoding) algoritması nasıl çalışır?",
        secenekler: [
            "Her kelimeyi rastgele bir ID'ye atar",
            "Veri setinde en sık birlikte geçen karakter çiftlerini tekrar tekrar birleştirerek kelime haznesi oluşturur",
            "Her kelimeyi tek bir token'a dönüştürür",
            "Karakterleri ASCII kodlarına çevirir"
        ],
        dogru: 1,
        aciklama: "BPE iteratiftir: en sık çift → birleştir → yeni token → tekrar et. Sık kullanılan kelimeler tek token (verimlilik), nadir kelimeler alt-parçalara bölünür (esneklik). 'kanat' → 'kan'+'at' gibi."
    },
    {
        soru: "Türkçe'nin tokenization açısından zorluğu nedir?",
        secenekler: [
            "Alfabesinin farklı olması",
            "Eklemeli (agglutinative) yapısı — bir kelime çok sayıda token parçasına bölünür, maliyet ve yavaşlık artar",
            "Büyük-küçük harf sorunu",
            "Sağdan sola yazılması"
        ],
        dogru: 1,
        aciklama: "'Eve gidiyorumuz'daki 'ev+ler+i+miz+den' beş morfem içerir. İngilizce tokenizer Türkçe'yi çok parçalar. Bu daha fazla token = daha yüksek API maliyeti ve daha yavaş işlem demektir. Türkçe optimized tokenizer eğitmek avantaj sağlar."
    },
    {
        soru: "Bağlam penceresi (context window) ne demektir?",
        secenekler: [
            "Modelin aynı anda görebildiği maksimum token sayısı",
            "Tarayıcının pencere boyutu",
            "Modelin ne kadar metin üretebileceği",
            "Token oluşturma hızı"
        ],
        dogru: 0,
        aciklama: "Context window = modelin tek seferde işleyebildiği maksimum token uzunluğu. GPT-4: 128K token ≈ ~96.000 kelime. Pencere aşılınca eski token'lar modelden 'düşer'. Kısa pencerede uzun belge göndermek bilgi kaybına yol açar."
    },
    {
        soru: "Özel token'lardan [EOS] (End of Sequence) ne ifade eder?",
        secenekler: [
            "Cümlenin başlangıcını",
            "Metnin (veya turda cevabın) bittiğini — model üretimini burada durdurur",
            "Boşluk karakterini",
            "Özel bir kelime sınıfını"
        ],
        dogru: 1,
        aciklama: "EOS (End of Sequence), bir metnin veya yanıtın sonunu işaretler. Chat modellerinde 'asistan' yanıtı EOS ile sonlanır — bu token üretildiğinde model durur. Model EOS üretmeyi öğrenmezse sonsuz metin üretir."
    },
    {
        soru: "Chat template'de <|start_header_id|>user<|end_header_id|> işaretleri neyi temsil eder?",
        secenekler: [
            "HTML formatlaması",
            "Konuşma rollerini (sistem/kullanıcı/asistan) modelin anlayabileceği özel token'lar",
            "Unicode karakterleri",
            "Hata mesajlarını"
        ],
        dogru: 1,
        aciklama: "Chat template, LLM eğitimi için yapılandırılmış format: sistem talimatı, kullanıcı mesajı, asistan yanıtı farklı özel token'larla işaretlenir. Model bu sınırları öğrenerek kimin konuştuğunu ve ne zaman duracağını bilir. SFT dersinde detaylı göreceğiz."
    },
    {
        soru: "1 token yaklaşık kaç İngilizce kelimeye denk gelir?",
        secenekler: ["Tam olarak 1 kelime", "Yaklaşık 0.75 kelime", "Yaklaşık 10 kelime", "Yaklaşık 0.1 kelime"],
        dogru: 1,
        aciklama: "Ortalama 1 token ≈ 0.75 İngilizce kelime. Türkçe için eklemeli yapı nedeniyle biraz daha azdır (~0.5-0.6). API maliyeti hesaplarken bu oran kritiktir: 1000 kelimelik bir metin ≈ 1330 İngilizce token ≈ 1700+ Türkçe token."
    },
    {
        soru: "Kelime haznesi (vocabulary) büyüklüğü model için ne ifade eder?",
        secenekler: [
            "Daha büyük vocab = her zaman daha iyi model",
            "Tokenizer'ın tanıdığı benzersiz token sayısı — çok küçükse kelimeler çok parçalanır, çok büyükse embedding matrisi şişer",
            "Modelin öğrendiği toplam kelime sayısı",
            "Eğitim verisinin boyutu"
        ],
        dogru: 1,
        aciklama: "Denge meselesi: küçük vocab (sadece karakterler, ~100 token) → her kelime çok parçalanır → uzun diziler. Büyük vocab (~100K token) → sık kelimeler tek token → verimli ama embedding matrisi devasa. GPT-4: ~100K, Llama: ~128K."
    },
    {
        soru: "tiktoken.get_encoding('cl100k_base') komutu ne yapar?",
        secenekler: [
            "TensorFlow tokenizerını yükler",
            "OpenAI'ın GPT-3.5/4 modellerinin kullandığı BPE tokenizerını yükler",
            "Türkçe özel tokenizer yükler",
            "Modelin en son eğitim checkpoint'ini indirir"
        ],
        dogru: 1,
        aciklama: "cl100k_base, OpenAI'ın GPT-3.5 ve GPT-4 serisinde kullandığı BPE tokenizer'ının adıdır. encode() metni token ID dizisine çevirir, decode() tersini yapar. Hugging Face'te AutoTokenizer.from_pretrained('model-adi') aynı amaçla kullanılır."
    },
    {
        soru: "Bağlam penceresi dolunca eski token'lar ne olur?",
        secenekler: [
            "Model tarafından yeniden okunabilirler",
            "Modelin o anki görüşünden tamamen düşer — model 'unutmuştur' (yeniden beslenmedikçe)",
            "Modelin ağırlıklarına yazılır (öğrenme olur)",
            "Otomatik olarak sıkıştırılır"
        ],
        dogru: 1,
        aciklama: "Kısa pencerede eski token'lar model görüşünden düşer. Bu geçicidir: her API çağrısında pencerede olan token'lar yeniden işlenir. RAG (Retrieval Augmented Generation) bu sınırlamayı aşmak için bilgiyi pencereye dışarıdan besler."
    }
];
