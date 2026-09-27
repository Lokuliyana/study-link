import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { CustomField } from '@/lib/types';

const CUSTOM_FIELDS_DOC = 'meta/customFields';

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'customFields'));
    const fields: CustomField[] = snapshot.docs.map(d => d.data() as CustomField);
    return NextResponse.json(fields);
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    const field: CustomField = await request.json();
    await setDoc(doc(db, 'customFields', field.key), field);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save field' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();
    await deleteDoc(doc(db, 'customFields', key));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete field' }, { status: 500 });
  }
}
