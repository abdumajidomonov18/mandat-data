const sql = require('./server/db');

async function check() {
    try {
        console.log('Ulanmoqda...');
        const res = await sql`SELECT COUNT(*) FROM abituriyentlar`;
        console.log(`Jami qatorlar: ${res[0].count}`);
        
        const nullRes = await sql`SELECT COUNT(*) FROM abituriyentlar WHERE ism = 'Topilmadi'`;
        console.log(`Topilmadi deganlar soni: ${nullRes[0].count}`);

        const topRes = await sql`SELECT COUNT(*) FROM abituriyentlar WHERE ism != 'Topilmadi' AND ball > 0`;
        console.log(`Haqiqiy abituriyentlar: ${topRes[0].count}`);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
