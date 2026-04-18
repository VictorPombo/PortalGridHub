const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing config");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .normalize('NFD') // Remove accents
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

async function migrate() {
  console.log("Fetching users...");
  const { data: users, error } = await supabase.from('users').select('*');
  if (error) {
    console.error("Error fetching users:", error);
    return;
  }

  console.log(`Found ${users.length} users. Migrating slugs and names...`);
  
  for (const user of users) {
    if (!user.name) continue;
    
    // Normalize logic
    const nome_normalizado = user.name.toString().toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
      
    // Create base slug
    let baseSlug = slugify(user.name);
    let newSlug = baseSlug;
    
    // Use user.slug if they have one already
    if (user.slug) {
       newSlug = user.slug;
    } else {
       // Avoid duplicates
       let suffix = 1;
       while (true) {
         const { data: existing } = await supabase.from('users').select('id').eq('slug', newSlug).neq('id', user.id).single();
         if (!existing) break;
         newSlug = `${baseSlug}-${suffix}`;
         suffix++;
       }
    }
    
    console.log(`Updating ${user.name} -> ${newSlug} / ${nome_normalizado}`);
    await supabase.from('users').update({
       slug: newSlug,
       nome_normalizado: nome_normalizado
    }).eq('id', user.id);
  }
  
  console.log("Done updating users.");
}

migrate();
