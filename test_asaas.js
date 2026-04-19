require('dotenv').config({ path: '.env.local' });
const API_URL = "https://api.asaas.com/v3";
const KEY = process.env.ASAAS_API_KEY.replace(/\\/g, ''); // Fix escape

async function run() {
  const res = await fetch(`${API_URL}/payments?subscription=sub_dadtjxj5985gr5lc`, {
    headers: { 'access_token': KEY }
  });
  const data = await res.json();
  console.log(data);
}
run();
