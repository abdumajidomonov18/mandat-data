const sql = require('./server/db');

async function test() {
    try {
        const minScore = 41.1;
        const maxScore = 41.2;
        const results = await sql`
            SELECT *
            FROM abituriyentlar
            WHERE ball >= ${parseFloat(minScore)}::real
            AND ball <= ${parseFloat(maxScore)}::real
            LIMIT 5
        `;
        console.log(`Found: ${results.length} results`);
        if (results.length > 0) {
            console.log(results[0].ball);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
test();
