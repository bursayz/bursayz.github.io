// Quiz: Inference / KV-Cache / Quantization — 10 soru
window.QUIZ_DATA = [
    {
        soru: "KV-cache'in temel işlevi nedir?",
        secenekler: [
            "Modeli diskte saklamak",
            "Geçmiş tokenların K/V vektörlerini önbelleğe alarak her adımda tekrar hesaplamayı önlemek",
            "Tokenizasyonu hızlandırmak",
            "KV = Kelime Vektörü saklamak"
        ],
        dogru: 1,
        aciklama: "Causal masking sayesinde geçmiş K/V'ler sabittir. Cache: her katmanda (n_head, seq, head_dim) tutulur. Token üretimi O(T²) yerine O(T) hesaplama maliyetiyle çalışır — üretim hızını katlarca artırır."
    },
    {
        soru: "Prefill ve decode aşamalarının farkı nedir?",
        secenekler: [
            "Aynı şey, sadece isim farkı",
            "Prefill: prompt'un tüm tokenları paralel işlenir (GPU hesaplama ile sınırlı); decode: tek token üretimi, bellek bant genişliği ile sınırlı",
            "Prefill sadece CPU'da, decode sadece GPU'da çalışır",
            "Prefill inference, decode eğitim aşamasıdır"
        ],
        dogru: 1,
        aciklama: "Prompt 2000 token ise prefill'de hepsi aynı anda işlenir (paralel, GPU hesabı yoğun). Decode'da her adımda 1 token üretilir — modelin tüm ağırlıkları tekrar tekrar bellekten okunur, GPU çekirdekleri genelde boş bekler. Bellek bant genişliği decode hızını belirler."
    },
    {
        soru: "Decode hızını (token/saniye) temel olarak ne belirler?",
        secenekler: [
            "CPU çekirdek sayısı",
            "Modelin bellek boyutu ÷ bellek bant genişliği (yani ağırlıkların ne kadar hızlı okunabildiği)",
            "Python versiyonu",
            "İnternet hızı"
        ],
        dogru: 1,
        aciklama: "decode_tokens/s ≈ memory_bandwidth / model_size. Örnek: 7B FP16 (14GB) + A100 (1.6TB/s) ≈ 114 token/s teorik üst sınır. Quantize ederseniz (Q4=3.5GB) hız 4x artar — bu yüzden quantization sadece bellek değil, hız kazandırır."
    },
    {
        soru: "7B parametreli modeli Q4_K_M quantization ile FP16'ya göre bellek kullanımı ne olur?",
        secenekler: [
            "Aynı kalır",
            "FP16: ~14 GB → Q4_K_M: ~4-4.5 GB (yaklaşık 3.5x daha az)",
            "Q4_K_M daha fazla kullanır",
            "Sıfırlanır"
        ],
        dogru: 1,
        aciklama: "Bellek ≈ N × bit/parametre / 8. 7×10⁹ × 16/8 = 14GB (FP16); 7×10⁹ × 4/8 = 3.5GB + metadata ile ~4-4.5GB (Q4_K_M). RTX 3060 (12GB) FP16'da sığmazken Q4'te rahatça çalışır + decode 4x hızlanır."
    },
    {
        soru: "NF4 (NormalFloat4) quantization formatının akıllılığı nedir?",
        secenekler: [
            "Sadece 4 renk kodlar",
            "LLM ağırlık dağılımı (normale yakın) için bilgi-teorik optimizasyonu — değerleri eşit aralıkla değil, değer yoğunluğuna göre sıkıştırır",
            "4 bitlik renk kodlaması",
            "Sadece GPU'da çalışır"
        ],
        dogru: 1,
        aciklama: "LLM ağırlıkları sıfır etrafında normal dağılıma yakın. Eşit aralıklı INT4 sıfıra yakın değerleri aynı kovaya atar. NF4 normal dağılımı 16 kovaya optimal böler — kritik sıfıra yakın bölgenin çözünürlüğü korunur. QLoRA'nın (L8) kalbi."
    },
    {
        soru: "T4 GPU (Colab ücretsiz, 65 TFLOPS FP16, 300GB/s bellek bant genişliği) ile 7B Q4_K_M modeli teorik olarak kaç token/s verebilir?",
        secenekler: [
            "~1500",
            "~85 token/s (300GB/s ÷ 3.5GB), pratikte ~30-60",
            "~5",
            "Çalışamaz"
        ],
        dogru: 1,
        aciklama: "Teorik üst sınır: 300 ÷ 3.5 ≈ 85 token/s. Pratikte prefill, attention hesaplaması ve sistem overhead'i ile 30-60 arası. Bu yüzden ücretsiz Colab'da bile kişisel LLM çalıştırabilirsiniz — quantization sayesinde."
    },
    {
        soru: "PagedAttention (vLLM'ın temel inovasyonu) neyi çözer?",
        secenekler: [
            "Model eğitimini hızlandırır",
            "KV-cache'in bellekte parçalanmasını önler — işletim sisteminin sanal bellek sayfalama mantığını KV-cache'e uygular",
            "Tokenizasyonu paralelleştirir",
            "Gradyan hesabını optimize eder"
        ],
        dogru: 1,
        aciklama: "Her istek için değişken uzunlukta KV-cache gerekir; önceden sabit bellek ayırmak israf eder. PagedAttention: KV-cache'i sabit boyutlu 'sayfalara' böler, ihtiyaç kadar allokasyon yapar. %20-40'a kadar daha verimli bellek → daha fazla eşzamanlı istek."
    },
    {
        soru: "Bir 7B modeli INT4 quantize edip tek token üretmek, aynı modeli FP16 ile tek token üretmekten neden daha hızlıdır?",
        secenekler: [
            "INT4'te işlem sayısı azalır",
            "Her forward pass'ta ağırlıklar bellekten okunur — INT4'te 4x az veri taşınır, decode hızı bellek bant genişliğiyle sınırlı olduğundan 4x potansiyel hız",
            "INT4 daha iyi sonuç verir",
            "Fark yoktur"
        ],
        dogru: 1,
        aciklama: "Decode'da GPU çekirdekleri veriyi bekler. Bellek bant genişliği sabitken, az veri = daha fazla okuma/saniye = daha fazla token/saniye. INT4'teki kalite kaybı ~%1-3, hız kazancı ~4x. Bu tradeoff inference'ın altın denge noktasıdır."
    },
    {
        soru: "70B modeli RTX 4090'da (24 GB) çalıştırmak için hangi quantization gerekir?",
        secenekler: [
            "FP16 (140 GB)",
            "INT8 (70 GB)",
            "Q4_K_M (~40 GB) — tek GPU'ya sığmaz, 2 GPU veya offloading gerekir",
            "Q2 (~20 GB) veya 2 × RTX 4090 ile Q4_K_M"
        ],
        dogru: 3,
        aciklama: "70B: FP16 = 140GB (sığmaz), INT8 = 70GB (sığmaz), Q4_K_M ≈ 40GB (1×4090'a sığmaz, 2×4090'a sığar), Q2 ≈ 20GB (tek 4090'da çalışır ama ciddi kalite kaybı). Lokal kullanımda Q4 + çoklu GPU veya Q2 kabul edilir."
    },
    {
        soru: "Ollama'nın (ollama run llama3.1:8b) kullanıcıya sağladığı değer nedir?",
        secenekler: [
            "Ücretsiz internet erişimi",
            "Modelin indirilmesi, quantization (GGUF Q4_K_M), KV-cache ve servis başlatmayı tek komutta paketleme — LLM'i yerel kullanımı Docker konteynerine benzetir",
            "Daha iyi model sonuçları",
            "GPU hızlandırma (hiç gerek kalmadan çalışır)"
        ],
        dogru: 1,
        aciklama: "Ollama: 'docker run' mantığını LLM'lere taşır. Tek komut → modeli indirir, GGUF Q4_K_M'i quantize eder, llama.cpp altyapısıyla CPU/GPU üzerinde servis başlatır. Inference mühendisliğinin tüm karmaşıklığını gizler. 'LLM'lerde Docker' olarak düşünün."
    }
];
