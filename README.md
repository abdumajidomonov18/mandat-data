# 🎓 Abituriyentlar Natijasi (Mandat) - 2026

Ushbu loyiha O'zbekiston Respublikasi Oliy ta'lim muassasalariga kirish imtihonlari (Mandat) natijalarini qulay va tezkor qidirish uchun mo'ljallangan to'liq (Full-Stack) tizim hisoblanadi. Loyiha ham **Telegram Bot**, ham **Web Ilova (WebApp)** orqali ishlaydi.

## ✨ Asosiy Imkoniyatlari

- **🔍 Tezkor qidiruv:** Abituriyentlarni **ID raqami** yoki **Ism-familiyasi** bo'yicha qidirish imkoniyati.
- **🏆 Global Reyting:** Har bir abituriyentning jami 677,500+ ishtirokchi orasidagi mutlaqo aniq va adolatli global reytingini hisoblash (bir xil ball olganlarni xalqaro musobaqa qoidasi asosida baholash bilan).
- **🎛 Kengaytirilgan Filtrlar:** Web ilova orqali "Eng kam ball", "Eng ko'p ball", "Nechta natija ko'rsatilsin" va "Tartiblash" bo'yicha filter qilish.
- **📱 Telegram WebApp Integratsiyasi:** Telegram ichidan chiqmasdan turib to'g'ridan-to'g'ri chiroyli va qulay Web ilovadan foydalanish imkoniyati.
- **🚀 Yuqori tezlik:** Ma'lumotlar bazasini qidirish va reytingni hisoblash uchun optimallashtirilgan SQL so'rovlari (1 soniyadan kam vaqtda javob qaytaradi).

## 🛠 Texnologiyalar (Stack)

**Backend:**
- Node.js & Express.js
- Telegraf (Telegram Bot API)
- PostgreSQL (NeonDB Serverless SQL)

**Frontend:**
- React (Vite)
- Tailwind CSS

## ⚙️ O'rnatish va Ishga tushirish

Loyihani o'zingizning serveringiz yoki kompyuteringizda ishga tushirish uchun:

1. **Repozitoriyni yuklab oling:**
   ```bash
   git clone https://github.com/abdumajidomonov18/mandat-data.git
   cd mandat-data
   ```

2. **Kutubxonalarni o'rnating:**
   ```bash
   npm install
   ```

3. **Muhit o'zgaruvchilari (.env) ni sozlang:**
   Loyihaning asosiy papkasida `.env` nomli fayl yarating va unga o'zingizning ma'lumotlaringizni kiriting:
   ```env
   DATABASE_URL=postgres://user:password@host/db
   BOT_TOKEN=sizning_telegram_bot_tokeningiz
   PORT=5000
   ```

4. **Frontend'ni yig'ish (Build qilish):**
   ```bash
   npm run build
   ```

5. **Loyiha va Botni ishga tushirish:**
   ```bash
   npm start
   ```
   *(Bu buyruq bir vaqtning o'zida ham Web Serverni (API va React fayllarini), ham Telegram Botni ishga tushiradi).*

## 📡 API Endpoints

- `GET /api/search?q={id_yoki_ism}&isId={true/false}` - Qidiruv natijalarini olish
- `GET /api/top?limit=100&minScore=56.7&maxScore=189&sort=score_desc` - Filtrlangan Top natijalarni olish
- `GET /api/rank/:id` - Bitta abituriyentning to'liq natijasi va reytingini olish
- `GET /api/stats` - Umumiy statistika (Jami, eng yuqori, eng past o'rtacha ballar)

## 🤝 Hissa qo'shish

Ushbu loyiha ochiq manbali (Open Source). Agar loyihani rivojlantirishga o'z hissangizni qo'shmoqchi bo'lsangiz, bemalol *Pull Request* jo'natishingiz mumkin.

## 📝 Litsenziya

Ushbu loyiha ochiq va erkin foydalanish uchun taqdim etilgan. Ma'lumotlar faqat tanishish maqsadida ishlatiladi.
