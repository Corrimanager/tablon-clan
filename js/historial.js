import { supabaseClient } from "./supabase.js";

const { data: { user } } = await supabaseClient.auth.getUser();

if (!user) {
  alert("Debes iniciar sesión.");
  window.location.href = "index.html";
}

// obtener misiones creadas o completadas por el usuario
const { data: misiones } = await supabaseClient
  .from("misiones")
  .select("*")
  .or(`autor.eq.${user.id},completada_por.eq.${user.id}`)
  .order("fecha_creacion", { ascending: false });

const cont = document.getElementById("listaHistorial");

if (!misiones || misiones.length === 0) {
  cont.innerHTML = "<p>No tienes misiones en tu historial.</p>";
}

misiones.forEach(m => {
  const card = document.createElement("div");
  card.className = "historialCard";

  card.innerHTML = `
    <h3>${m.titulo}</h3>
    <p>Recurso: ${m.recurso} (${m.stacks} stacks)</p>
    <p>Oro: ${m.oro}</p>
    <p>Creada: ${new Date(m.fecha_creacion).toLocaleDateString()}</p>
    <p>${m.completada_por ? "✔ Completada" : "⏳ Pendiente"}</p>
  `;

  cont.appendChild(card);
});
