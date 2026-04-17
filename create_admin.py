import urllib.request
import json
import os
import hashlib

# parse env
env = {}
with open('.env.local', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            env[k] = v

url = env.get('NEXT_PUBLIC_SUPABASE_URL')
key = env.get('SUPABASE_SERVICE_ROLE_KEY') or env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')
hash_pwd = hashlib.sha256('29183627Mae'.encode()).hexdigest()

data = {
    'email': 'victordeassis2010@hotmail.com',
    'password_hash': hash_pwd,
    'name': 'Victor Assis',
    'type': 'admin',
    'plan': 'pro',
    'status': 'active'
}

req = urllib.request.Request(
    f"{url}/rest/v1/users",
    data=json.dumps(data).encode(),
    headers={
        'apikey': key,
        'Authorization': f"Bearer {key}",
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    },
    method='POST'
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
        print("User created successfully.")
except urllib.error.HTTPError as e:
    print(f"Error: {e.code} {e.reason}")
    print(e.read().decode())
