// Quiz: Edge ve Mobil AI — 9 soru
window.QUIZ_DATA = [
    {
        soru: "Edge AI'nın bulut inference'a göre en büyük avantajları nelerdir?",
        secenekler: [
            "Daha güçlü modeller çalıştırır",
            "Gizlilik (veri cihazdan çıkmaz), gecikme (ağ gidiş-dönüşü yok), çevrimdışı çalışma ve maliyet (sunucu faturası yok)",
            "Daha kolay kod yazılır",
            "Daha ucuz telefonlar"
        ],
        dogru: 1,
        aciklama: "Edge'in bedeli cihaz sınırları (RAM/pil/ısınma). Ama avantajlar kritik uygulamalar için vazgeçilmezdir: tıbbi verilerin cihazda kalması HIPAA uyumudur; otonom sürüşte 100ms ağ gecikmesi ölümcüldür."
    },
    {
        soru: "ONNX formatının rolü nedir?",
        secenekler: [
            "Sadece PyTorch eklentisi",
            "Framework'ten bağımsız ortak model formatı — PyTorch modelini bir kere dönüştürüp CPU/GPU/NNAPI/WebGPU'da çalıştırma sağlar",
            "Bir veri sıkıştırma formatı",
            "Apple'a özgü format"
        ],
        dogru: 1,
        aciklama: "ONNX = Open Neural Network Exchange. Model + hesap grafiğini tanımlar. onnxruntime her platformda çalıştırır; üstüne TensorRT (NVIDIA), CoreML (Apple) veya DirectML (Windows) backend'i bağlanabilir. 'Bir kere paketle, her yerde çalıştır'."
    },
    {
        soru: "TFLite Micro neyi mümkün kılar?",
        secenekler: [
            "Telefonlarda GPT-4 çalıştırmak",
            "Mikrodenetleyicilerde (Cortex-M, 256KB RAM) bile ses tanıma/anahtar kelime tespiti gibi küçük modelleri çalıştırmak",
            "Web'de modelleri sıkıştırmak",
            "GPU hızlandırması"
        ],
        dogru: 1,
        aciklama: "TinyML: 'Hey Google' tarzı anahtar kelime tespiti her zaman açık mikrofonla çalışır ama pili bitirmez — 20KB'lık INT8 model saniyede binlerce inference yapar. IoT/akıllı saatler/sesli asistanların donanım katmanı budur."
    },
    {
        soru: "Apple cihazlarında Edge AI için hangi motor kullanılır ve hangi donanımdan faydalanır?",
        secenekler: [
            "TensorFlow Lite + GPU",
            "CoreML + Neural Engine (ANE) — Apple silikonundaki özel yapay zeka çipi",
            "ONNX Runtime + Sadece CPU",
            "CoreML + CUDA"
        ],
        dogru: 1,
        aciklama: "CoreML modeli ANE'de çalışınca CPU/GPU'ya göre çok daha az pil harcar. iPhone 15 Pro'nun ANE'si 35 TOPS yapar. Not: CUDA NVIDIA'ya özeldir, Apple'da Metal Performance Shaders backend'i kullanılır."
    },
    {
        soru: "Transformers.js ile model çalıştırmanın ağ yapısı nasıldır?",
        secenekler: [
            "Her tahmin sunucuya gider",
            "Model ilk açılışta tarayıcıya indirilir ve önbelleğe alınır; sonraki tüm hesaplamalar kullanıcının cihazında (WebAssembly/WebGPU) yapılır — sıfır sunucu maliyeti",
            "Sunucu GPU'su üzerinden WebSocket",
            "Çevrimdışı çalışamaz"
        ],
        dogru: 1,
        aciklama: "Bu, GitHub Pages gibi statik hosting'in gücüdür: demo sayfanız tamamen ücretsiz host edilir, hesabı kullanıcıların tarayıcısı yapar. DistilBERT gibi küçük modeller WASM ile makul hızda çalışır; WebGPU destekleyen tarayıcılarda GPU hızlanması devreye girer."
    },
    {
        soru: "Mobil uygulamaya model eklerken 'graceful degradation' stratejisi ne demektir?",
        secenekler: [
            "Uygulamayı yavaşlatmak",
            "Cihaz eskiyse/güçsüzse küçük modele düşmek, güçlüyse büyük modeli çalıştırmak — herkese çalışan deneyim sunmak",
            "Modeli tamamen kaldırmak",
            "Hata ayıklama modu"
        ],
        dogru: 1,
        aciklama: "Kullanıcı tabanınızda 2018 telefonlar da 2026 telefonlar da var. Strateji: cihaz RAM'i/NPU'su tespit edilir → uygun model varyantı indirilir (örn. Q2 yerine Q4). En kötü durumda bulut fall-back. Kullanıcı hiç 'çökme' görmez."
    },
    {
        soru: "NPU (Neural Processing Unit) ile CPU arasındaki fark nedir?",
        secenekler: [
            "Hiçbir fark",
            "NPU'da matris çarpımlarına özel devreler vardır — aynı işi CPU'dan 10-50 kat güç verimliliğiyle yapar",
            "NPU internete bağlanır",
            "CPU yapay zeka çalıştıramaz"
        ],
        dogru: 1,
        aciklama: "CPU genel amaçlıdır; NPU'da binlerce küçük çarpan-biriktirici (MAC) devre dizisi vardır. INT8 matmul işlemi burada tek komutla sürer. Qualcomm Hexagon, Apple ANE, MediaTek APU — hepsi aynı fikrin ürünüdür."
    },
    {
        soru: "OTA (over-the-air) model güncelleme neden önemlidir?",
        secenekler: [
            "Uygulama mağazası kuralları",
            "Model dosyası uygulama paketine gömülürse, model iyileştirmeleri için uygulamanın tamamen güncellenmesi gerekir; OTA ile model ayrı indirilip güncellenebilir",
            "Pil tasarrufu",
            "Dosya boyutu küçültme"
        ],
        dogru: 1,
        aciklama: "App Store incelemesi günler sürebilir; modelinizi haftada bir güncellemek istiyorsanız modeli ayrı indirmeniz şart. Dikkat: indirilen modelin bütünlük doğrulaması (hash), boyut yönetimi ve fall-back mekanizması tasarlanmalı."
    },
    {
        soru: "WebGPU'nun (WebNN ile birlikte) tarayıcı AI'sına katkısı nedir?",
        secenekler: [
            "Sadece WebGL ile grafik",
            "Tarayıcıdan GPU'ya genel amaçlı hesap erişimi — transformer matmul'ları gibi işler artık WASM CPU'sunun 10-100 katı hızında çalışabilir",
            "İnternet hızını artırmak",
            "Videoyu sıkıştırmak"
        ],
        dogru: 1,
        aciklama: "WebGPU (2023+) compute shader'lar getirir; WebNN ise donanıma özel NPU erişimi standartlaştırır. Bu ikisiyle Llama-3 8B (Q4) tarayıcıda dakikada makul token hızında çalışır hale geldi — 'sunucusuz ChatGPT' demosu gerçek."
    }
];
