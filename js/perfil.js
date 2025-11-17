import { supabaseClient } from "./supabase.js";

// obtener usuario actual
const { data: { user } } = await supabaseClient.auth.getUser();

if (!user) {
  alert("Debes iniciar sesión.");
  window.location.href = "index.html";
}

// mostrar información del usuario
document.getElementById("perfilNombre").textContent =
  user.user_metadata.nombre ?? "(sin nombre)";

document.getElementById("perfilEmail").textContent = user.email;

document.getElementById("perfilFecha").textContent =
  "Miembro desde: " + new Date(user.created_at).toLocaleDateString();

// estadísticas
const { data: creadas } = await supabaseClient
  .from("misiones")
  .select("id")
  .eq("autor", user.id);

document.getElementById("statsCreadas").textContent =
  creadas?.length ?? 0;

const { data: completadas } = await supabaseClient
  .from("misiones")
  .select("id")
  .eq("completada_por", user.id);

document.getElementById("statsCompletadas").textContent =
  completadas?.length ?? 0;

// avatar opcional
document.getElementById("avatarFoto").src =
  user.user_metadata.avatar_url ??
  "https://i.imgur.com/3jNQF2v.png";
