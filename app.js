// app.js

let recursos = { Albura: 50, Arcilla: 100, Juncos: 75, Piedra: 100 };

let misiones = JSON.parse(localStorage.getItem("misiones")) || [];
let completadas = JSON.parse(localStorage.getItem("completadas")) || [];

function guardar() {
    localStorage.setItem("misiones", JSON.stringify(misiones));
    localStorage.setItem("completadas", JSON.stringify(completadas));
}

function inicializarForm() {
    const stacks = document.getElementById("stacks");
    const recurso = document.getElementById("recurso");
    const titulo = document.getElementById("titulo");

    stacks.innerHTML = "<option value=''>Stacks</option>";
    for (let i = 1; i <= 36; i++) {
        stacks.innerHTML += `<option>${i}</option>`;
    }

    recurso.innerHTML = "<option value=''>Recurso</option>";
    Object.keys(recursos).forEach(r => {
        recurso.innerHTML += `<option>${r}</option>`;
    });

    function updateTitle() {
        if (stacks.value && recurso.value) {
            titulo.value = `Recolectar ${stacks.value} stacks de ${recurso.value}`;
        } else titulo.value = "";
    }

    stacks.onchange = updateTitle;
    recurso.onchange = updateTitle;
}

document.getElementById("formMision").addEventListener("submit", e => {
    e.preventDefault();

    const nueva = {
        id: Date.now(),
        titulo: titulo.value,
        recurso: recurso.value,
        stack: stacks.value,
        oro: oro.value,
        fecha: new Date().toLocaleDateString()
    };

    misiones.push(nueva);
    guardar();
    renderMisiones();
    e.target.reset();
});

function renderMisiones() {
    const cont = document.getElementById("listaMisiones");
    cont.innerHTML = "";

    misiones.forEach(m => {
        cont.innerHTML += `
            <div class="mision">
                <h3>${m.titulo}</h3>
                <p>Recurso: ${m.recurso}</p>
                <p>Stacks: ${m.stack}</p>
                <p>Oro: ${m.oro}</p>
                <button onclick="completar(${m.id})">Completar</button>
            </div>
        `;
    });
}

function completar(id) {
    const m = misiones.find(x => x.id === id);
    completadas.push(m);
    misiones = misiones.filter(x => x.id !== id);
    guardar();
    renderMisiones();
    renderCompletadas();
}

function renderCompletadas() {
    const cont = document.getElementById("listaCompletadas");
    cont.innerHTML = "";
    completadas.forEach(m => {
        cont.innerHTML += `
            <div class="mision">
                <h3>${m.titulo}</h3>
                <p>Completada ✔</p>
            </div>
        `;
    });
}

async function cerrarSesion() {
    try {
        await supabase.auth.signOut();
    } catch (e) {
        console.error("Error cerrando sesión:", e);
    }

    localStorage.clear();
    window.location.href = "login.html";
}

window.cerrarSesion = cerrarSesion;


inicializarForm();
renderMisiones();
renderCompletadas();
