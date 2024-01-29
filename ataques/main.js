let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 3;
let vidasEnemigo = 3;
let botones = ["boton-fuego", "boton-agua", "boton-tierra"].map((id) =>
  document.getElementById(id)
);
let spanMascotaJugador = document.getElementById("mascota-jugador");

document.getElementById("boton-reiniciar-partida").addEventListener("click", reiniciarPartida);
document.getElementById("boton-reiniciar-juego").addEventListener("click", reiniciarJuegoCompleto);

function iniciarJuego() {
  const nombreJugador = localStorage.getItem("nombre");

  document.querySelector(".subtitulo").innerHTML = nombreJugador
    ? `${nombreJugador}, elegí tu mascota de ataque:`
    : `Elegí tu mascota de ataque:`;

  const nombreMascota = localStorage.getItem("nombreMascota");
  spanMascotaJugador.innerHTML = nombreMascota ? `${nombreMascota} ` : "";

  mascotaRival();

  let partidasJugadas = localStorage.getItem("partidasJugadas") || 0;
  localStorage.setItem("partidasJugadas", ++partidasJugadas);

  botones.forEach((boton) =>
    boton.addEventListener("click", () => atacar(boton.id))
  );

  let botonReiniciar = document.getElementById("boton-reiniciar-partida");
  botonReiniciar.addEventListener("click", reiniciarJuego);
}

function reiniciarJuego() {
  Swal.fire({
    title: 'Antes de reiniciar la partida desde cero, ¿deseas ver los resultados guardados?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      resultadosGuardados();
    } else {
      reiniciarPartidaSinMostrarResultados();
    }
  });
}

function resultadosGuardados() {
  const nombre = localStorage.getItem("nombre") || "";
  const nombreMascota = localStorage.getItem("nombreMascota") || "";
  const partidasJugadas = localStorage.getItem("partidasJugadas") || 0;
  const partidasGanadas = localStorage.getItem("partidasGanadas") || 0;
  const partidasPerdidas = localStorage.getItem("partidasPerdidas") || 0;

  Swal.fire({
    title: 'Resultados guardados:',
    html: `Nombre: ${nombre}<br>
      Nombre mascota: ${nombreMascota}<br>
      Partidas jugadas: ${partidasJugadas}<br>
      Partidas ganadas: ${partidasGanadas}<br>
      Partidas perdidas: ${partidasPerdidas}`,
    confirmButtonText: 'OK',
    
  }).then(() => {
    reiniciarPartida();
    setTimeout(() => {
      location.reload();
    }, 0); //utilicé esta función porque cuando aprieto el boton "ok" Me aparece de nuevo el cartel de SweetAlert y a los segundos me recarga la página..
  });
}

function reiniciarPartida() {
  Swal.fire({
    title: 'Antes de reiniciar la partida desde cero, ¿deseas ver los resultados guardados?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí',
    cancelButtonText: 'No',
  }).then((result) => {
    if (result.isConfirmed) {
      resultadosGuardados();
    } else {
      reiniciarPartidaSinMostrarResultados();
    }
  });
}

function reiniciarPartidaSinMostrarResultados() {
  location.reload();
}

function reiniciarJuegoCompleto() {
  localStorage.clear();

  window.location.href = "../principal/index.html";
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

  revisarVidas();
}

function revisarVidas() {
  if (vidasEnemigo === 0) {
    crearMensajeFinal("La mascota del enemigo se quedó sin vidas! Ganaste!");
    incrementarPartida("partidasGanadas");
  } else if (vidasJugador === 0) {
    crearMensajeFinal("Tu mascota ya no tiene vidas! Perdiste");
    incrementarPartida("partidasPerdidas");
  }
}

function incrementarPartida(tipo) {
  let partidas = localStorage.getItem(tipo) || 0;
  localStorage.setItem(tipo, ++partidas);
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
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

window.addEventListener("load", iniciarJuego);
