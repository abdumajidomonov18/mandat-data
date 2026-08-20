const sql = require('./server/db');

async function clean() {
    try {
        console.log('Ulanmoqda...');
        const result = await sql`DELETE FROM abituriyentlar WHERE ism = 'Topilmadi' OR ism = 'Topilmadi"'`;
        console.log(`✅ Bazadan ${result.count} ta axlat yozuv o'chirildi!`);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
clean();
