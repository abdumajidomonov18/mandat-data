const sql = require('./server/db');

async function test() {
    const res = await sql`SELECT (41.1::real >= 41.1::double precision) as is_greater_or_equal`;
    console.log(res[0]);
    process.exit(0);
}
test();
