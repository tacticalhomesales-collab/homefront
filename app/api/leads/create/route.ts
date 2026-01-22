import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { refCode, name, phone } = data;
  if (!refCode || !name || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const partner = await prisma.partner.findUnique({ where: { refCode } });
  if (!partner) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 404 });
  }
  const lead = await prisma.lead.create({
    data: {
      partnerId: partner.id,
      name,
      phone,
      status: 'new',
    },
  });
  return NextResponse.json({ lead });
}
