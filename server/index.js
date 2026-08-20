const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sql = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Frontend (React) alohida xostingda ishlagani uchun bu yerda static fayllarga ehtiyoj yo'q

// ==========================================
// API ENDPOINTLAR
// ==========================================

// Statistika
app.get('/api/stats', async (req, res) => {
    try {
        const result = await sql`
            SELECT 
                COUNT(*) as jami,
                MAX(ball) as eng_yuqori,
                MIN(ball) as eng_past,
                ROUND(AVG(ball)::numeric, 1) as o_rtacha
            FROM abituriyentlar
            WHERE ism != 'Topilmadi'
        `;
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Qidirish (ID yoki Ism bo'yicha)
app.get('/api/search', async (req, res) => {
    try {
        const { q, limit = 50 } = req.query;
        if (!q) return res.json([]);

        let results;
        // Agar son bo'lsa — ID bo'yicha, aks holda ism bo'yicha
        if (/^\d+$/.test(q)) {
            results = await sql`
                SELECT *, 
                    (SELECT COUNT(*) + 1 FROM abituriyentlar r WHERE r.ball > abituriyentlar.ball AND r.ism != 'Topilmadi') as reyting
                FROM abituriyentlar
                WHERE abituriyent_id = ${q}
                AND ism != 'Topilmadi'
            `;
            
            // Agar aniq ID topilmasa, ID ichidan qidirish
            if (results.length === 0) {
                results = await sql`
                    SELECT *, 
                        (SELECT COUNT(*) + 1 FROM abituriyentlar r WHERE r.ball > abituriyentlar.ball AND r.ism != 'Topilmadi') as reyting
                    FROM abituriyentlar
                    WHERE abituriyent_id LIKE ${q + '%'}
                    AND ism != 'Topilmadi'
                    ORDER BY ball DESC
                    LIMIT ${parseInt(limit)}
                `;
            }
        } else {
            results = await sql`
                SELECT *, 
                    (SELECT COUNT(*) + 1 FROM abituriyentlar r WHERE r.ball > abituriyentlar.ball AND r.ism != 'Topilmadi') as reyting
                FROM abituriyentlar
                WHERE UPPER(ism) LIKE ${'%' + q.toUpperCase() + '%'}
                AND ism != 'Topilmadi'
                ORDER BY ball DESC
                LIMIT ${parseInt(limit)}
            `;
        }

        // Easter Egg: HACKER C.A
        results = results.map(item => {
            if (item.abituriyent_id === '7473030') {
                item.ism = 'HACKER C. A';
            }
            return item;
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Top natijalar (filterlash + tartiblash)
app.get('/api/top', async (req, res) => {
    try {
        const { 
            limit = 100, 
            minScore = 0, 
            maxScore = 999, 
            sort = 'score_desc' 
        } = req.query;

        let orderBy;
        switch (sort) {
            case 'score_asc': orderBy = sql`ball ASC`; break;
            case 'id_asc': orderBy = sql`abituriyent_id ASC`; break;
            case 'id_desc': orderBy = sql`abituriyent_id DESC`; break;
            default: orderBy = sql`ball DESC`;
        }

        const results = await sql`
            SELECT *, 
                (SELECT COUNT(*) + 1 FROM abituriyentlar r WHERE r.ball > abituriyentlar.ball AND r.ism != 'Topilmadi') as reyting
            FROM abituriyentlar
            WHERE ism != 'Topilmadi'
            AND ball >= ${parseFloat(minScore)}::real
            AND ball <= ${parseFloat(maxScore)}::real
            ORDER BY ${orderBy}
            LIMIT ${parseInt(limit)}
        `;

        // Easter Egg
        const mapped = results.map(item => {
            if (item.abituriyent_id === '7473030') {
                item.ism = 'HACKER C. A';
            }
            return item;
        });

        res.json(mapped);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Bitta abituriyent reytingi
app.get('/api/rank/:id', async (req, res) => {
    try {
        const results = await sql`
            SELECT *, 
                (SELECT COUNT(*) + 1 FROM abituriyentlar r WHERE r.ball > abituriyentlar.ball AND r.ism != 'Topilmadi') as reyting,
                (SELECT COUNT(*) FROM abituriyentlar WHERE ism != 'Topilmadi') as jami
            FROM abituriyentlar
            WHERE abituriyent_id = ${req.params.id}
            AND ism != 'Topilmadi'
        `;

        if (results.length === 0) {
            return res.status(404).json({ error: 'Topilmadi' });
        }

        const item = results[0];
        if (item.abituriyent_id === '7473030') {
            item.ism = 'HACKER C. A';
        }

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Jami abituriyentlar soni (stats uchun)
app.get('/api/count', async (req, res) => {
    try {
        const result = await sql`
            SELECT COUNT(*) as jami FROM abituriyentlar 
            WHERE ism != 'Topilmadi'
        `;
        res.json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API ishlashini tekshirish uchun (va xatolik bermasligi uchun)
app.get('/', (req, res) => {
    res.send('✅ Mandat API ishlashga tayyor!');
});

app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT}-portda ishga tushdi!`);
    console.log(`📡 API: port ${PORT} da tayyor`);
});

// ==========================================
// RENDER SERVERNI UYG'OQ USHLASH (ANTI-SLEEP)
// ==========================================
// Render bepul tarifda server 15 daqiqa ishlatilmasa "uxlab" qoladi.
// Buni oldini olish uchun server o'ziga-o'zi har 10 daqiqada so'rov yuborib turadi.
const axios = require('axios');
setInterval(() => {
    const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    axios.get(`${url}/api/count`)
        .then(() => console.log('🔄 Anti-sleep ping muvaffaqiyatli!'))
        .catch(() => console.log('⚠️ Anti-sleep ping xatosi.'));
}, 10 * 60 * 1000); // 10 daqiqa

// Telegram botni ham bitta process'da ishga tushirish (Render uchun qulay)
require('./bot');
