// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/esm/supabase.js";

export const supabase = createClient(
  "https://ipwxzkdpgbwgdeflzaks.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwd3h6a2RwZ2J3Z2RlZmx6YWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTQ4NDksImV4cCI6MjA3ODM5MDg0OX0.LwtXhr_AY-6f09thVqaUSiop2YvqEEc4X5Vg1-jZQvQ"
);
