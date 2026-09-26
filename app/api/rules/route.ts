import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { CountryRule } from '@/lib/types';

const rulesFilePath = path.join(process.cwd(), 'lib/data/country-rules.json');

export async function GET() {
  try {
    const data = await fs.readFile(rulesFilePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read rules' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedRules: CountryRule[] = await request.json();
    await fs.writeFile(rulesFilePath, JSON.stringify(updatedRules, null, 2), 'utf8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save rules' }, { status: 500 });
  }
}
