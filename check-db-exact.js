const sql = require('./server/db');

async function check() {
    try {
        console.log('Ulanmoqda...');
        const r1 = await sql`SELECT COUNT(*) as c FROM abituriyentlar`;
        const r2 = await sql`SELECT COUNT(*) as c FROM abituriyentlar WHERE ism != 'Topilmadi'`;
        const r3 = await sql`SELECT COUNT(*) as c FROM abituriyentlar WHERE ism != 'Topilmadi' AND ball > 0`;
        const r4 = await sql`SELECT COUNT(*) as c FROM abituriyentlar WHERE ball > 0`;
        
        console.log(`Barcha qatorlar: ${r1[0].c}`);
        console.log(`Ismi bor qatorlar: ${r2[0].c}`);
        console.log(`Ismi bor va ball > 0: ${r3[0].c}`);
        console.log(`Umuman ball > 0: ${r4[0].c}`);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
