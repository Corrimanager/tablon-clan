const SUPABASE_URL = "https://ipwxzkdpgbwgdeflzaks.supabase.co";
const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

const { createClient } = supabase;
window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
