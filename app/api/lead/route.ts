import { google } from "googleapis";
import fs from "fs";
import path from "path";

type LeadPayload = {
  name: string;
  phone: string;
  email?: string;
  notes?: string;

  audience?: string;
  role?: string;
  years_of_service?: string;
  mission?: string;
  location?: string;
  branch?: string;
  paygrade?: string;
  ref?: string;
};

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function loadServiceAccountCredentials() {
  const keyFile = mustEnv("GOOGLE_SERVICE_ACCOUNT_KEY_FILE");
  const keyPath = path.join(process.cwd(), keyFile);
  const raw = fs.readFileSync(keyPath, "utf8");
  return JSON.parse(raw);
}

function getDateAndTime() {
  // Change this if you want a different timezone
  const tz = "America/Los_Angeles";
  const now = new Date();

  const date = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(now);

  return { date, time };
}

export async function POST(req: Request) {
  try {
    const sheetId = mustEnv("GOOGLE_SHEET_ID");
    const tab = process.env.GOOGLE_SHEET_TAB || "Leads";
    const credentials = loadServiceAccountCredentials();

    const body = (await req.json()) as LeadPayload;

    const { date, time } = getDateAndTime();

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Column order (A:N) must match your Sheet headers:
    // Date | Time | Name | Phone | Email | Notes | Audience | Role | Years of Service | Mission | Location | Branch | Paygrade | Ref
    const row = [
      date,
      time,
      body.name ?? "",
      body.phone ?? "",
      body.email ?? "",
      body.notes ?? "",
      body.audience ?? "",
      body.role ?? "",
      body.years_of_service ?? "",
      body.mission ?? "",
      body.location ?? "",
      body.branch ?? "",
      body.paygrade ?? "",
      body.ref ?? "",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tab}!A:N`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });

    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
