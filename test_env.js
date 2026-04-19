const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const match = envFile.match(/ASAAS_API_KEY=(.*)/);
console.log("Raw in file:", match ? match[1] : "not found");
