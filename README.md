# Bursa Yapay Zeka Geliştiricileri Topluluğu

Bursa'da yapay zeka ve makine öğrenmesi alanında çalışan, öğrenen ve üreten bir topluluk.
**Ücretsiz, Türkçe, sıfırdan yapay zeka eğitim platformu.**

## Canlı Site

🔗 [bursayz.github.io](https://bursayz.github.io/)

## Yapı

- `index.html` — Eğitim kataloğu (ana sayfa, 34 ders)
- `topluluk.html` — Topluluk sayfası (etkinlikler, üyeler, sosyal medya)
- `dersler/<slug>/` — Her ders ayrı klasör: `index.html` + `quiz.js` + `viz/*.js`
- `mufredat.md` — Tüm konular ve tamamlanma durumları
- `js/edu/` — Eğitim altyapısı (progress, quiz, auth, curriculum)
- `css/edu.css` — Eğitim teması (seri bazlı renkler)

## Eğitim Serileri

| Seri | Konular | Seviye |
|------|---------|--------|
| 🟢 Temel | YZ nedir, matematik, Python, NumPy, görselleştirme | Sıfırdan |
| 🟡 ML/DL | Regresyon, sinir ağları, PyTorch, backprop, overfitting | Orta |
| 🟣 LLM | Tokenization→attention→transformer→GPT→SFT→LoRA→RLHF→inference | İleri |
| 🔵 Görüntü | CNN→sınıflandırma→transfer learning→YOLO→diffusion→inpainting→quantization | İleri |
| 🩶 Uzman | Quantization, pruning, distillation, edge AI, etik | Uzman |

## Özellikler

- ✅ 34 ders, her biri interaktif görselleştirme + sınav
- ✅ %70 geçme eşiği ile ilerleme takibi
- ✅ localStorage + GitHub Gist senkron (opsiyonel)
- ✅ Three.js 3D görselleştirmeler (attention, diffusion, sinir ağı, transformer)
- ✅ Mobil uyumlu, kaynakça bağlantılı

## Teknolojiler

- HTML5, Tailwind CSS, Vanilla JavaScript
- Three.js (3D görselleştirme)
- GitHub Device Flow OAuth (ilerleme senkronu)
- Discord API (üye listesi senkronu)

## Geliştirme

```
git clone https://github.com/bursayz/bursayz.github.io.git
cd bursayz.github.io
# index.html dosyasını tarayıcıda aç
```

## Lisans

© 2026 Bursa Yapay Zeka Geliştiricileri Topluluğu. Tüm hakları saklıdır.
