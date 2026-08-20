const sql = require('./server/db');

async function test() {
    const res = await sql`SELECT ball FROM abituriyentlar WHERE abituriyent_id = '7088884'`;
    console.log("DB value:", res[0].ball);
    console.log("DB value >= 41.1:", res[0].ball >= 41.1);
    
    // Check column type
    const cols = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'abituriyentlar' AND column_name = 'ball'
    `;
    console.log("Column type:", cols[0].data_type);
    process.exit(0);
}
test();
