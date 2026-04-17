require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function createAdmin() {
  const hash = crypto.createHash('sha256').update('29183627Mae').digest('hex');
  const { data, error } = await supabase.from('users').upsert({
    email: 'victordeassis2010@hotmail.com',
    password_hash: hash,
    name: 'Victor Assis',
    type: 'admin',
    plan: 'pro',
    status: 'active'
  }, { onConflict: 'email' }).select();
  
  if (error) {
    console.error('Error creating user:', error);
  } else {
    console.log('User created/updated successfully:', data);
  }
}
createAdmin();
