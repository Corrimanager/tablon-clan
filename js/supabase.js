const SUPABASE_URL = "https://ipwxzkdpgbwgdeflzaks.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwd3h6a2RwZ2J3Z2RlZmx6YWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTQ4NDksImV4cCI6MjA3ODM5MDg0OX0.LwtXhr_AY-6f09thVqaUSiop2YvqEEc4X5Vg1-jZQvQ";

const { createClient } = supabase;
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
