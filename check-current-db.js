const sql = require('./server/db');

async function check() {
    try {
        console.log('Ulanmoqda...');
        const res1 = await sql`SELECT COUNT(*) as c FROM abituriyentlar`;
        const res2 = await sql`SELECT COUNT(*) as c FROM abituriyentlar WHERE ism != 'Topilmadi'`;
        
        console.log(`Barcha qatorlar: ${res1[0].c}`);
        console.log(`Ismi bor qatorlar: ${res2[0].c}`);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
