import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { CountryRule } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const rulesCol = collection(db, 'rules');
    const snapshot = await getDocs(rulesCol);
    
    let rules: CountryRule[] = [];
    
    if (snapshot.empty) {
      // Seed the database from local JSON if empty
      const rulesFilePath = path.join(process.cwd(), 'lib/data/country-rules.json');
      const data = await fs.readFile(rulesFilePath, 'utf8');
      rules = JSON.parse(data);
      
      const batch = writeBatch(db);
      rules.forEach(rule => {
        const ref = doc(db, 'rules', rule.id);
        batch.set(ref, rule);
      });
      await batch.commit();
    } else {
      rules = snapshot.docs.map(doc => doc.data() as CountryRule);
    }
    
    return NextResponse.json(rules);
  } catch (error) {
    console.error('Firebase Rules GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedRules: CountryRule[] = await request.json();
    const batch = writeBatch(db);
    
    updatedRules.forEach(rule => {
      const ref = doc(db, 'rules', rule.id);
      batch.set(ref, rule);
    });
    
    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Firebase Rules POST Error:', error);
    return NextResponse.json({ error: 'Failed to save rules' }, { status: 500 });
  }
}
