import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, query, orderBy } from 'firebase/firestore';
import { Lead } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const leadsCol = collection(db, 'leads');
    const snapshot = await getDocs(leadsCol); // not ordering to keep it simple for now, can order on client
    
    let leads: Lead[] = [];
    
    if (snapshot.empty) {
      // Seed from local JSON if exists
      try {
        const leadsFilePath = path.join(process.cwd(), 'lib/data/leads.json');
        const data = await fs.readFile(leadsFilePath, 'utf8');
        leads = JSON.parse(data);
        
        for (const lead of leads) {
          await setDoc(doc(db, 'leads', lead.id), lead);
        }
      } catch (e) {
        // No local leads to seed
      }
    } else {
      leads = snapshot.docs.map(doc => doc.data() as Lead);
      // Sort by creation date descending
      leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Firebase Leads GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const lead: Lead = await request.json();
    const ref = doc(db, 'leads', lead.id);
    await setDoc(ref, lead, { merge: true });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Firebase Leads POST Error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { deleteDoc, doc: firestoreDoc } = await import('firebase/firestore');
    await deleteDoc(firestoreDoc(db, 'leads', id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Firebase Leads DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}
