let form = document.getElementById("form");
let inputNombre = document.getElementById("nombre");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let nombre = inputNombre.value;

  const error = !/^[a-zA-Z]+$/.test(nombre)
    ? "Nombre incorrecto."
    : nombre.length < 3 || nombre.length > 15
    ? "El nombre debe tener entre 3 y 15 caracteres."
    : (guardarNombre("nombre", nombre), redirect());

  error &&
    Swal.fire({
      title: "Error",
      text: error,
    });
});

const guardarNombre = (clave, valor) => {
  try {
    localStorage.setItem(clave, valor);
  } catch (error) {
    console.log(`Error al guardar el nombre el localStorage`, error);
  }
};

const redirect = () => {
  window.location.href = "../mascotas/index.html";
};
