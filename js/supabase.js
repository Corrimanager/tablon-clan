// ---- Inicializar Supabase ----
const supabaseUrl = "https://ipwxzkdpgbwgdeflzaks.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwd3h6a2RwZ2J3Z2RlZmx6YWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MTQ4NDksImV4cCI6MjA3ODM5MDg0OX0.LwtXhr_AY-6f09thVqaUSiop2YvqEEc4X5Vg1-jZQvQ";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ---- Función para cerrar sesión ----
async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("sessionStart");
    window.location.href = "login.html";
}

// ---- Proteger páginas internas (index, perfil, historial) ----
async function requireAuth() {
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
        window.location.href = "login.html";
        return;
    }

    // Forzar expiración a 12 horas
    const start = localStorage.getItem("sessionStart");
    if (start && Date.now() - parseInt(start) > 12 * 60 * 60 * 1000) {
        await logout();
        return;
    }
}

// ---- Guardar inicio de sesión ----
function markLoginMoment() {
    localStorage.setItem("sessionStart", Date.now());
}
