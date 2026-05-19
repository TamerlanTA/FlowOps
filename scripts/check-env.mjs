import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");

if (existsSync(envPath)) {
  const contents = readFileSync(envPath, "utf8");

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  }
}

const requiredForMvp = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "FLOWOPS_INTERNAL_ACCESS_KEY",
];

const optional = [
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "RESEND_API_KEY",
  "FLOWOPS_NOTIFICATION_EMAIL",
  "N8N_AUDIT_WEBHOOK_URL",
];

function status(name) {
  return process.env[name]?.trim() ? "present" : "missing";
}

console.log("FlowOps environment presence check");
console.log(`.env.local: ${existsSync(envPath) ? "found" : "not found"}`);
console.log("");

let missingRequired = false;

console.log("Required for MVP activation:");
for (const name of requiredForMvp) {
  const current = status(name);
  console.log(`required ${name}: ${current}`);

  if (current === "missing") {
    missingRequired = true;
  }
}

console.log("");
console.log("Optional integrations:");
for (const name of optional) {
  console.log(`optional ${name}: ${status(name)}`);
}

console.log("");
console.log("Resend is optional for MVP activation; email notification is postponed.");
console.log("Preferred free notification path: N8N_AUDIT_WEBHOOK_URL -> n8n -> Telegram.");
console.log("No secret values were printed.");

if (missingRequired) {
  console.error("Missing required environment variables for MVP activation.");
  process.exit(1);
}
