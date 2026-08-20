const sql = require('./server/db');

async function check() {
    try {
        console.log('Ulanmoqda...');
        const jami = await sql`SELECT COUNT(*) as c FROM abituriyentlar WHERE ism != 'Topilmadi'`;
        const res = await sql`
            SELECT * FROM (
                SELECT *, RANK() OVER (ORDER BY ball DESC) as reyting
                FROM abituriyentlar
                WHERE ism != 'Topilmadi'
            ) as subquery
            WHERE abituriyent_id = '7088884'
        `;
        
        console.log(`Jami qator: ${jami[0].c}`);
        console.log(res[0]);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
check();
