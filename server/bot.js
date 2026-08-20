const { Telegraf, Markup } = require('telegraf');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sql = require('./db');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Jami sonini olish
async function getTotal() {
    const result = await sql`SELECT COUNT(*) as jami FROM abituriyentlar WHERE ism != 'Topilmadi'`;
    return parseInt(result[0].jami);
}

// Reyting hisoblash
async function getRank(abituriyentId) {
    const results = await sql`
        SELECT *, 
            (SELECT COUNT(*) + 1 FROM abituriyentlar r WHERE r.ball > abituriyentlar.ball AND r.ism != 'Topilmadi') as reyting
        FROM abituriyentlar
        WHERE abituriyent_id = ${abituriyentId}
        AND ism != 'Topilmadi'
    `;
    return results[0] || null;
}

// Ism bo'yicha qidirish
async function searchByName(name) {
    const results = await sql`
        SELECT *, 
            (SELECT COUNT(*) + 1 FROM abituriyentlar r WHERE r.ball > abituriyentlar.ball AND r.ism != 'Topilmadi') as reyting
        FROM abituriyentlar
        WHERE UPPER(ism) LIKE ${'%' + name.toUpperCase() + '%'}
        AND ism != 'Topilmadi'
        ORDER BY ball DESC
        LIMIT 10
    `;
    return results;
}

// Medal emoji
function getMedal(rank) {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '⭐';
    if (rank <= 100) return '🔥';
    return '';
}

// /start
bot.start(async (ctx) => {
    const jami = await getTotal();
    ctx.replyWithHTML(
        '👋 Assalomu alaykum!\n\n' +
        '🎓 <b>Abituriyent Mandat Qidiruv Boti</b>\n\n' +
        'Menga abituriyentning <b>ID raqamini</b> yoki <b>ism-familiyasini</b> yuboring, ' +
        'men sizga uning ballini va reytingini ko\'rsataman.\n\n' +
        `📊 Bazada jami <b>${jami.toLocaleString()}</b> ta abituriyent mavjud.\n\n` +
        '💡 <i>Masalan:</i> <code>7088884</code> yoki <code>KARIMOV</code>',
        Markup.inlineKeyboard([
            [Markup.button.webApp('🌐 Web ilovani ochish', 'https://mandat-app-web-94.onrender.com/')]
        ])
    );
});

// /help
bot.help((ctx) => {
    ctx.replyWithHTML(
        '📖 <b>Botdan foydalanish:</b>\n\n' +
        '1️⃣ Menga abituriyent <b>ID raqamini</b> yuboring\n' +
        '2️⃣ Yoki <b>ism-familiyasini</b> yuboring\n' +
        '3️⃣ Men sizga natijani ko\'rsataman\n\n' +
        '📌 <b>Buyruqlar:</b>\n' +
        '/start — Botni ishga tushirish\n' +
        '/help — Yordam\n' +
        '/stats — Statistika',
        Markup.inlineKeyboard([
            [Markup.button.webApp('🌐 Web ilovani ochish', 'https://mandat-app-web-94.onrender.com/')]
        ])
    );
});

// /stats
bot.command('stats', async (ctx) => {
    try {
        const stats = await sql`
            SELECT 
                COUNT(*) as jami,
                MAX(ball) as eng_yuqori,
                MIN(ball) as eng_past,
                ROUND(AVG(ball)::numeric, 1) as o_rtacha
            FROM abituriyentlar
            WHERE ism != 'Topilmadi'
        `;
        const s = stats[0];
        
        // Eng yuqori ball egasi
        const top = await sql`
            SELECT ism, ball FROM abituriyentlar 
            WHERE ism != 'Topilmadi' 
            ORDER BY ball DESC LIMIT 1
        `;

        ctx.replyWithHTML(
            '📊 <b>Statistika:</b>\n\n' +
            `👥 Jami abituriyentlar: <b>${parseInt(s.jami).toLocaleString()}</b>\n` +
            `🏆 Eng yuqori ball: <b>${s.eng_yuqori}</b> (${top[0].ism})\n` +
            `📈 Eng past ball: <b>${s.eng_past}</b>\n` +
            `📊 O'rtacha ball: <b>${s.o_rtacha}</b>`
        );
    } catch (err) {
        ctx.reply('❌ Xatolik yuz berdi: ' + err.message);
    }
});

// Matn xabarlari (qidiruv)
bot.on('text', async (ctx) => {
    const query = ctx.message.text.trim();
    const jami = await getTotal();

    try {
        // ID bo'yicha qidirish
        if (/^\d+$/.test(query)) {
            const item = await getRank(query);

            if (item) {
                let ism = item.ism;
                let detailUrl = `https://mandat.uzbmb.uz/Bakalavr/MainSearch?entrantid=${item.abituriyent_id}&lang=uz`;
                
                // Easter Egg
                if (item.abituriyent_id === '7473030') {
                    ism = 'HACKER C. A';
                    detailUrl = 'https://www.instagram.com/abdumajid_o18/';
                }

                const rank = parseInt(item.reyting);
                const medal = getMedal(rank);

                ctx.replyWithHTML(
                    '✅ <b>Abituriyent topildi!</b>\n\n' +
                    `🆔 ID: <code>${item.abituriyent_id}</code>\n` +
                    `👤 Ism: <b>${ism}</b>\n` +
                    `📊 Umumiy Ball: <b>${item.ball}</b>\n` +
                    `🏆 Reyting: <b>#${rank.toLocaleString()}</b> / ${jami.toLocaleString()} ${medal}\n\n` +
                    `🔗 <a href="${detailUrl}">Batafsil</a>`,
                    { 
                        disable_web_page_preview: true,
                        ...Markup.inlineKeyboard([
                            [Markup.button.webApp('🌐 Web ilovani ochish', 'https://mandat-app-web-94.onrender.com/')]
                        ])
                    }
                );
            } else {
                ctx.replyWithHTML(
                    `❌ <b>ID ${query} topilmadi!</b>\n\n` +
                    'Iltimos, to\'g\'ri ID raqamini kiriting.\n' +
                    '💡 <i>Masalan:</i> <code>7088884</code>'
                );
            }
        } else {
            // Ism bo'yicha qidirish
            const found = await searchByName(query);

            if (found.length > 0) {
                let result = `🔍 <b>"${query}" bo'yicha ${found.length} ta natija:</b>\n\n`;
                for (const item of found) {
                    const rank = parseInt(item.reyting);
                    const medal = getMedal(rank);
                    const ism = item.abituriyent_id === '7473030' ? 'HACKER C. A' : item.ism;
                    result += `👤 <b>${ism}</b>\n`;
                    result += `   🆔 <code>${item.abituriyent_id}</code> | `;
                    result += `📊 Ball: <b>${item.ball}</b> | `;
                    result += `🏆 #${rank.toLocaleString()} ${medal}\n\n`;
                }
                result += '📌 Batafsil uchun <b>ID raqamini</b> yuboring.';
                ctx.replyWithHTML(result, {
                    ...Markup.inlineKeyboard([
                        [Markup.button.webApp('🌐 Web ilovani ochish', 'https://mandat-app-web-94.onrender.com/')]
                    ])
                });
            } else {
                ctx.replyWithHTML(
                    `❌ <b>"${query}" bo'yicha hech kim topilmadi!</b>\n\n` +
                    '💡 ID yoki Familiyani to\'g\'ri yozing.\n' +
                    '<i>Masalan:</i> <code>7088884</code> yoki <code>KARIMOV</code>'
                );
            }
        }
    } catch (err) {
        ctx.reply('❌ Xatolik yuz berdi: ' + err.message);
    }
});

// Botni ishga tushirish
const launchBot = () => {
    bot.launch()
        .then(() => console.log('🤖 Telegram bot ishga tushdi!'))
        .catch(err => {
            console.error('❌ Bot ulanishida xato (Boshqa server ishlayapti bo\'lishi mumkin):', err.message);
            console.log('🔄 15 soniyadan so\'ng qayta urinib ko\'ramiz...');
            setTimeout(launchBot, 15000);
        });
};
launchBot();

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
