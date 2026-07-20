/**
 * Supabase Keep-Alive Script
 *
 * This script performs a lightweight request to keep your Supabase project active
 * and reduce the chance of auto-pause due to inactivity.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPaths = [
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '.env'),
  ];

  for (const envPath of envPaths) {
    if (!fs.existsSync(envPath)) {
      continue;
    }

    console.log(`Loading env from: ${envPath}`);
    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return;
      }

      const [key, ...valueParts] = trimmedLine.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');

      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    });

    return true;
  }

  return false;
}

loadEnvFile();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: Missing Supabase credentials.');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? 'set' : 'missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? 'set' : 'missing');
  console.error('');
  console.error('Add these values to .env.local:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

console.log('Supabase Keep-Alive Script Starting...');
console.log(`Project: ${projectRef}`);
console.log(`Time: ${new Date().toISOString()}`);

function pingSupabase() {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/auth/v1/settings`;

    const options = {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    };

    console.log('Pinging Supabase...');

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const status = res.statusCode || 0;
        const responsePreview = data ? data.substring(0, 300) : '(no response body)';

        if (status >= 200 && status < 300) {
          console.log('Success: Supabase is active.');
          console.log(`Status Code: ${status}`);
          resolve({
            ok: true,
            status,
            message: 'Supabase keep-alive ping succeeded.',
          });
          return;
        }

        if (status === 401 || status === 403) {
          reject(
            new Error(
              `Authentication failed (HTTP ${status}). Check NEXT_PUBLIC_SUPABASE_ANON_KEY and project URL. Response: ${responsePreview}`
            )
          );
          return;
        }

        reject(new Error(`Unexpected status code ${status}. Response: ${responsePreview}`));
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout after 10 seconds'));
    });

    req.end();
  });
}

function queryDatabase() {
  return new Promise((resolve, reject) => {
    const url = `${SUPABASE_URL}/rest/v1/your_table_name?select=id&limit=1`;

    const options = {
      method: 'GET',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    };

    console.log('Querying Supabase database...');

    const req = https.request(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('Success: database query completed.');
          console.log(`Response: ${data.substring(0, 100)}...`);
          resolve(true);
          return;
        }

        console.log(`Status code: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        resolve(true);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout after 10 seconds'));
    });

    req.end();
  });
}

pingSupabase()
  .then((result) => {
    console.log('Keep-alive ping completed successfully.');
    console.log(result.message);
    console.log('Next run: schedule this script to run every 3 days.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Keep-alive ping failed.');
    console.error(error.message);
    console.error('Tip: verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.');
    process.exit(1);
  });
