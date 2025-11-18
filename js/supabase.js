// ================================
// CONFIGURACIÓN SUPABASE (DEFINITIVA)
// ================================

// 👉 Reemplazá estos valores con tus claves reales:
const SUPABASE_URL = "https://ipwxzkdpgbwgdeflzaks.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwd3h6a2RwZ2J3Z2RlZmx6YWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTQ4NDksImV4cCI6MjA3ODM5MDg0OX0.LwtXhr_AY-6f09thVqaUSiop2YvqEEc4X5Vg1-jZQvQ";

// 👉 Crear cliente Supabase usando sessionStorage
//    para borrar la sesión cuando se cierre la pestaña.
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: sessionStorage,       // ❗ SOLO DURA LA PESTAÑA ABIERTA
        persistSession: false,         // ❗ No guarda sesión entre visitas
        autoRefreshToken: false,       // ❗ Evita que renueve sesión en segundo plano
        detectSessionInUrl: true
    }
});

// ================================
// LOGOUT (para cerrar sesión desde el menú)
// ================================

async function logout() {
    await supabase.auth.signOut();
    sessionStorage.clear();
    window.location.href = "login.html";
}
