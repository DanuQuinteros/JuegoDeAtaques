let ataqueJugador;
let ataqueEnemigo;
let vidasJugador = 3;
let vidasEnemigo = 3;
let botones = ["boton-fuego", "boton-agua", "boton-tierra"].map((id) =>
  document.getElementById(id)
);
let spanMascotaJugador = document.getElementById("mascota-jugador");

document
  .getElementById("boton-reiniciar-partida")
  .addEventListener("click", reiniciarPartida);
document
  .getElementById("boton-reiniciar-juego")
  .addEventListener("click", reiniciarJuegoCompleto);

const apiUrl = "https://jsonplaceholder.typicode.com/users";

// Usa fetch para obtener nombres.
fetch(apiUrl)
  .then((response) => response.json())
  .then((users) => {
    // guardar 3 nombres (para despues poder utilizar en el top4.)
    const nombres = users.slice(0, 3).map((user) => user.name);
    localStorage.setItem("nombresJugadores", JSON.stringify(nombres));
  })
  .catch((error) => console.error("Error al obtener nombres:", error));

// guardar los nombres de los jugadores aleatorios.
const nombresJugadores =
  JSON.parse(localStorage.getItem("nombresJugadores")) || [];

// Agrega información aleatoria de partidas a cada nombre aleatorio
const jugadores = nombresJugadores.map((nombre) => ({
  nombre,
  partidasGanadas: Math.floor(Math.random() * (35 - 5 + 1) + 5),
  partidasPerdidas: Math.floor(Math.random() * (35 - 5 + 1) + 5),
  partidasJugadas: Math.floor(Math.random() * (35 - 5 + 1) + 5),
}));

// Agrega el jugador actual a la lista de jugadores aleatorios
const nombreJugador = localStorage.getItem("nombre");
const partidasGanadasJugadorActual =
  localStorage.getItem("partidasGanadas") || 0;

if (nombreJugador) {
  jugadores.push({
    nombre: nombreJugador,
    partidasGanadas: parseInt(partidasGanadasJugadorActual),
    partidasPerdidas: 0,
    partidasJugadas: 0,
  });
}

const topJugadores = jugadores
  .sort((a, b) => b.partidasGanadas - a.partidasGanadas)
  .slice(0, 3);

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

function incrementarPartida(tipo) {
  let partidas = localStorage.getItem(tipo) || 0;

  if (tipo === "partidasGanadas") {
    localStorage.setItem(tipo, ++partidas);
  } else if (tipo === "partidasPerdidas") {
    localStorage.setItem(tipo, ++partidas);
  }
}

function reiniciarJuego() {
  Swal.fire({
    title:
      "Antes de reiniciar la partida desde cero, ¿deseas ver los resultados guardados?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
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
    title: "Resultados guardados:",
    html: `Nombre: ${nombre}<br>
      Nombre mascota: ${nombreMascota}<br>
      Partidas jugadas: ${partidasJugadas}<br>
      Partidas ganadas: ${partidasGanadas}<br>
      Partidas perdidas: ${partidasPerdidas}`,
    confirmButtonText: "OK",
  }).then(() => {
    reiniciarPartida();
    setTimeout(() => {
      location.reload();
    }, 0); //utilicé esta función porque cuando aprieto el boton "ok" Me aparece de nuevo el cartel de SweetAlert y a los segundos me recarga la página..
  });
}

function reiniciarPartida() {
  Swal.fire({
    title:
      "Antes de reiniciar la partida desde cero, ¿deseas ver los resultados guardados?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
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

//Actualizo las partidas ganadas del jugador actual, para que se vea reflejado despues de hacer click en el boton top4.
//Decidi utilizar esta funcion porque no se me actualizaba directamente el jugador actual desde el localStore.
function actualizarJugador() {
  const nombreJugador = localStorage.getItem("nombre");
  const partidasGanadasJugadorActual =
    parseInt(localStorage.getItem("partidasGanadas")) || 0;

  const jugadorActual = jugadores.find(
    (jugador) => jugador.nombre === nombreJugador
  );
  if (jugadorActual) {
    jugadorActual.partidasGanadas = partidasGanadasJugadorActual;
  }
}

const botonTopGanadores = document.getElementById("boton-top-ganadores");
botonTopGanadores.addEventListener("click", mostrarTopGanadores);

function mostrarTopGanadores() {
  actualizarJugador();

  const topGanadores = jugadores
    .sort((a, b) => b.partidasGanadas - a.partidasGanadas)
    .slice(0, 4);

  let mensaje = "<h2>Top 4 Ganadores</h2>";
  topGanadores.forEach((jugador, index) => {
    mensaje += `<p>${index + 1}. ${jugador.nombre} - Partidas Ganadas: ${
      jugador.partidasGanadas
    }</p>`;
  });

  Swal.fire({
    html: mensaje,
    confirmButtonText: "OK",
  });
}

window.addEventListener("load", iniciarJuego);

// let ataqueJugador;
// let ataqueEnemigo;
// let vidasJugador = 3;
// let vidasEnemigo = 3;
// let botones = ["boton-fuego", "boton-agua", "boton-tierra"].map((id) =>
//   document.getElementById(id)
// );
// let spanMascotaJugador = document.getElementById("mascota-jugador");

// document
//   .getElementById("boton-reiniciar-partida")
//   .addEventListener("click", reiniciarPartida);
// document
//   .getElementById("boton-reiniciar-juego")
//   .addEventListener("click", reiniciarJuegoCompleto);

// // Utilice esta API que genera nombres de usuarios. Luego use fetch para obtenerlos. Filtre y guarde solo 3 en localStorage para el "top4" 3 nombres y el jugador.
// const apiUrl = "https://jsonplaceholder.typicode.com/users";

// // Usa fetch para obtener nombres simulados
// fetch(apiUrl)
//   .then((response) => response.json())
//   .then((users) => {
//     // Filtra los nombres y guarda solo tres en localStorage
//     const nombres = users.slice(0, 3).map((user) => user.name);
//     localStorage.setItem("nombresSimulados", JSON.stringify(nombres));
//   })
//   .catch((error) => console.error("Error al obtener nombres:", error));

// const nombresSimulados =
//   JSON.parse(localStorage.getItem("nombresSimulados")) || [];

// const jugadores = nombresSimulados.map((nombre) => ({
//   nombre,
//   partidasGanadas: Math.floor(Math.random() * (35 - 5 + 1) + 5),
//   partidasPerdidas: Math.floor(Math.random() * (35 - 5 + 1) + 5),
//   partidasJugadas: Math.floor(Math.random() * (35 - 5 + 1) + 5),
// }));

// const nombreJugador = localStorage.getItem("nombre");
// const partidasGanadasJugadorActual =
//   localStorage.getItem("partidasGanadas") || 0;

// if (nombreJugador) {
//   jugadores.push({
//     nombre: nombreJugador,
//     partidasGanadas: parseInt(partidasGanadasJugadorActual),
//     partidasPerdidas: 0,
//     partidasJugadas: 0,
//   });
// }

// const topJugadores = jugadores
//   .sort((a, b) => b.partidasGanadas - a.partidasGanadas)
//   .slice(0, 3);

// function iniciarJuego() {
//   const nombreJugador = localStorage.getItem("nombre");

//   document.querySelector(".subtitulo").innerHTML = nombreJugador
//     ? `${nombreJugador}, elegí tu mascota de ataque:`
//     : `Elegí tu mascota de ataque:`;

//   const nombreMascota = localStorage.getItem("nombreMascota");
//   spanMascotaJugador.innerHTML = nombreMascota ? `${nombreMascota} ` : "";

//   mascotaRival();

//   // let partidasJugadas = localStorage.getItem("partidasJugadas") || 0;
//   // localStorage.setItem("partidasJugadas", ++partidasJugadas);

//   botones.forEach((boton) =>
//     boton.addEventListener("click", () => atacar(boton.id))
//   );
//   let botonReiniciar = document.getElementById("boton-reiniciar-partida");
//   botonReiniciar.addEventListener("click", reiniciarJuego);
// }
// function incrementarPartida(tipo) {
//   let partidas = localStorage.getItem(tipo) || 0;
//   localStorage.setItem(tipo, ++partidas);
// }

// function verificarAgregarJugador() {
//   const nombreJugador = localStorage.getItem("nombre");

//   if (nombreJugador) {
//     const jugadorExistente = jugadores.find(
//       (jugador) => jugador.nombre === nombreJugador
//     );

//     if (!jugadorExistente) {
//       // Si el jugador no existe en el array, agrégalo con partidas en cero
//       jugadores.push({
//         nombre: nombreJugador,
//         partidasGanadas: 0,
//         partidasPerdidas: 0,
//         partidasJugadas: 0,
//       });
//     }
//   }
// }

// //   if (nombreJugador) {
// //     const indexJugadorActual = topJugadores.findIndex(
// //       (jugador) => jugador.nombre === nombreJugador
// //     );
// //     if (indexJugadorActual !== -1) {
// //       // Actualiza el topJugadores solo si el jugador está en el top
// //       topJugadores[indexJugadorActual].partidasGanadas = parseInt(partidas);
// //     }
// //   }
// // }

// // function incrementarPartida(tipo) {
// //   let partidas = localStorage.getItem(tipo) || 0;
// //   localStorage.setItem(tipo, ++partidas);

// //   if (nombreJugador) {
// //     const indexJugadorActual = topJugadores.findIndex(
// //       (jugador) => jugador.nombre === nombreJugador
// //     );
// //     if (indexJugadorActual !== -1) {
// //       topJugadores[indexJugadorActual].partidasGanadas = parseInt(partidas);
// //     }
// //   }
// // }

// function reiniciarJuego() {
//   Swal.fire({
//     title:
//       "Antes de reiniciar la partida desde cero, ¿deseas ver los resultados guardados?",
//     icon: "question",
//     showCancelButton: true,
//     confirmButtonText: "Sí",
//     cancelButtonText: "No",
//   }).then((result) => {
//     if (result.isConfirmed) {
//       resultadosGuardados();
//     } else {
//       reiniciarPartidaSinMostrarResultados();
//     }
//   });
// }

// function resultadosGuardados() {
//   const nombre = localStorage.getItem("nombre") || "";
//   const nombreMascota = localStorage.getItem("nombreMascota") || "";
//   const partidasJugadas = localStorage.getItem("partidasJugadas") || 0;
//   const partidasGanadas = localStorage.getItem("partidasGanadas") || 0;
//   const partidasPerdidas = localStorage.getItem("partidasPerdidas") || 0;

//   Swal.fire({
//     title: "Resultados guardados:",
//     html: `Nombre: ${nombre}<br>
//       Nombre mascota: ${nombreMascota}<br>
//       Partidas jugadas: ${partidasJugadas}<br>
//       Partidas ganadas: ${partidasGanadas}<br>
//       Partidas perdidas: ${partidasPerdidas}`,
//     confirmButtonText: "OK",
//   }).then(() => {
//     reiniciarPartida();
//     setTimeout(() => {
//       location.reload();
//     }, 0); //utilicé esta función porque cuando aprieto el boton "ok" Me aparece de nuevo el cartel de SweetAlert y a los segundos me recarga la página..
//   });
// }

// function reiniciarPartida() {
//   Swal.fire({
//     title:
//       "Antes de reiniciar la partida desde cero, ¿deseas ver los resultados guardados?",
//     icon: "question",
//     showCancelButton: true,
//     confirmButtonText: "Sí",
//     cancelButtonText: "No",
//   }).then((result) => {
//     if (result.isConfirmed) {
//       resultadosGuardados();
//     } else {
//       reiniciarPartidaSinMostrarResultados();
//     }
//   });
// }

// function reiniciarPartidaSinMostrarResultados() {
//   location.reload();
// }

// function reiniciarJuegoCompleto() {
//   localStorage.clear();

//   window.location.href = "../principal/index.html";
// }

// function mascotaRival() {
//   let seleccionarMascotaRival = aleatorio(1, 6);
//   let spanMascotaRival = document.getElementById("mascota-rival");
//   spanMascotaRival.innerHTML =
//     ["Bambola", "Rufo", "Slade", "Riker", "Ronnie", "Pipo"][
//       seleccionarMascotaRival - 1
//     ] + " ";
// }

// function atacar(idBoton) {
//   let tiposAtaque = {
//     "boton-fuego": "FUEGO🔥",
//     "boton-agua": "AGUA💧",
//     "boton-tierra": "TIERRA🌱",
//   };
//   ataqueJugador = tiposAtaque[idBoton];
//   ataqueAleatorioRival();
// }

// function ataqueAleatorioRival() {
//   let tiposAtaque = ["FUEGO🔥", "AGUA💧", "TIERRA🌱"];
//   ataqueEnemigo = tiposAtaque[aleatorio(0, 2)];
//   combate();
// }

// function combate() {
//   let spanVidasJugador = document.getElementById("vidas-mascota-jugador");
//   let spanVidasEnemigo = document.getElementById("vidas-mascota-rival");

//   if (ataqueJugador == ataqueEnemigo) {
//     crearMensajes("EMPATE.");
//   } else if (
//     (ataqueJugador == "AGUA💧" && ataqueEnemigo == "FUEGO🔥") ||
//     (ataqueJugador == "FUEGO🔥" && ataqueEnemigo == "TIERRA🌱") ||
//     (ataqueJugador == "TIERRA🌱" && ataqueEnemigo == "AGUA💧")
//   ) {
//     crearMensajes("GANASTE!!");
//     vidasEnemigo--;
//     spanVidasEnemigo.innerHTML = vidasEnemigo;
//   } else {
//     crearMensajes("PERDISTE!");
//     vidasJugador--;
//     spanVidasJugador.innerHTML = vidasJugador;
//   }

//   revisarVidas();
// }

// // function revisarVidas() {
// //   if (vidasEnemigo === 0) {
// //     deshabilitarBotones();
// //     incrementarPartida("partidasGanadas");
// //     mostrarTopGanadores();
// //     crearMensajeFinal("La mascota del enemigo se quedó sin vidas! Ganaste!", "partidasGanadas");
// //   } else if (vidasJugador === 0) {
// //     deshabilitarBotones();
// //     incrementarPartida("partidasPerdidas");
// //     crearMensajeFinal("Tu mascota ya no tiene vidas! Perdiste", "partidasPerdidas");
// //   }
// // }

// function deshabilitarBotones() {
//   botones.forEach((boton) => {
//     boton.disabled = true;
//     boton.style.backgroundColor = "grey";
//     boton.innerHTML = "X";
//   });
// }

// function crearMensajes(resultado) {
//   let sectionMensajes = document.getElementById("resultado");
//   let ataqueDelJugador = document.getElementById("ataque-del-jugador");
//   let ataqueDelEnemigo = document.getElementById("ataque-del-enemigo");

//   ataqueDelJugador.innerHTML = "";
//   ataqueDelEnemigo.innerHTML = "";

//   let nuevoAtaqueJugador = document.createElement("p");
//   let nuevoAtaqueEnemigo = document.createElement("p");

//   nuevoAtaqueJugador.innerHTML = `Elegiste ${ataqueJugador}`;
//   nuevoAtaqueEnemigo.innerHTML = `El enemigo eligió ${ataqueEnemigo}`;

//   sectionMensajes.innerHTML = resultado;

//   ataqueDelJugador.appendChild(nuevoAtaqueJugador);
//   ataqueDelEnemigo.appendChild(nuevoAtaqueEnemigo);
// }

// function crearMensajeFinal(resultadoFinal, tipoPartida) {
//   let sectionMensajes = document.getElementById("mensajes");
//   let parrafo = document.createElement("p");

//   parrafo.innerHTML = resultadoFinal;
//   parrafo.style.marginTop = "270px";

//   sectionMensajes.appendChild(parrafo);
//   deshabilitarBotones();
//   incrementarPartida(tipoPartida);
// }
// function incrementarPartidaLocalStorage(tipo, cantidad) {
//   let partidas = localStorage.getItem(tipo) || 0;
//   localStorage.setItem(tipo, parseInt(partidas) + cantidad);
// }

// function aleatorio(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }

// const botonTopGanadores = document.getElementById("boton-top-ganadores");
// botonTopGanadores.addEventListener("click", mostrarTopGanadores);

// function mostrarTopGanadores() {
//   const topGanadores = jugadores
//     .sort((a, b) => b.partidasGanadas - a.partidasGanadas)
//     .slice(0, 4);

//   let mensaje = "<h2>Top 4 Ganadores</h2>";
//   topGanadores.forEach((jugador, index) => {
//     mensaje += `<p>${index + 1}. ${jugador.nombre} - Partidas Ganadas: ${
//       jugador.partidasGanadas
//     }</p>`;
//   });

//   Swal.fire({
//     html: mensaje,
//     confirmButtonText: "OK",
//   });
// }

// window.addEventListener("load", () => {
//   verificarAgregarJugador();
//   iniciarJuego();
// });
