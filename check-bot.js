const sql = require('./server/db');

async function getTotal() {
    const result = await sql`SELECT COUNT(*) as jami FROM abituriyentlar WHERE ism != 'Topilmadi'`;
    return parseInt(result[0].jami);
}

getTotal().then(console.log);
