import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Lead } from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'lib/data/leads.json');

async function getLeads(): Promise<Lead[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveLeads(leads: Lead[]) {
  await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
  await fs.writeFile(dataFilePath, JSON.stringify(leads, null, 2), 'utf8');
}

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newLead: Lead = await request.json();
    const leads = await getLeads();
    
    // Check if it's an update or create
    const existingIndex = leads.findIndex(l => l.id === newLead.id);
    if (existingIndex >= 0) {
      leads[existingIndex] = newLead;
    } else {
      leads.push(newLead);
    }
    
    await saveLeads(leads);
    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
