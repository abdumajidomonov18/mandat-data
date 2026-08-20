const sql = require('./server/db');

async function testRank() {
    try {
        console.log('Testing rank query...');
        const results = await sql`
            SELECT *, 
                (SELECT COUNT(*) + 1 FROM abituriyentlar r WHERE r.ball > a.ball AND r.ism != 'Topilmadi') as reyting
            FROM abituriyentlar a
            WHERE abituriyent_id = '7088884'
            AND ism != 'Topilmadi'
        `;
        console.log(results[0]);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
testRank();
