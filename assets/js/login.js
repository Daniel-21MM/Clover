
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const correoInput = document.getElementById('correo');
const contrasenaRegistrarInput = document.getElementById('contrasenaRegistrar');
const usuarioInput = document.getElementById('usuario');
const contrasenaInput = document.getElementById('contrasena');

signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
    // Limpiar los campos de entrada al hacer clic en "Registrarme"
    // usuarioRegistrarInput.value = "";
    correoInput.value = "";
    // contrasenaRegistrarInput.value = "";
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
    // Limpiar los campos de entrada al hacer clic en "Iniciar Sesión"
    usuarioInput.value = "";
    contrasenaInput.value = "";
});
