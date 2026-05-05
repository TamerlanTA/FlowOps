import "server-only";

import { google } from "googleapis";

import { getEnv } from "@/lib/env";
import { LeadPayload } from "@/lib/lead";

type GoogleSheetsCredentials = {
  client_email: string;
  private_key: string;
  spreadsheet_id?: string;
  spreadsheetId?: string;
  sheet_name?: string;
  sheetName?: string;
};

function parseGoogleSheetsCredentials(raw: string): GoogleSheetsCredentials {
  const parse = (value: string) => JSON.parse(value) as GoogleSheetsCredentials;

  try {
    return parse(raw);
  } catch {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    return parse(decoded);
  }
}

function normalizeSheetName(sheetName: string): string {
  const trimmed = sheetName.trim();
  return trimmed.length > 0 ? trimmed : "Leads";
}

function toSheetRange(sheetName: string): string {
  // Quote sheet names to safely support spaces/special chars.
  const escapedName = sheetName.replace(/'/g, "''");
  return `'${escapedName}'!A:I`;
}

export async function saveLeadToGoogleSheets(
  lead: LeadPayload,
  leadId: string,
): Promise<void> {
  const env = getEnv();
  const credentials = parseGoogleSheetsCredentials(env.GOOGLE_SHEETS_CREDENTIALS);

  const spreadsheetId =
    credentials.spreadsheet_id ?? credentials.spreadsheetId ?? "";

  if (!spreadsheetId) {
    throw new Error(
      "Missing spreadsheet ID in GOOGLE_SHEETS_CREDENTIALS (spreadsheet_id).",
    );
  }

  const sheetName = normalizeSheetName(
    credentials.sheet_name ?? credentials.sheetName ?? "Leads",
  );

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const range = toSheetRange(sheetName);

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties.title",
  });

  const hasSheet = Boolean(
    spreadsheet.data.sheets?.some(
      (sheet) => sheet.properties?.title === sheetName,
    ),
  );

  if (!hasSheet) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          leadId,
          lead.name,
          lead.company,
          lead.businessType,
          lead.revenueRange,
          lead.problemDescription,
          lead.email,
          lead.whatsapp,
        ],
      ],
    },
  });
}
