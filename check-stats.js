const sql = require('./server/db');

async function check() {
    try {
        console.log('Ulanmoqda...');
        const res1 = await sql`SELECT COUNT(*) as c FROM abituriyentlar WHERE ism != 'Topilmadi'`;
        const res2 = await sql`SELECT COUNT(*) as c FROM abituriyentlar WHERE ism != 'Topilmadi' AND ball > 0`;
        const res3 = await sql`SELECT COUNT(*) as c FROM abituriyentlar WHERE ism != 'Topilmadi' AND ball = 0`;
        
        console.log(`Hamma ism bor abituriyentlar (0 ball ham): ${res1[0].c}`);
        console.log(`Balli 0 dan katta bo'lganlar (saytda shular chiqadi): ${res2[0].c}`);
        console.log(`Imtihonga kirmagan / nol ball olganlar: ${res3[0].c}`);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
