import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('hf_partner')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const tokenHash = hashToken(token);
  const partner = await prisma.partner.findUnique({ where: { tokenHash } });
  if (!partner) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  return NextResponse.json({ partner });
}
