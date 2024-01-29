let sectionSeleccionarMascota = document.getElementById("seleccionar-mascota");
let sectionReiniciar = document.getElementById("reiniciar");

function iniciarJuego() {
  const nombreJugador = localStorage.getItem("nombre");

  document.querySelector(".subtitulo").innerHTML = nombreJugador
    ? `Hola ${nombreJugador}, elegí tu mascota de ataque:`
    : `Elegí una mascota de ataque:`;

  let botonMascota = document.getElementById("boton-mascota");
  botonMascota.addEventListener("click", seleccionarMascota);

  let botonReiniciar = document.getElementById("boton-reiniciar");
  botonReiniciar.addEventListener("click", reiniciarJuego);
}

function seleccionarMascota() {
  const $ = (selector) => document.getElementById(selector);
  let nombreMascota =
    [...["bambola", "rufo", "slade", "riker", "ronnie", "pipo"].map($)].find(
      (b) => b.checked
    )?.id || "";

  if (!nombreMascota) {
    alert("Elige una mascota!");
    reiniciarJuego();
    return;
  }

  localStorage.setItem("nombreMascota", nombreMascota);
  window.location.href = `../ataques/index.html`;
}

function reiniciarJuego() {
  Swal.fire({
    title: "¿Estás seguro de reiniciar el juego?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Reiniciar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("nombreMascota");
      localStorage.removeItem("nombre");
      document.querySelector(".subtitulo").innerHTML =
        "Elije tu mascota de ataque:";
      window.location.href = "../principal/index.html";
    }
  });
}

window.addEventListener("load", iniciarJuego);
