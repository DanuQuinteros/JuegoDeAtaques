console.log('hoaa');

let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 3;
let vidasEnemigo = 3;
let botones = ["boton-fuego", "boton-agua", "boton-tierra"].map((id) =>
  document.getElementById(id)
);
let sectionSeleccionarAtaque = document.getElementById("seleccionar-ataque");
let sectionReiniciar = document.getElementById("reiniciar");
let spanMascotaJugador = document.getElementById("mascota-jugador");

function iniciarJuego() {


  const nombreMascota = localStorage.getItem("nombreMascota");
  spanMascotaJugador.innerHTML = nombreMascota ? `${nombreMascota} ` : "";

  let partidasJugadas = localStorage.getItem("partidasJugadas") || 0;
  localStorage.setItem("partidasJugadas", ++partidasJugadas);


  botones.forEach((boton) =>
    boton.addEventListener("click", () => atacar(boton.id))
  );

  let botonReiniciar = document.getElementById("boton-reiniciar");
  botonReiniciar.addEventListener("click", reiniciarJuego);
}

function reiniciarJuego() {
  Swal.fire({
    title: '¿Estás seguro de reiniciar el juego?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, reiniciar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      // Si el usuario confirma, eliminar datos del localStorage y redirigir a ../principal/index.html
      localStorage.removeItem("nombreMascota");
      // spanMascotaJugador.innerHTML = "";
      localStorage.removeItem("nombre");
      document.querySelector(".subtitulo").innerHTML = "Elije tu mascota de ataque:";
      window.location.href = "../principal/index.html";
    }
  });
}

function mascotaRival() {
  let seleccionarMascotaRival = aleatorio(1, 6);
  let spanMascotaRival = document.getElementById("mascota-rival");
  spanMascotaRival.innerHTML =
    ["Bambola", "Rufo", "Slade", "Riker", "Ronnie", "Pipo"][
      seleccionarMascotaRival - 1
    ] + " ";
}

function atacar(idBoton) {
  let tiposAtaque = {
    "boton-fuego": "FUEGO🔥",
    "boton-agua": "AGUA💧",
    "boton-tierra": "TIERRA🌱",
  };
  ataqueJugador = tiposAtaque[idBoton];
  ataqueAleatorioRival();
}

function ataqueAleatorioRival() {
  let tiposAtaque = ["FUEGO🔥", "AGUA💧", "TIERRA🌱"];
  ataqueEnemigo = tiposAtaque[aleatorio(0, 2)];
  combate();
}

function combate() {
  let spanVidasJugador = document.getElementById("vidas-mascota-jugador");
  let spanVidasEnemigo = document.getElementById("vidas-mascota-rival");

  if (ataqueJugador == ataqueEnemigo) {
    crearMensajes("EMPATE.");
  } else if (
    (ataqueJugador == "AGUA💧" && ataqueEnemigo == "FUEGO🔥") ||
    (ataqueJugador == "FUEGO🔥" && ataqueEnemigo == "TIERRA🌱") ||
    (ataqueJugador == "TIERRA🌱" && ataqueEnemigo == "AGUA💧")
  ) {
    crearMensajes("GANASTE!!");
    vidasEnemigo--;
    spanVidasEnemigo.innerHTML = vidasEnemigo;
  } else {
    crearMensajes("PERDISTE!");
    vidasJugador--;
    spanVidasJugador.innerHTML = vidasJugador;
  }
  localStorage.setItem("vidasJugador", vidasJugador);
  localStorage.setItem("vidasEnemigo", vidasEnemigo);
  revisarVidas();
}

function revisarVidas() {
  if (vidasEnemigo === 0) {
    crearMensajeFinal("La mascota del enemigo se quedó sin vidas! Ganaste!");
  } else if (vidasJugador === 0) {
    crearMensajeFinal("Tu mascota ya no tiene vidas! Perdiste");
  }
}

function deshabilitarBotones() {
  botones.forEach((boton) => {
    boton.disabled = true;
    boton.style.backgroundColor = "grey";
    boton.innerHTML = "X";
  });
}

function crearMensajes(resultado) {
  let sectionMensajes = document.getElementById("resultado");
  let ataqueDelJugador = document.getElementById("ataque-del-jugador");
  let ataqueDelEnemigo = document.getElementById("ataque-del-enemigo");

  ataqueDelJugador.innerHTML = "";
  ataqueDelEnemigo.innerHTML = "";

  let nuevoAtaqueJugador = document.createElement("p");
  let nuevoAtaqueEnemigo = document.createElement("p");

  nuevoAtaqueJugador.innerHTML = `Elegiste ${ataqueJugador}`;
  nuevoAtaqueEnemigo.innerHTML = `El enemigo eligió ${ataqueEnemigo}`;

  sectionMensajes.innerHTML = resultado;

  ataqueDelJugador.appendChild(nuevoAtaqueJugador);
  ataqueDelEnemigo.appendChild(nuevoAtaqueEnemigo);
}

function crearMensajeFinal(resultadoFinal) {
  let sectionMensajes = document.getElementById("mensajes");
  let parrafo = document.createElement("p");

  parrafo.innerHTML = resultadoFinal;
  parrafo.style.marginTop = "270px";

  sectionMensajes.appendChild(parrafo);
  deshabilitarBotones();
  sectionReiniciar.style.display = "block";
}

function reiniciarJuego() {
  localStorage.removeItem("mascotaSeleccionada");
  localStorage.removeItem("vidasJugador");
  localStorage.removeItem("vidasEnemigo");
  location.reload();
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", iniciarJuego);
