// Supabase client factory that gracefully handles missing dependency
// The @supabase/supabase-js package is optional and must be installed separately

type SupabaseClient = any;

let supabaseClientInstance: SupabaseClient | null = null;
let initializationAttempted = false;
let initializationSucceeded = false;

export function getSupabaseClient(): SupabaseClient | null {
  return supabaseClientInstance;
}

export function isSupabaseReady(): boolean {
  return initializationSucceeded && supabaseClientInstance !== null;
}

// Helper to initialize Supabase if the package is available
export async function initializeSupabase(): Promise<SupabaseClient | null> {
  if (initializationAttempted) {
    return supabaseClientInstance;
  }

  initializationAttempted = true;

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    // Use eval to bypass TypeScript checking for optional dependency
    const importSupabase = new Function(
      'return import("@supabase/supabase-js")',
    );
    const supabaseModule = await importSupabase();
    const { createClient } = supabaseModule;
    supabaseClientInstance = createClient(supabaseUrl, supabaseAnonKey);
    initializationSucceeded = true;
    return supabaseClientInstance;
  } catch (_error) {
    console.warn(
      "Supabase package not available. Install @supabase/supabase-js to enable Supabase integration.",
    );
    initializationSucceeded = false;
    return null;
  }
}
