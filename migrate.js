import { db } from './lib/firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  console.log('Migrating Country Rules...');
  const rulesPath = path.join(__dirname, 'lib/data/country-rules.json');
  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8'));
  
  for (const rule of rules) {
    await setDoc(doc(db, 'rules', rule.id), rule);
    console.log(`Migrated rule: ${rule.name}`);
  }

  console.log('Migrating Leads...');
  const leadsPath = path.join(__dirname, 'lib/data/leads.json');
  if (fs.existsSync(leadsPath)) {
    const leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8'));
    for (const lead of leads) {
      await setDoc(doc(db, 'leads', lead.id), lead);
      console.log(`Migrated lead: ${lead.name}`);
    }
  }

  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(console.error);
