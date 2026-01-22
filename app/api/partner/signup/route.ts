import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateRefCode } from '@/lib/referral';
import { hashToken, generatePortalToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { type, firstName, lastName, email, phone, licenseState, licenseNumber, brokerageName, confirmLicensed } = data;

  if (!type || !firstName || !lastName || !email || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (type === 'realtor' && (!licenseState || !licenseNumber || !brokerageName || !confirmLicensed)) {
    return NextResponse.json({ error: 'Missing realtor fields' }, { status: 400 });
  }

  let refCode;
  let tries = 0;
  do {
    refCode = generateRefCode();
    tries++;
    if (tries > 5) return NextResponse.json({ error: 'Could not generate unique refCode' }, { status: 500 });
  } while (await prisma.partner.findUnique({ where: { refCode } }));

  const token = generatePortalToken();
  const tokenHash = hashToken(token);

  try {
    const partner = await prisma.partner.create({
      data: {
        type,
        status: 'active',
        firstName,
        lastName,
        email,
        phone,
        licenseState: licenseState || null,
        licenseNumber: licenseNumber || null,
        brokerageName: brokerageName || null,
        refCode,
        tokenHash,
      },
    });
    const res = NextResponse.json({ partner, token, refCode });
    res.cookies.set('hf_partner', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Email or refCode already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
