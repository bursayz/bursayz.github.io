// Quiz: Python Temelleri — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Python'da değişken tanımlamak için hangisi doğrudur?",
        secenekler: ["var yas = 16;", "int yas = 16;", "yas = 16", "yas := 16;"],
        dogru: 2,
        aciklama: "Python'da değişken tanımlamak için sadece isim = değer yazılır; tip belirtmeye (int, var vb.) gerek yok. Python tipi otomatik anlar."
    },
    {
        soru: "Aşağıdaki kodun çıktısı nedir?\n\nliste = [10, 20, 30]\nprint(liste[1])",
        secenekler: ["10", "20", "30", "Hata verir"],
        dogru: 1,
        aciklama: "Python'da indeksleme 0'dan başlar. liste[0] → 10, liste[1] → 20, liste[2] → 30. Bu birçok başlangıç hatasının kaynağıdır — dikkat!"
    },
    {
        soru: "if-elif-else yapısında, birden fazla koşul aynı anda çalışabilir mi?",
        secenekler: [
            "Evet, tüm koşullar kontrol edilir ve uygun olanlar çalışır",
            "Hayır, sadece ilk True olan koşul çalışır, diğerleri atlanır",
            "Hayır, sadece 'if' bloğu çalışır",
            "Evet, 'else' her zaman çalışır"
        ],
        dogru: 1,
        aciklama: "if-elif-else zincirinde Python yukarıdan aşağı kontrol eder; ilk True olan bloğu çalıştırır ve gerisini atlar. Birden fazla bağımsız koşul istiyorsanız her birini ayrı 'if' olarak yazmalısınız."
    },
    {
        soru: "range(5) ifadesi hangi sayıları üretir?",
        secenekler: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "0'dan 5'e kadar (5 dahil)", "5 tane rastgele sayı"],
        dogru: 1,
        aciklama: "range(5) → 0, 1, 2, 3, 4 üretir (başlangıç 0, bitiş 5 hariç). Yapay zeka eğitim döngülerinde 'epoch' sayısı genellikle range(epoch_sayisi) ile tanımlanır."
    },
    {
        soru: "def fonksiyon_adi(): ile tanımlanan fonksiyonun içindeki 'return' ne işe yarar?",
        secenekler: [
            "Fonksiyonu sonlandırır",
            "Fonksiyondan bir değer döndürür (ve fonksiyonu sonlandırır)",
            "Ekrana yazdırır",
            "Değişkeni global yapar"
        ],
        dogru: 1,
        aciklama: "return, fonksiyonun ürettiği sonucu çağıran yere geri verir. 'kare_al(5)' gibi bir ifade, return edilen değerle (25) yer değiştirir. return olmadan fonksiyon None döndürür."
    },
    {
        soru: "Sözlükte (dictionary) bir değere nasıl erişirsiniz?\nogrenci = {\"isim\": \"Zeynep\", \"yas\": 16}",
        secenekler: ["ogrenci(0)", "ogrenci[0]", "ogrenci[\"isim\"]", "ogrenci.isim"],
        dogru: 2,
        aciklama: "Sözlüklerde anahtar (key) ile erişilir: ogrenci[\"isim\"]. LLM API'ları (OpenAI, Hugging Face) istek/yanıtlarını bu formatla alır — bu yüzden çok önemlidir."
    },
    {
        soru: "import numpy as np satırı ne yapar?",
        secenekler: [
            "numpy kütüphanesini internetten indirir",
            "numpy kütüphanesini projeye ekler ve ona 'np' kısaltmasıyla erişim sağlar",
            "Yeni bir numpy.py dosyası oluşturur",
            "numpy'ın sadece array fonksiyonunu içe aktarır"
        ],
        dogru: 1,
        aciklama: "import, kurulu bir kütüphaneyi aktif eder. 'as np' ile kısaltma tanımlanır; artık np.array() yazabilirsiniz. Kütüphaneyi ilk kez kurmak için terminalde 'pip install numpy' gerekir."
    },
    {
        soru: "Python'da girinti (indentation) neden önemlidir?",
        secenekler: [
            "Kodun daha güzel görünmesi için (opsiyonel)",
            "Kod bloklarının (if, for, fonksiyon içi) sınırlarını belirtmek için ZORUNLUDUR",
            "Sadece fonksiyonlarda gereklidir",
            "Değişken tanımlarken gereklidir"
        ],
        dogru: 1,
        aciklama: "Python'da girinti blok sınırlarını belirtir; { ve } yerine kullanılır. Yanlış girinti IndentationError verir. Bu Python'un en ayırt edici özelliğidir: okunabilirliği zorunlu kılar."
    },
    {
        soru: "Aşağıdaki kodun çıktısı nedir?\n\nfor i in range(3):\n    print(i * 2)",
        secenekler: ["0 2 4", "2 4 6", "1 2 3", "3 6 9"],
        dogru: 0,
        aciklama: "range(3) → 0, 1, 2 üretir. Her biri 2 ile çarpılır: 0×2=0, 1×2=2, 2×2=4. Yapay zeka döngülerinde bu mantık kullanılır: for epoch in range(10): # 10 epoch eğit."
    }
];
