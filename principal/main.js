console.log("hola");

let form = document.getElementById("form");
let inputNombre = document.getElementById("nombre");
// let boton = document.getElementById("boton");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let nombre = inputNombre.value;

  // Validar que el nombre tenga solo letras
  const error = !/^[a-zA-Z]+$/.test(nombre)
    ? "Nombre incorrecto."
    : // Validar que el nombre tenga entre 3 y 15 caracteres
    nombre.length < 3 || nombre.length > 15
    ? "El nombre debe tener entre 3 y 15 caracteres."
    : // Si pasa todas las validaciones, guardar en LocalStorage y redirigir
      (guardarNombre("nombre", nombre), redirect());

  // Mostrar mensaje de error utilizando SweetAlert si hay un error
  error &&
    Swal.fire({
      // icon: 'error',
      title: "Error",
      text: error,
    });
});

const guardarNombre =(clave,valor) => {
  try {
    localStorage.setItem(clave,valor);
  } catch (error) {
    console.log(`Error al guardar el nombre el localStorage`, error);
  }
}


const redirect = () => {
  // Redirigir a index.html
  window.location.href = "../mascotas/index.html";
};
