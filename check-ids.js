const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const CSV_FILE = path.join(__dirname, '..', 'abituriyentlar_mandat.csv');

let maxId = 0;
let hasNonNumeric = false;
let nonNumericSample = '';

fs.createReadStream(CSV_FILE)
  .pipe(csv())
  .on('data', (row) => {
    let rawId = row['Abituriyent ID'] || row['\uFEFFAbituriyent ID'] || '';
    rawId = rawId.trim();
    if (rawId) {
       if (!/^\d+$/.test(rawId)) {
           hasNonNumeric = true;
           nonNumericSample = rawId;
       } else {
           const num = parseInt(rawId, 10);
           if (num > maxId) maxId = num;
       }
    }
  })
  .on('end', () => {
    console.log(`Max ID: ${maxId}`);
    console.log(`Has non-numeric? ${hasNonNumeric} (Sample: ${nonNumericSample})`);
  });
