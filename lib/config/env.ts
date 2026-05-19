import "server-only";

type SupabaseServerEnv = {
  supabaseUrl: string;
  serviceRoleKey: string;
};

function readRequired(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }

  return value;
}

export function getSupabaseServerEnv(): SupabaseServerEnv {
  return {
    supabaseUrl: readRequired("NEXT_PUBLIC_SUPABASE_URL"),
    serviceRoleKey: readRequired("SUPABASE_SERVICE_ROLE_KEY"),
  };
}
