import { POST as sendLeadPOST } from "@/app/api/sendLead/route";

export const runtime = "nodejs";

export async function POST(request: Request) {
  return sendLeadPOST(request);
}
